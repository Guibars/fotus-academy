
import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { Equipment, PredefinedEquipment, Battery } from '../types';
import { PREDEFINED_EQUIPMENT, BATTERIES_STOCK } from '../constants';
import { getBatteryUsefulEnergyKwh, isSecpowerBattery } from '../batteryRules';
import GlassCard from './GlassCard';
import { 
    PlusIcon, TrashIcon, HouseIcon, BatteryIcon, PowerIcon, 
    ClockIcon, TagIcon, CollectionIcon, ShieldCheckIcon, CalendarDaysIcon, 
    ArrowPathIcon, RectangleStackIcon, SparklesIcon, SunIcon, MoonIcon, LinkIcon,
    InformationCircleIcon, ExclamationTriangleIcon, Cog6ToothIcon, ModuleIcon, InverterBoxIcon, BoltIcon,
    PlugIcon, ChartBarIcon
} from './icons/Icons';

interface SimulationConfig {
    dod: number;
    safetyFactor: number;
    simultaneityFactor: number;
    autonomyDays: number;
    selectedBatteryName: string;
}

interface SimulationScreenProps {
    equipmentList: Equipment[];
    setEquipmentList: React.Dispatch<React.SetStateAction<Equipment[]>>;
    onCalculate: (config: SimulationConfig) => void;
    gridVoltage: string;
}

const AnimatedNumber = ({ value, duration = 1000, formatter }: { value: number; duration?: number; formatter: (n: number) => string }) => {
    const [displayValue, setDisplayValue] = useState(value);
    const [pulse, setPulse] = useState(false);
    const valueRef = useRef(value);

    useEffect(() => {
        const startValue = valueRef.current;
        const endValue = value;
        let startTime: number | null = null;
        
        if (startValue !== endValue) {
            setPulse(true);
            setTimeout(() => setPulse(false), 700);
        }

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            const easedPercentage = 1 - Math.pow(1 - percentage, 3);

            const currentValue = startValue + (endValue - startValue) * easedPercentage;
            setDisplayValue(currentValue);

            if (progress < duration) {
                requestAnimationFrame(animate);
            } else {
                setDisplayValue(endValue);
                valueRef.current = endValue;
            }
        };
        requestAnimationFrame(animate);
        return () => { valueRef.current = endValue; };
    }, [value, duration]);

    return <span className={`font-mono transition-colors duration-300 ${pulse ? 'text-[#0d518e]' : 'text-slate-800'}`}>{formatter(displayValue)}</span>;
};

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode }> = ({ icon, label, value }) => (
    <div className="flex items-center justify-between py-2 border-b border-slate-200 last:border-0">
        <div className="flex items-center gap-3 text-slate-600">
            <div className="p-1.5 rounded-md bg-blue-50">
                {icon}
            </div>
            <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="font-semibold text-slate-800 text-sm font-mono tracking-wide">{value}</span>
    </div>
);

const Toast: React.FC<{ message: string }> = ({ message }) => (
    <div className="fixed top-24 right-5 z-50 animate-pop-in">
        <div className="flex items-center gap-3 bg-[#FAB515] text-[#020617] font-bold px-6 py-4 rounded-2xl shadow-sm border border-slate-200">
            <ExclamationTriangleIcon className="w-6 h-6"/>
            <span className="font-bold">{message}</span>
        </div>
    </div>
);

const DoDCircle: React.FC<{ value: number }> = ({ value }) => {
    const size = 50;
    const strokeWidth = 4;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const circumferenceOffset = circumference - (value / 100) * circumference;

    return (
        <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
            <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
                <circle className="text-slate-700" stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" r={radius} cx={size/2} cy={size/2} />
                <circle
                    className="text-[#0d518e]"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={circumferenceOffset}
                    strokeLinecap="round"
                    fill="transparent"
                    r={radius}
                    cx={size/2}
                    cy={size/2}
                    style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-800 font-mono">
                {value}%
            </span>
        </div>
    );
};


const SimulationScreen: React.FC<SimulationScreenProps> = ({ equipmentList, setEquipmentList, onCalculate, gridVoltage }) => {
    const [newItem, setNewItem] = useState({ name: '', power: '', quantity: '1', hours: '' });
    
    // Filter available batteries based on grid voltage 
    const availableBatteries = useMemo(() => {
        const isHighVoltage = gridVoltage === '380V'; // 380V uses HV (Deye) and LV (GoodWe)
        let batteries = BATTERIES_STOCK.filter(b => isHighVoltage ? b.voltageType === 'HV' : b.voltageType === 'LV');
        
        if (gridVoltage === 'Triphasic-220V') {
            // Only GoodWe battery
            batteries = batteries.filter(b => b.name.toLowerCase().includes('goodwe'));
        } else if (gridVoltage === '380V') {
            // Include GoodWe LV battery for 380V GoodWe inverters
            const goodweBattery = BATTERIES_STOCK.find(b => b.name.toLowerCase().includes('goodwe'));
            if (goodweBattery && !batteries.some(b => b.name === goodweBattery.name)) {
                batteries.push(goodweBattery);
            }
        }
        // Monofásico 127V só possui GoodWe no portfólio, incompatível com Sec Power.
        return batteries.filter(b => !isSecpowerBattery(b.name) || ['Off-Grid', '220V', 'Split-Phase'].includes(gridVoltage));
    }, [gridVoltage]);

    const [config, setConfig] = useState<SimulationConfig>({
        dod: 80,
        safetyFactor: 10,
        simultaneityFactor: 100,
        autonomyDays: 1,
        selectedBatteryName: availableBatteries[0]?.name || BATTERIES_STOCK[0].name,
    });
    
    // Reset selected battery if available options change
    useEffect(() => {
        setConfig(prev => {
            const isCurrentBatteryAvailable = availableBatteries.some(b => b.name === prev.selectedBatteryName);
            const isCurrentBatteryDisabled = (gridVoltage === 'Mono-127V' && prev.selectedBatteryName.toLowerCase().includes('deye')) || 
                                             (gridVoltage === 'Off-Grid' && prev.selectedBatteryName.toLowerCase().includes('goodwe'));
            
            if (isCurrentBatteryAvailable && !isCurrentBatteryDisabled) {
                return prev;
            }
            
            const defaultBattery = availableBatteries.find(b => {
                const isDeye = b.name.toLowerCase().includes('deye');
                const isGoodWe = b.name.toLowerCase().includes('goodwe');
                return !(gridVoltage === 'Mono-127V' && isDeye) && !(gridVoltage === 'Off-Grid' && isGoodWe);
            }) || availableBatteries[0];
            
            return {
                ...prev,
                selectedBatteryName: defaultBattery?.name || prev.selectedBatteryName
            };
        });
    }, [availableBatteries, gridVoltage]);

    const selectedBattery = useMemo(() => 
        BATTERIES_STOCK.find(b => b.name === config.selectedBatteryName) || BATTERIES_STOCK[0], 
        [config.selectedBatteryName]
    );

    // Auto-update DoD if Battery is HV or LV
    useEffect(() => {
        if (selectedBattery.recommendedDod) {
            setConfig(prev => ({ ...prev, dod: selectedBattery.recommendedDod! }));
        } else if (selectedBattery.name.includes('LX-A5.0-30')) {
            setConfig(prev => ({ ...prev, dod: 100 }));
        } else if (selectedBattery.voltageType === 'HV') {
            setConfig(prev => ({ ...prev, dod: 90 }));
        } else {
            setConfig(prev => ({ ...prev, dod: 80 }));
        }
    }, [selectedBattery]);

    const [pulseSummary, setPulseSummary] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [isExiting, setIsExiting] = useState(false); // State for exit animation
    
    const isNewItemValid = useMemo(() => {
        const power = parseFloat(newItem.power);
        const quantity = parseInt(newItem.quantity, 10);
        const hours = parseFloat(newItem.hours);
        return newItem.name.trim() !== '' && !isNaN(power) && power > 0 && !isNaN(quantity) && quantity > 0 && !isNaN(hours) && hours > 0 && hours <= 24 && Number.isInteger(Number(newItem.quantity));
    }, [newItem]);

    
    useEffect(() => {
      if (toastMessage) {
        const timer = setTimeout(() => setToastMessage(null), 3800);
        return () => clearTimeout(timer);
      }
    }, [toastMessage]);

    const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setConfig(prev => ({ ...prev, [name]: parseFloat(value) || value }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewItem(prev => ({ ...prev, [name]: value }));
    };

    const addEquipment = () => {
        if (isNewItemValid) {
            const newEquipment: Equipment = {
                id: crypto.randomUUID(), 
                name: newItem.name, 
                power: parseFloat(newItem.power), 
                quantity: parseInt(newItem.quantity, 10), 
                hours: parseFloat(newItem.hours),
            };
            setEquipmentList(prev => [...prev, newEquipment]);
            setNewItem({ name: '', power: '', quantity: '1', hours: '' });
            setPulseSummary(true);
            setTimeout(() => setPulseSummary(false), 300);
        }
    };
    
    const handlePredefinedSelect = (item: PredefinedEquipment) => {
        setNewItem({ name: item.name, power: item.power.toString(), quantity: '1', hours: '' });
    };

    const removeEquipment = (id: string) => {
        setEquipmentList(prev => prev.filter(item => item.id !== id));
    };

    const handleCalculateClick = () => {
        if (equipmentList.length === 0) {
            setToastMessage("Adicione equipamentos para simular.");
            return;
        }
        setIsCalculating(true);
        setIsExiting(true); // Trigger the exit animation
        
        // Wait for the animation to finish before actually calculating/changing screen
        setTimeout(() => {
            onCalculate(config);
        }, 800);
    };

    const memoizedTotals = useMemo(() => {
        const totalPower = equipmentList.reduce((acc, item) => acc + (item.power * item.quantity), 0);
        const dailyConsumption = equipmentList.reduce((acc, item) => acc + (item.power * item.quantity * item.hours), 0);
        return { totalPower, dailyConsumption };
    }, [equipmentList]);

    return (
        <div className="min-h-0 text-slate-800 p-4 md:p-8 pt-6 relative overflow-hidden">
            {/* Toast Notification */}
            {toastMessage && <Toast message={toastMessage} />}
            
            {/* MAIN CONTENT WRAPPER WITH TRANSITION */}
            <div className={`max-w-7xl mx-auto relative z-10 transition-all duration-1000 ease-in-out transform ${isExiting ? '-translate-x-[150px] opacity-0 scale-95' : 'translate-x-0 opacity-100 scale-100'}`}>
                <div className="text-center mb-10">
                    {/* Título com Kerning 0 */}
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-normal uppercase">
                        Conecta Híbridos
                    </h1>
                    <div className="h-1 w-20 bg-gradient-to-r from-transparent via-[#FAB515] to-transparent mx-auto mt-2 mb-4 opacity-70"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column (Inputs) */}
                    <div className="lg:col-span-8 space-y-8">
                        
                        {/* ADICIONAR CARGAS CARD - Premium Style (glass-thick) */}
                        <GlassCard variant="premium" className="p-6 md:p-8 animate-fade-in-up rounded-[2rem] relative overflow-hidden group">
                            
                            <div className="flex items-center gap-4 mb-8 pl-2">
                                <div className="p-3 bg-gradient-to-br from-[#FAB515] to-orange-600 rounded-2xl text-black shadow-lg shadow-orange-500/20">
                                    <PlugIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Adicionar Cargas</h2>
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Defina o perfil de consumo</p>
                                </div>
                            </div>
                            
                            {/* Pílulas de Sugestão - Aumentado tamanho da fonte */}
                            <div className="mb-8">
                                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <SparklesIcon className="w-3 h-3 text-[#0d518e]" />
                                    Sugestões Rápidas
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {PREDEFINED_EQUIPMENT.map(item => (
                                        <button 
                                            key={item.name} 
                                            onClick={() => handlePredefinedSelect(item)} 
                                            className="group/chip relative px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 hover:border-[#FAB515]/70 hover:bg-[#FAB515]/10 transition-all duration-300 active:scale-95 overflow-hidden"
                                        >
                                            {/* Font size aumentado para text-sm */}
                                            <span className="relative z-10 text-sm font-medium text-slate-600 group-hover/chip:text-[#0d518e] transition-colors">{item.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Inputs Futuristas - Background Escuro para Contraste com Vidro */}
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end mb-8">
                                <div className="md:col-span-4 space-y-2">
                                    <label className="text-xs text-slate-500 font-bold uppercase tracking-wider ml-1">Equipamento</label>
                                    <div className="group relative">
                                        <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center text-slate-500 group-focus-within:text-[#0d518e] transition-colors z-10">
                                            <TagIcon className="w-4 h-4"/>
                                        </div>
                                        <input 
                                            type="text" 
                                            name="name" aria-label="Nome do equipamento" 
                                            value={newItem.name} 
                                            onChange={handleInputChange} 
                                            placeholder="Ex: Geladeira" 
                                            className="w-full bg-slate-50 border-b-2 border-slate-200 text-slate-800 text-sm rounded-t-lg pl-10 pr-4 py-3 focus:outline-none focus:border-[#FAB515] focus:bg-slate-100 transition-all placeholder-slate-600"
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-3 space-y-2">
                                    <label className="text-xs text-slate-500 font-bold uppercase tracking-wider ml-1">Potência (W)</label>
                                    <div className="group relative">
                                        <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center text-slate-500 group-focus-within:text-[#0d518e] transition-colors z-10">
                                            <BoltIcon className="w-4 h-4"/>
                                        </div>
                                        <input 
                                            type="number" 
                                            name="power" aria-label="Potência (W)" min="1" step="any"
                                            value={newItem.power} 
                                            onChange={handleInputChange} 
                                            placeholder="0" 
                                            className="w-full bg-slate-50 border-b-2 border-slate-200 text-slate-800 text-sm rounded-t-lg pl-10 pr-4 py-3 focus:outline-none focus:border-[#FAB515] focus:bg-slate-100 transition-all placeholder-slate-600"
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs text-slate-500 font-bold uppercase tracking-wider ml-1">Qtd.</label>
                                    <div className="group relative">
                                        <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center text-slate-500 group-focus-within:text-[#0d518e] transition-colors z-10">
                                            <CollectionIcon className="w-4 h-4"/>
                                        </div>
                                        <input 
                                            type="number" 
                                            name="quantity" aria-label="Quantidade" min="1" step="1"
                                            value={newItem.quantity} 
                                            onChange={handleInputChange} 
                                            placeholder="1" 
                                            className="w-full bg-slate-50 border-b-2 border-slate-200 text-slate-800 text-sm rounded-t-lg pl-10 pr-4 py-3 focus:outline-none focus:border-[#FAB515] focus:bg-slate-100 transition-all placeholder-slate-600"
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-3 space-y-2">
                                    <label className="text-xs text-slate-500 font-bold uppercase tracking-wider ml-1">Uso (h/dia)</label>
                                    <div className="group relative">
                                        <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center text-slate-500 group-focus-within:text-[#0d518e] transition-colors z-10">
                                            <ClockIcon className="w-4 h-4"/>
                                        </div>
                                        <input 
                                            type="number" 
                                            name="hours" aria-label="Uso (h/dia)" min="0.1" max="24" step="any"
                                            value={newItem.hours} 
                                            onChange={handleInputChange} 
                                            placeholder="Horas" 
                                            className="w-full bg-slate-50 border-b-2 border-slate-200 text-slate-800 text-sm rounded-t-lg pl-10 pr-4 py-3 focus:outline-none focus:border-[#FAB515] focus:bg-slate-100 transition-all placeholder-slate-600"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <button 
                                onClick={addEquipment} 
                                className={`w-full py-4 rounded-xl font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${isNewItemValid ? 'bg-[#FAB515] text-[#020617] hover:bg-[#eab308] hover:shadow-[#FAB515]/20 hover:scale-[1.01]' : 'bg-slate-100 text-slate-500 cursor-not-allowed border border-slate-200'}`}
                                disabled={!isNewItemValid}
                            >
                                <PlusIcon className={`w-5 h-5 ${isNewItemValid ? 'animate-pulse' : ''}`} /> 
                                Inserir na Lista
                            </button>
                        </GlassCard>

                        <div className="animate-fade-in-up" style={{ animationDelay: '150ms' }}>
                            <div className="flex justify-between items-center mb-4 px-2">
                                <h2 className="text-lg font-bold text-slate-700">Inventário de Cargas</h2>
                                <span className="text-xs font-mono text-[#0d518e] bg-[#FAB515]/10 px-3 py-1.5 rounded-full border border-[#FAB515]/30">{equipmentList.length} ITENS</span>
                            </div>
                            
                            <div className="space-y-3">
                                {equipmentList.map((item, index) => (
                                    <div key={item.id} className="animate-pop-in" style={{ animationDelay: `${index * 50}ms` }}>
                                        {/* Atualizado para variant="premium" para mais blur e consistência */}
                                        <GlassCard variant="premium" className="p-4 flex items-center justify-between border-l-[4px] border-l-[#FAB515] hover:bg-blue-50 transition-colors rounded-2xl">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-slate-200 flex items-center justify-center font-bold text-lg text-[#0d518e]">
                                                    {item.quantity}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 text-base md:text-lg">{item.name}</p>
                                                    <div className="flex gap-4 text-xs text-slate-500 mt-1">
                                                        <span className="flex items-center gap-1.5 bg-blue-50 px-2 py-0.5 rounded font-medium"><BoltIcon className="w-3.5 h-3.5 text-blue-400"/> {item.power.toLocaleString('pt-BR')} W</span>
                                                        <span className="flex items-center gap-1.5 bg-blue-50 px-2 py-0.5 rounded font-medium"><ClockIcon className="w-3.5 h-3.5 text-blue-400"/> {item.hours} h/dia</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                 <div className="text-right hidden sm:block">
                                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Consumo/Dia</p>
                                                    <p className="text-[#0d518e] font-mono font-bold text-lg">{((item.power * item.quantity * item.hours)).toLocaleString('pt-BR')} Wh</p>
                                                 </div>
                                                <button aria-label={`Remover ${item.name}`} onClick={() => removeEquipment(item.id)} className="p-3 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </GlassCard>
                                    </div>
                                ))}
                                {equipmentList.length === 0 && (
                                    <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-3xl bg-blue-50">
                                        <CollectionIcon className="w-16 h-16 text-slate-700 mx-auto mb-4"/>
                                        <p className="text-slate-500 font-medium">Sua lista está vazia.</p>
                                        <p className="text-slate-600 text-sm mt-1">Adicione equipamentos acima para começar.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Live Summary & Config) */}
                    <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24 h-fit">
                        
                        {/* UPDATE: HUD Summary Card - Padronizado com GlassCard Premium */}
                        <GlassCard variant="premium" className={`p-6 relative overflow-hidden transition-all duration-300 rounded-[2rem] ${pulseSummary ? 'scale-[1.02]' : ''}`}>
                            
                            {/* Dashboard Header */}
                            <div className="flex items-center justify-between mb-2 relative z-10">
                                <div className="flex items-center gap-2 text-slate-600">
                                    <div className="w-2 h-2 rounded-full bg-[#FAB515] animate-pulse"></div> 
                                    <span className="text-xs font-bold font-bold uppercase tracking-[0.15em]">Resumo em Tempo Real</span>
                                </div>
                            </div>
                             {/* Subtítulo aumentado para melhor leitura */}
                             <p className="text-sm font-medium text-slate-500 mb-6 relative z-10">Monitoramento instantâneo de carga</p>
                            
                            <div className="space-y-4 relative z-10">
                                {/* Power Module */}
                                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl relative overflow-hidden group">
                                    <div className="flex items-baseline gap-1 mb-2 relative z-10 justify-between">
                                        <p className="text-slate-500 text-[10px] font-bold uppercase">Pico</p>
                                        <BoltIcon className="w-4 h-4 text-[#0d518e]" />
                                    </div>
                                    
                                    <div className="flex items-baseline gap-1 mb-4 relative z-10">
                                        <span className="text-3xl font-bold text-slate-800 font-mono tracking-tighter ">
                                            <AnimatedNumber value={memoizedTotals.totalPower} formatter={(n) => Math.round(n).toLocaleString('pt-BR')} />
                                        </span>
                                        <span className="text-sm text-[#0d518e] font-bold">W</span>
                                    </div>

                                    {/* Advanced Progress Bar */}
                                    <div className="w-full bg-slate-100/80 h-1.5 rounded-full overflow-hidden border border-slate-200 relative">
                                        <div className="h-full bg-gradient-to-r from-[#0f508e] via-cyan-400 to-[#FAB515] relative shadow-sm" style={{ width: `${Math.min((memoizedTotals.totalPower / 10000) * 100, 100)}%`, transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                                            <div className="absolute right-0 top-0 bottom-0 w-2 bg-white blur-[2px]"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Energy Module */}
                                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl relative overflow-hidden group">
                                     <div className="flex items-baseline gap-1 mb-2 relative z-10 justify-between">
                                        <p className="text-slate-500 text-[10px] font-bold uppercase">Dia</p>
                                        <BatteryIcon className="w-4 h-4 text-[#0d518e]" />
                                    </div>
                                    
                                    <div className="flex items-baseline gap-1 mb-4 relative z-10">
                                        <span className="text-3xl font-bold text-slate-800 font-mono tracking-tighter ">
                                            <AnimatedNumber value={memoizedTotals.dailyConsumption / 1000} formatter={(n) => n.toFixed(2).replace('.', ',')} />
                                        </span>
                                        <span className="text-sm text-[#0d518e] font-bold">kWh</span>
                                    </div>

                                    {/* Advanced Progress Bar */}
                                    <div className="w-full bg-slate-100/80 h-1.5 rounded-full overflow-hidden border border-slate-200 relative">
                                        <div className="h-full bg-gradient-to-r from-[#0f508e] to-[#FAB515] relative shadow-sm" style={{ width: `${Math.min((memoizedTotals.dailyConsumption / 25000) * 100, 100)}%`, transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                                             <div className="absolute right-0 top-0 bottom-0 w-2 bg-white blur-[2px]"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </GlassCard>

                        {/* Battery Config Card */}
                        <GlassCard variant="premium" className="p-6 space-y-5 hover-glow-card rounded-3xl">
                            <div className="flex items-center gap-2 mb-2">
                                <BatteryIcon className="w-5 h-5 text-[#0d518e]" />
                                <h3 className="font-bold text-slate-800">Banco de Baterias</h3>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs text-slate-500 font-bold uppercase">Modelo de Bateria</label>
                                <div className="relative">
                                    <select 
                                        name="selectedBatteryName" aria-label="Modelo de bateria"
                                        value={config.selectedBatteryName} 
                                        onChange={handleConfigChange} 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 appearance-none cursor-pointer focus:outline-none focus:border-[#FAB515] transition-colors font-medium"
                                    >
                                        {availableBatteries.map(b => {
                                            const isDeyeIncompatible = gridVoltage === 'Mono-127V' && b.name.toLowerCase().includes('deye');
                                            const isGoodWeIncompatible = gridVoltage === 'Off-Grid' && b.name.toLowerCase().includes('goodwe');
                                            const isDisabled = isDeyeIncompatible || isGoodWeIncompatible;
                                            return (
                                                <option key={b.name} value={b.name} className="bg-white text-slate-800" disabled={isDisabled}>
                                                    {b.name} {isDisabled ? '(Incompatível)' : ''}
                                                </option>
                                            );
                                        })}
                                    </select>
                                    <div className="absolute right-4 top-3.5 pointer-events-none text-slate-500">▼</div>
                                </div>
                            </div>
                            
                            {/* AVISO TÉCNICO DE INSTALAÇÃO */}
                            {selectedBattery.installationWarning && (
                                <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-start gap-3 animate-fade-in">
                                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-yellow-200/90 leading-relaxed font-medium">
                                        {selectedBattery.installationWarning}
                                    </p>
                                </div>
                            )}

                            {/* Battery Details */}
                            <div className="bg-white/50 rounded-xl p-4 border border-slate-200 space-y-1">
                                <InfoRow icon={<BoltIcon className="w-4 h-4 text-[#0d518e]"/>} label="Tensão" value={`${selectedBattery.voltage}V`} />
                                <InfoRow icon={<RectangleStackIcon className="w-4 h-4 text-[#0d518e]"/>} label="Capacidade" value={`${selectedBattery.capacityAh} Ah`} />
                                <InfoRow icon={<SparklesIcon className="w-4 h-4 text-[#0d518e]"/>} label="Energia Útil" value={`${getBatteryUsefulEnergyKwh(selectedBattery, config.dod).toFixed(2)} kWh`} />
                            </div>

                            <div className="flex items-center gap-4 pt-2">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="text-xs text-slate-500 font-bold uppercase">Profundidade (DoD)</label>
                                        <div className="bg-slate-100 px-2 py-0.5 rounded text-xs font-mono text-[#0d518e]">{config.dod}%</div>
                                    </div>
                                    <input 
                                        type="range" 
                                        name="dod" aria-label="Profundidade de descarga (DoD)"
                                        value={config.dod} 
                                        onChange={handleConfigChange} 
                                        min="10" 
                                        max={selectedBattery.maximumDod ?? 100}
                                        disabled={selectedBattery.name.includes('LX-A5.0-30')}
                                        className={`w-full h-2 bg-slate-700 rounded-lg appearance-none ${selectedBattery.name.includes('LX-A5.0-30') ? 'cursor-not-allowed opacity-50' : 'cursor-pointer accent-[#FAB515]'}`} 
                                    />
                                </div>
                                <DoDCircle value={config.dod} />
                            </div>
                        </GlassCard>

                        {/* Advanced Configs */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Autonomy Card */}
                            <GlassCard variant="lite" className="p-4 flex flex-col items-center justify-between text-center hover:border-[#0f508e] transition-colors group rounded-3xl h-32">
                                <div className="flex flex-col items-center">
                                    {/* Icon updated to yellow #FAB515 */}
                                    <MoonIcon className="w-5 h-5 text-[#0d518e] mb-1 group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] text-slate-500 font-bold uppercase">Autonomia</span>
                                </div>
                                <div className="flex items-center justify-center gap-3 w-full">
                                    <button onClick={() => setConfig(p => ({...p, autonomyDays: Math.max(1, p.autonomyDays - 1)}))} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-blue-100 flex items-center justify-center font-bold text-slate-800 transition-colors">-</button>
                                    <div className="flex flex-col">
                                        <span className="font-mono font-bold text-xl text-slate-800 leading-none">{config.autonomyDays}</span>
                                        <span className="text-[9px] text-slate-500 uppercase">Dias</span>
                                    </div>
                                    <button onClick={() => setConfig(p => ({...p, autonomyDays: Math.min(7, p.autonomyDays + 1)}))} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-blue-100 flex items-center justify-center font-bold text-slate-800 transition-colors">+</button>
                                </div>
                            </GlassCard>

                            {/* Simultaneity Card */}
                            <GlassCard variant="lite" className="p-4 flex flex-col justify-between text-center hover:border-[#0f508e] transition-colors group rounded-3xl h-32">
                                <div className="flex flex-col items-center">
                                    {/* Icon updated to yellow #FAB515 */}
                                    <LinkIcon className="w-5 h-5 text-[#0d518e] mb-1 group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] text-slate-500 font-bold uppercase">Simultaneidade</span>
                                </div>
                                <div className="w-full">
                                     <div className="text-center mb-1">
                                         <span className="font-mono font-bold text-xl text-[#0d518e]">{config.simultaneityFactor}%</span>
                                     </div>
                                     <input type="range" name="simultaneityFactor" aria-label="Simultaneidade" value={config.simultaneityFactor} onChange={handleConfigChange} min="10" max="100" step="5" className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#0f508e]"/>
                                </div>
                            </GlassCard>
                            
                            {/* Safety Factor Card */}
                            <div className="col-span-2">
                                <GlassCard variant="lite" className="p-4 flex flex-row items-center justify-between text-center hover:border-[#FAB515]/50 transition-colors group rounded-3xl">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-slate-100 rounded-lg">
                                            <ShieldCheckIcon className="w-5 h-5 text-[#0d518e]" />
                                        </div>
                                        <div className="text-left">
                                            <span className="text-[10px] text-slate-500 font-bold uppercase block">Fator de Segurança</span>
                                            <span className="text-xs text-slate-500">Margem extra de energia</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end w-1/2 pl-4">
                                        <span className="font-mono font-bold text-lg text-[#0d518e] mb-1">+{config.safetyFactor}%</span>
                                        <input type="range" name="safetyFactor" aria-label="Fator de segurança" value={config.safetyFactor} onChange={handleConfigChange} min="0" max="50" step="5" className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#FAB515]" />
                                    </div>
                                </GlassCard>
                            </div>
                        </div>
                        
                        {/* Botão Dimensionar: REFEITO COM DESIGN "PILL GLASS" (IGUAL RESULTS) */}
                        <div className="relative group w-full"> 
                            {/* Outer Glow (Amarelo) */}
                            {!isCalculating && (
                                <div className="absolute inset-0 bg-[#FAB515] blur-lg opacity-20 rounded-full group-hover:opacity-40 transition-opacity duration-500 animate-pulse-slow"></div>
                            )}

                            <button 
                                onClick={handleCalculateClick} 
                                disabled={isCalculating}
                                className={`
                                    relative w-full py-5 rounded-full overflow-hidden transition-all duration-300 transform 
                                    flex items-center justify-center gap-3 shadow-[0_10px_20px_-5px_rgba(250,181,21,0.4)]
                                    ${isCalculating 
                                        ? 'bg-slate-100 cursor-not-allowed border border-slate-200 text-slate-500' 
                                        : 'bg-[#0d518e] border border-[#0d518e] text-white cursor-pointer hover:bg-[#093c6b] hover:scale-[1.01] hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0d518e]'
                                    }
                                `}
                            >
                                {/* Brilho Interno Inferior (Linha Fina Dourada) */}
                                {!isCalculating && (
                                    <div className="absolute bottom-0 left-1/4 right-1/4 h-[1px] bg-[#FAB515]/20"></div>
                                )}

                                {/* Conteúdo Central */}
                                <span className="relative z-10 flex items-center justify-center gap-3 font-bold tracking-[0.15em] uppercase text-lg ">
                                    {isCalculating ? (
                                        <>
                                            <Cog6ToothIcon className="w-5 h-5 animate-spin" />
                                            Simulando...
                                        </>
                                    ) : (
                                        <>
                                            <SparklesIcon className="w-5 h-5 text-[#fab515]" />
                                            Dimensionar Sistema
                                        </>
                                    )}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SimulationScreen;
