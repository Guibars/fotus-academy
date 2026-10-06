import type { Equipment, CalculationResults, RecommendedInverterInfo, HVBatteryOption } from './types';
import { INVERTER_STOCK, BATTERIES_STOCK } from './constants.ts';
import { getBatteryUsefulEnergyKwh, isRestrictedLvBattery, isCatalogLvInverterCompatible } from './batteryRules.ts';

export interface SimulationConfig {
    dod: number;
    safetyFactor: number;
    simultaneityFactor: number;
    autonomyDays: number;
    selectedBatteryName: string;
}

    const calculateHVBatteryConfig = (
        totalEnergyNeededWh: number, 
        batteryModuleEnergyWh: number, 
        inverterPower: number, 
        inverterQty: number
    ): { quantity: number, options: HVBatteryOption[] } => {
        
        // 1. Determinar Módulos Necessários (Teórico) para todo o sistema
        const totalModulesNeededTheoretical = Math.ceil(totalEnergyNeededWh / batteryModuleEnergyWh);
        
        // Regra 1: Distribuição entre Inversores
        // Calculamos quantos módulos cada inversor precisa gerenciar para que seja igual
        const modulesPerInverterTheoretical = Math.ceil(totalModulesNeededTheoretical / inverterQty);

        // 2. Definir Limites do Inversor (Regra 2 - Tensão Máxima/Módulos por Série)
        let maxModulesPerString = 13; // Padrão 12-30kW (700V)
        if (inverterPower >= 75000) maxModulesPerString = 16; // 75kW (1000V) 
        else if (inverterPower >= 50000) maxModulesPerString = 15; // 50kW (800V)

        const minModulesPerString = 5; // Regra 4
        const maxBmus = 16; // Regra 3: máximo de 16 BMUs em paralelo

        const possibleConfigs: HVBatteryOption[] = [];

        // Loop para encontrar todas as configurações válidas de BMUs (de 1 a 16)
        for (let bmus = 1; bmus <= maxBmus; bmus++) {
            
            // Regra 5: A quantidade de Packs por BMU tem que ser igual.
            // Quantos módulos por BMU para atender a demanda DESTE inversor?
            let modulesPerBMU = Math.ceil(modulesPerInverterTheoretical / bmus);

            // Se a divisão resultar em menos que o mínimo (ex: 3 módulos), ajustamos para o mínimo
            if (modulesPerBMU < minModulesPerString) {
                modulesPerBMU = minModulesPerString;
            }

            // Verifica se está dentro do limite de tensão do inversor
            if (modulesPerBMU <= maxModulesPerString) {
                
                // O sistema sugerido terá: bmus * modulesPerBMU por inversor
                const totalModulesPerInverter = bmus * modulesPerBMU;
                
                // Agora escala para o SISTEMA TODO (considerando a quantidade de inversores)
                const systemTotalModules = totalModulesPerInverter * inverterQty;
                const systemTotalBMUs = bmus * inverterQty;

                // Descrição amigável - ALTERADO: BMU -> Control Box | mód. -> bat.
                const description = inverterQty > 1 
                    ? `${inverterQty}x Bancos de ${bmus} Control Box com ${modulesPerBMU} bat. cada`
                    : `${bmus} Control Box com ${modulesPerBMU} baterias cada`;

                possibleConfigs.push({
                    id: bmus, // Usando numero de BMUs como ID base
                    totalQuantity: systemTotalModules,
                    totalBMUs: systemTotalBMUs,
                    modulesPerBMU: modulesPerBMU,
                    description: description
                });
            }
        }

        // Ordenar opções:
        // 1. Menor Quantidade Total de Baterias (Custo benefício)
        // 2. Menor Quantidade de BMUs (Menor complexidade de instalação)
        possibleConfigs.sort((a, b) => {
            if (a.totalQuantity !== b.totalQuantity) return a.totalQuantity - b.totalQuantity;
            return a.totalBMUs - b.totalBMUs;
        });

        // Pegar as Top 3
        const topOptions = possibleConfigs.slice(0, 3);
        if (topOptions.length > 0) topOptions[0].isBestOption = true;

        // Retorno padrão (primeira opção) e lista completa
        return {
            quantity: topOptions.length > 0 ? topOptions[0].totalQuantity : totalModulesNeededTheoretical,
            options: topOptions
        };
    };


    export const calculateHybrid = (equipmentList: Equipment[], selectedGridVoltage: string, config: SimulationConfig): CalculationResults => {
        // Realiza o cálculo imediatamente (sem delay artificial de carregamento)
        const { dod, safetyFactor, simultaneityFactor, autonomyDays, selectedBatteryName } = config;
        
        const totalPower = equipmentList.reduce((acc, item) => acc + (item.power * item.quantity), 0);
        const dailyConsumption = equipmentList.reduce((acc, item) => acc + (item.power * item.quantity * item.hours), 0);
        
        const realSimultaneousPeak = totalPower * (simultaneityFactor / 100);
        const correctedDailyConsumptionWh = dailyConsumption * autonomyDays * (1 + (safetyFactor / 100));

        // --- SELEÇÃO DE INVERSOR ---
        // Filter Inverters based on selected Grid
        let targetGridType: 'monophasic' | 'triphasic' | 'off-grid' | 'split-phase';
        let powerDeratingDivisor = 1; // Padrão é 1 (sem perda)
        
        if (selectedGridVoltage === 'Off-Grid') {
            targetGridType = 'off-grid';
        } else if (selectedGridVoltage === 'Split-Phase') {
            targetGridType = 'split-phase';
        } else if (selectedGridVoltage === 'Triphasic-220V') {
            targetGridType = 'triphasic';
            // O novo inversor é nativo 220V, então não tem derating
            powerDeratingDivisor = 1; 
        } else if (selectedGridVoltage === '380V') {
            targetGridType = 'triphasic';
        } else {
            targetGridType = 'monophasic';
        }
        
        // 1. Filtra pelo tipo de rede
        let filteredInverters = INVERTER_STOCK.filter(inv => inv.gridType === targetGridType);

        // Filtros específicos por tensão
        if (selectedGridVoltage === 'Mono-127V') {
            filteredInverters = filteredInverters.filter(inv => inv.name.includes('127V'));
        } else if (selectedGridVoltage === '220V') {
            filteredInverters = filteredInverters.filter(inv => !inv.name.includes('127V'));
        } else if (selectedGridVoltage === 'Triphasic-220V') {
            filteredInverters = filteredInverters.filter(inv => inv.name.includes('ET-LL-G10'));
        } else if (selectedGridVoltage === '380V') {
            filteredInverters = filteredInverters.filter(inv => !inv.name.includes('ET-LL-G10'));
        }

        // 2. REGRA DE COMPATIBILIDADE DE BATERIA
        const isDeyeBattery = selectedBatteryName.toLowerCase().includes('deye');
        const isGoodWeBattery = selectedBatteryName.toLowerCase().includes('goodwe') || selectedBatteryName.includes('LX-A5.0-30');
        const isUnipowerBattery = selectedBatteryName.toLowerCase().includes('unipower');

        if (isRestrictedLvBattery(selectedBatteryName)) {
            filteredInverters = filteredInverters.filter(inverter => isCatalogLvInverterCompatible(selectedBatteryName, inverter));
        }
        
        // Bateria Deye SÓ é compatível com inversores Deye (em qualquer tensão)
        if (isDeyeBattery) {
            filteredInverters = filteredInverters.filter(inv => inv.name.toLowerCase().includes('deye'));
        }
        
        // Bateria GoodWe SÓ é compatível com inversores GoodWe (em qualquer tensão)
        if (isGoodWeBattery) {
            filteredInverters = filteredInverters.filter(inv => inv.name.toLowerCase().includes('goodwe'));
        }

        // Regras de Compatibilidade da Bateria Unipower
        if (isUnipowerBattery) {
            if (selectedGridVoltage === 'Split-Phase') {
                // Compatível com Deye Split Phase, NÃO com GoodWe
                filteredInverters = filteredInverters.filter(inv => !inv.name.toLowerCase().includes('goodwe'));
            } else if (selectedGridVoltage === 'Off-Grid') {
                // Compatível com Deye Off-Grid
                filteredInverters = filteredInverters.filter(inv => inv.name.toLowerCase().includes('deye'));
            } else if (selectedGridVoltage === 'Triphasic-220V' || selectedGridVoltage === '380V') {
                // Não compatível com trifásicos
                filteredInverters = [];
            }
            // Para Mono-127V e 220V, continua compatível com os modelos monofásicos (Solplanet, GoodWe, Deye) que já foram filtrados.
        }

        const potentialSolutions: RecommendedInverterInfo[] = filteredInverters.map(inverter => {
            const effectivePower = inverter.power / powerDeratingDivisor;
            const qtyForPower = Math.ceil(realSimultaneousPeak / effectivePower);
            const quantity = Math.max(1, qtyForPower);

            let displayInverter = inverter;
            if (powerDeratingDivisor > 1) {
                displayInverter = {
                    ...inverter,
                    power: Math.floor(effectivePower)
                };
            }

            return { inverter: displayInverter, quantity };
        });

        // --- CORREÇÃO DE ORDENAÇÃO DE INVERSORES ---
        // Prioridade 1: Menor Quantidade de Equipamentos (Unificar em inversor maior)
        // Prioridade 2: Menor "Sobra" de Potência (Ajuste fino)
        const sortedSolutions = potentialSolutions
            .filter(sol => (sol.inverter.power * sol.quantity) >= realSimultaneousPeak)
            .sort((a, b) => {
                // 1. Prioriza MENOR QUANTIDADE (Ex: 1x 75k ganha de 5x 15k)
                if (a.quantity !== b.quantity) {
                    return a.quantity - b.quantity;
                }
                // 2. Desempate: Menor capacidade total (mais próximo da demanda)
                const totalPowerA = a.inverter.power * a.quantity;
                const totalPowerB = b.inverter.power * b.quantity;
                return totalPowerA - totalPowerB;
            });

        let primaryInverter: RecommendedInverterInfo | null = null;
        let alternativeInverters: RecommendedInverterInfo[] = [];

        if (sortedSolutions.length > 0) {
            primaryInverter = sortedSolutions[0];
            alternativeInverters = sortedSolutions.slice(1);
        }

        // --- CÁLCULO DE BATERIA ---
        const selectedBattery = BATTERIES_STOCK.find(b => b.name === selectedBatteryName) || BATTERIES_STOCK[0];
        
        // Energia útil unitária (Wh)
        const singleBatteryUsefulEnergyWh = getBatteryUsefulEnergyKwh(selectedBattery, dod) * 1000;
        
        let batteryResultQuantity = 0;
        let hvOptions: HVBatteryOption[] | undefined = undefined;

        if (selectedBattery.voltageType === 'HV' && primaryInverter) {
            // Lógica HV Complexa
            const hvCalc = calculateHVBatteryConfig(
                correctedDailyConsumptionWh,
                singleBatteryUsefulEnergyWh, // Usando energia útil como base de cálculo
                primaryInverter.inverter.power, // Passa potência ORIGINAL (para saber limite de tensão)
                primaryInverter.quantity
            );
            batteryResultQuantity = hvCalc.quantity;
            hvOptions = hvCalc.options;

        } else {
            // Lógica LV Simples
            batteryResultQuantity = singleBatteryUsefulEnergyWh > 0 ? Math.ceil(correctedDailyConsumptionWh / singleBatteryUsefulEnergyWh) : 0;
        }

        let recommendedBatteryQuantity = Math.max(1, batteryResultQuantity);
        let warning: string | null = null;
        
        // Verifica o limite de baterias em paralelo
        if (recommendedBatteryQuantity > selectedBattery.parallelUnits) {
            warning = `A bateria selecionada suporta no máximo ${selectedBattery.parallelUnits} unidades em paralelo. O dimensionamento exigiu ${recommendedBatteryQuantity} unidades. Sugerimos dividir o sistema utilizando 2 ou mais inversores para fracionar o banco de baterias, ou reavaliar o dimensionamento das cargas.`;
            recommendedBatteryQuantity = selectedBattery.parallelUnits;
        }

        const recommendedBattery = {
            battery: selectedBattery,
            quantity: recommendedBatteryQuantity,
            originalRequiredQuantity: recommendedBatteryQuantity !== Math.max(1, batteryResultQuantity) ? Math.max(1, batteryResultQuantity) : undefined,
            options: hvOptions
        };

        // --- CÁLCULO DE AUTONOMIA ESTIMADA ---
        const totalBankUsefulEnergyWh = singleBatteryUsefulEnergyWh * recommendedBattery.quantity;
        const estimatedAutonomyHours = dailyConsumption > 0 
            ? (totalBankUsefulEnergyWh / (dailyConsumption / 24)) 
            : 0;

        
        const calculationResults: CalculationResults = {
            totalPower,
            dailyConsumption,
            simultaneousPeak: realSimultaneousPeak,
            estimatedAutonomyHours,
            primaryInverter,
            alternativeInverters,
            warning,
            recommendedBattery
        };

        return calculationResults;
    };
    
    // Triggered when user selects a grid in Intro
