
export interface Equipment {
  id: string;
  name: string;
  power: number;
  quantity: number;
  hours: number;
}

export interface PredefinedEquipment {
  name: string;
  power: number;
}

export interface Battery {
  name: string;
  voltage: number;
  capacityAh: number;
  capacityKwh: number;
  usefulEnergyKwh: number;
  recommendedDod?: number; // DoD de referência da energia útil
  maximumDod?: number; // Limite de descarga permitido no simulador
  maxDischargeCurrent: number;
  weight: number;
  dimensions: string;
  protocol: string;
  lifespanCycles: number;
  parallelUnits: number;
  imageUrl: string;
  ipClass?: string;
  voltageType: 'LV' | 'HV'; // Low Voltage (48V) or High Voltage (>160V)
  installationWarning?: string; // Aviso técnico específico para exibição na UI
  minModulesSeries?: number; // Mínimo de módulos para atingir tensão (ex: 5 para HV)
  maxModulesPerRack?: number; // Máximo de módulos por Control Box/Rack (ex: 16)
}

export interface Inverter {
  name: string;
  power: number;
  outputCurrent: number;
  mpptEfficiency: number;
  upsSwitchTime: number;
  ipClass: string;
  batteryVoltageRange: string;
  batteryType: string;
  imageUrl: string;
  peakPower?: string;
  monitoring?: string;
  maxChargeDischargeCurrent?: number;
  efficiency?: number;
  protection?: string;
  communication?: string;
  weight?: number;
  dimensions?: string;
  gridType: 'monophasic' | 'triphasic' | 'off-grid' | 'split-phase'; // Adicionado split-phase
}

export interface RecommendedInverterInfo {
  inverter: Inverter;
  quantity: number;
}

// Configuração específica para HV
export interface HVBatteryOption {
  id: number;
  totalQuantity: number; // Total de módulos no sistema
  totalBMUs: number; // Total de BMUs no sistema
  modulesPerBMU: number; // Quantidade SIMÉTRICA por BMU
  description: string;
  isBestOption?: boolean;
}

export interface CalculationResults {
  totalPower: number;
  dailyConsumption: number;
  simultaneousPeak: number;
  estimatedAutonomyHours: number; // Novo campo
  primaryInverter: RecommendedInverterInfo | null;
  alternativeInverters: RecommendedInverterInfo[];
  warning?: string | null;
  recommendedBattery: {
    battery: Battery;
    quantity: number;
    originalRequiredQuantity?: number; // Added
    // Opções de configuração para HV (ex: 2 BMUs de 9 ou 3 BMUs de 6)
    options?: HVBatteryOption[]; 
  };
}
