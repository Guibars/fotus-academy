
import React, { useState, useEffect } from 'react';
import type { CalculationResults, Equipment, HVBatteryOption } from '../types';
import GlassCard from './GlassCard';
import { 
    PowerIcon, BatteryIcon, ClockIcon, SparklesIcon, ShieldCheckIcon, 
    CollectionIcon, BoltIcon, ExclamationTriangleIcon, PencilSquareIcon, 
    ArrowUturnLeftIcon, InformationCircleIcon, HouseIcon 
} from './icons/Icons';

interface ResultsScreenProps {
  results: CalculationResults | null;
  equipmentList: Equipment[];
  onBack: () => void;
  onEdit: () => void;
  onHome: () => void; // Nova prop
}

const AnimatedNumber = ({ value, duration = 1500, formatter }: { value: number; duration?: number; formatter: (n: number) => string }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let startTime: number | null = null;
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            const easedPercentage = 1 - Math.pow(1 - percentage, 4); 

            const currentValue = value * easedPercentage;
            setDisplayValue(currentValue);

            if (progress < duration) {
                requestAnimationFrame(animate);
            } else {
                setDisplayValue(value);
            }
        };
        requestAnimationFrame(animate);
    }, [value, duration]);

    return <span>{formatter(displayValue)}</span>;
};

// Componente de Card de Equipamento Atualizado com efeito "Expand on Hover"
const EquipmentDetailCard: React.FC<{ 
    title: string; 
    quantity: number; 
    imageUrl: string; 
    specs: { label: string; value: string | number | undefined }[]; 
    type: 'inverter' | 'battery';
    className?: string;
    delay?: string;
    isPrimary?: boolean; 
    hvRackCount?: number; 
    warningMessage?: string; 
    originalRequiredQuantity?: number;
}> = ({ title, quantity, imageUrl, specs, type, className, delay, isPrimary = false, hvRackCount, warningMessage, originalRequiredQuantity }) => {
    
    // Altura mínima do card para manter alinhamento (Reduzida para ficar mais compacto)
    const minHeightClass = isPrimary ? 'min-h-[360px]' : 'min-h-[300px]';

    // --- LOGICA DE TAMANHO DA PÍLULA ---
    const pillPadding = isPrimary ? 'pl-5 pr-6 py-2' : 'pl-3 pr-4 py-1.5';
    const pillGap = isPrimary ? 'gap-3' : 'gap-2';
    const pillNumberSize = isPrimary ? 'text-3xl' : 'text-xl';
    const pillLabelTitleSize = isPrimary ? 'text-[9px]' : 'text-[7px]';
    const pillLabelValueSize = isPrimary ? 'text-[11px]' : 'text-[9px]';
    const pillPosition = isPrimary ? '-top-4 -right-2' : '-top-3 -right-2';

    // Estado para animação "Pop" quando o BMU muda
    const [animateBMU, setAnimateBMU] = useState(false);

    useEffect(() => {
        if (hvRackCount) {
            setAnimateBMU(true);
            const timer = setTimeout(() => setAnimateBMU(false), 500);
            return () => clearTimeout(timer);
        }
    }, [hvRackCount]);

    return (
        <div 
            className={`relative group h-full flex flex-col animate-fade-in-up ${className}`} 
            style={{ animationDelay: delay }}
        >
            <GlassCard 
                variant={isPrimary ? 'premium' : 'lite'} 
                className={`flex-1 relative overflow-visible transition-all duration-700 
                    ${isPrimary 
                        ? 'p-6 rounded-[2rem] glow-yellow' // Removido ternário para aplicar glow amarelo em ambos
                        : 'p-6 rounded-[2rem] opacity-90 hover:opacity-100'}
                    ${minHeightClass}
                `}
            >
                {/* --- NOVO INDICADOR DE QUANTIDADE FLUTUANTE (LIQUID GLASS) --- */}
                <div className={`absolute ${pillPosition} z-30 flex flex-col items-end gap-2 pointer-events-none`}>
                    
                    {/* QUANTIDADE PRINCIPAL (Módulos ou Unidades) */}
                    {(quantity > 0) && (
                        <div className="relative group/pill pointer-events-auto">
                            {/* Glow Externo Amarelo */}
                            <div className="absolute inset-0 bg-[#FAB515] blur-lg opacity-30 rounded-full group-hover/pill:opacity-50 transition-opacity duration-500 animate-pulse-slow"></div>
                            
                            {/* Pílula Principal */}
                            <div className={`relative bg-gradient-to-br from-blue-50 to-white backdrop-blur-xl border border-[#FAB515] text-[#0d518e] ${pillPadding} rounded-full shadow-[0_10px_20px_-5px_rgba(250,181,21,0.4)] flex items-center ${pillGap} transform transition-transform duration-300 group-hover/pill:scale-105 group-hover/pill:-translate-y-1`}>
                                {/* Brilho Liquido (Highlight) */}
                                <div className="absolute bottom-0 left-1/4 right-1/4 h-[1px] bg-[#FAB515]/20"></div>

                                <span className={`${pillNumberSize} font-bold font-tech tracking-tighter leading-none `}>
                                    {quantity}
                                </span>
                                <div className="flex flex-col items-start leading-none opacity-90">
                                    <span className={`${pillLabelTitleSize} font-bold uppercase tracking-widest text-slate-600`}>
                                        Total
                                    </span>
                                    {/* Alterado: 'Módulos' para 'Baterias' */}
                                    <span className={`${pillLabelValueSize} font-bold uppercase tracking-wider text-[#0d518e]`}>
                                        {hvRackCount ? 'Baterias' : 'Unidades'}
                                    </span>
                                    {originalRequiredQuantity && originalRequiredQuantity > quantity && (
                                        <span className="text-[8px] font-bold text-red-600 mt-1 uppercase tracking-widest leading-none bg-red-500/10 px-1 py-0.5 rounded border border-red-500/20 whitespace-nowrap">
                                            Exigiu {originalRequiredQuantity}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- ATUALIZAÇÃO: MINI CARD BMU (Control Box) --- */}
                    {hvRackCount !== undefined && hvRackCount > 0 && (
                        <div className={`relative group/bmu mt-1 pointer-events-auto transition-transform duration-300 ${animateBMU ? 'animate-pop-in' : ''}`}>
                             {/* Glow Effect matching Pill */}
                             <div className="absolute inset-0 bg-[#FAB515] blur-lg opacity-20 rounded-full group-hover/bmu:opacity-40 transition-opacity duration-500"></div>
                             
                             {/* Pílula BMU - Layout Ajustado: Texto Empilhado */}
                             <div className="relative bg-gradient-to-br from-blue-50 to-white backdrop-blur-xl border border-[#FAB515] p-1.5 pr-3 rounded-full shadow-[0_10px_20px_-5px_rgba(250,181,21,0.3)] flex items-center gap-2 transition-all duration-300 group-hover/bmu:scale-105 group-hover/bmu:-translate-x-1">
                                
                                {/* Inner Bottom Highlight */}
                                <div className="absolute bottom-0 left-1/4 right-1/4 h-[1px] bg-[#FAB515]/20"></div>

                                {/* Imagem - Ligeiramente reduzida para w-10 h-10 para economizar espaço */}
                                <div className="w-10 h-10 flex items-center justify-center bg-blue-50 rounded-full border border-slate-200 p-0.5 flex-shrink-0">
                                    <img loading="lazy" decoding="async" 
                                        src={`${import.meta.env.BASE_URL}assets/images/20260128-110912-0000.png`} 
                                        alt="BMU" 
                                        className="w-full h-full object-contain  transform group-hover/bmu:scale-110 transition-transform duration-500"
                                    />
                                </div>

                                {/* Container de Texto + Número */}
                                <div className="flex flex-row items-center gap-2 mr-1">
                                    {/* Número em destaque */}
                                    <span className="text-2xl font-bold font-mono text-slate-800 tracking-tighter  leading-none">
                                        {hvRackCount}
                                    </span>
                                    
                                    {/* Texto Empilhado (Control em cima de Box) */}
                                    <div className="flex flex-col items-start justify-center leading-none gap-0.5">
                                        <span className="text-[7px] uppercase tracking-widest text-slate-600 font-bold">
                                            Control
                                        </span>
                                        <span className="text-[7px] uppercase tracking-widest text-[#0d518e] font-bold">
                                            Box
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="relative z-10 flex flex-col h-full items-center justify-between">
                    
                    {/* Topo: Badge e Imagem */}
                    <div className="w-full flex flex-col items-center">
                        {/* Badge de Categoria (Esquerda) */}
                        <div className="w-full flex justify-start items-start mb-4"> 
                            <span className="text-[10px] uppercase font-bold px-3 py-1 rounded-full border tracking-wide transition-colors border-[#FAB515]/30 text-[#0d518e] bg-[#FAB515]/5">
                                {type === 'inverter' ? 'Inversor Híbrido' : 'Armazenamento'}
                            </span>
                        </div>

                        {/* Imagem Flutuante - Sobe ao passar o mouse */}
                        {/* Tamanho da imagem reduzido para w-40/h-40 (mobile) e w-44/h-44 (desktop) */}
                        <div className={`relative transition-all duration-700 ease-out transform group-hover:-translate-y-4
                            ${isPrimary ? 'w-40 h-40 md:w-44 md:h-44 mb-3' : 'w-32 h-32 mb-2'}
                            group-hover:scale-110
                        `}>
                            {isPrimary && (
                                <div className="absolute inset-0 bg-gradient-to-b from-[#FAB515]/30 to-transparent blur-3xl rounded-full opacity-40 group-hover:opacity-70 transition-opacity duration-700"></div>
                            )}
                            <img loading="lazy" decoding="async" src={`${import.meta.env.BASE_URL}${imageUrl.replace(/^\//, '')}`}  alt={title} className="w-full h-full object-contain relative z-10 drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]"/>
                        </div>

                        {/* Título Principal */}
                        <h3 className={`${isPrimary ? 'text-base md:text-lg' : 'text-sm md:text-base'} text-center font-bold font-bold text-slate-800 mb-2 leading-tight tracking-wide group-hover:text-[#0d518e] transition-colors duration-300`}>
                            {title}
                        </h3>
                    </div>

                    {/* Área de Especificações - Efeito "Abrir" (Expand) */}
                    {/* Inicialmente escondido (max-h-0 opacity-0), expande no hover */}
                    <div className="w-full overflow-hidden transition-all duration-700 ease-out equipment-specs max-h-0 opacity-0 group-hover:max-h-[600px] group-hover:opacity-100 flex flex-col items-center">
                         <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-3"></div>
                         
                         {/* Grid de Specs */}
                         <div className={`grid ${isPrimary ? 'grid-cols-2 gap-2' : 'grid-cols-1 gap-2'} w-full`}>
                            {specs.filter(s => s.value !== undefined).map((spec, idx) => (
                                <div key={idx} className={`flex flex-col items-center justify-center rounded-xl border transition-colors ${
                                    isPrimary 
                                        ? 'bg-white/[0.03] border-slate-200 p-2' 
                                        : 'bg-transparent border-transparent p-1'
                                }`}>
                                    <span className="text-[9px] text-slate-500 font-medium uppercase tracking-widest mb-0.5">{spec.label}</span>
                                    <span className={`${isPrimary ? 'text-xs' : 'text-[10px]'} font-semibold text-slate-800`}>{spec.value}</span>
                                </div>
                            ))}
                        </div>

                        {/* Warning Box */}
                        {warningMessage && (
                            <div className="mt-3 p-2.5 bg-gradient-to-r from-[#FAB515]/10 to-transparent border-l-2 border-[#FAB515] rounded-r-xl flex items-start gap-2 text-left w-full">
                                <ExclamationTriangleIcon className="w-4 h-4 text-[#0d518e] flex-shrink-0 mt-0.5" />
                                <div className="text-[10px] text-slate-600 leading-relaxed font-medium">
                                    <span className="text-[#0d518e] font-bold uppercase block mb-0.5">Nota Técnica</span>
                                    {warningMessage}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Indicador Visual "Passe o Mouse" (Só visível quando NÃO está hovered) */}
                    <div className="mt-4 transition-all duration-500 opacity-60 group-hover:opacity-0 group-hover:h-0 overflow-hidden">
                         <div className="flex flex-col items-center gap-1">
                            {/* Texto "Detalhes" alterado para #fab11a e font-bold */}
                            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#0d518e]">Detalhes</span>
                            {/* Bolinha alterada para #fab11a */}
                            <div className="w-1 h-1 bg-[#fab11a] rounded-full animate-bounce"></div>
                         </div>
                    </div>

                </div>
            </GlassCard>
        </div>
    );
};


const ResultsScreen: React.FC<ResultsScreenProps> = ({ results, equipmentList, onBack, onEdit, onHome }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0); // Estado para controlar qual opção de bateria HV está selecionada
  
  useEffect(() => {
    // SCROLL TO TOP - Garante que a página comece do topo ao carregar os resultados
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!results) return null;

  const {
    simultaneousPeak, dailyConsumption, estimatedAutonomyHours, primaryInverter, alternativeInverters, warning, recommendedBattery,
  } = results;

  // Lógica de Exibição Dinâmica (Se tiver opções HV, usa a selecionada, senão usa o padrão)
  const activeOption = recommendedBattery.options && recommendedBattery.options.length > 0 
      ? recommendedBattery.options[selectedOptionIndex]
      : null;

  const displayQuantity = activeOption ? activeOption.totalQuantity : recommendedBattery.quantity;
  const displayBMUs = activeOption 
      ? activeOption.totalBMUs 
      : (recommendedBattery.battery.voltageType === 'HV' && recommendedBattery.battery.maxModulesPerRack)
          ? Math.ceil(recommendedBattery.quantity / recommendedBattery.battery.maxModulesPerRack)
          : undefined;

  const batterySpecs = [
      { label: "Capacidade Bat.", value: `${recommendedBattery.battery.capacityAh} Ah` }, // Alterado "Mod." para "Bat."
      { label: "Banco Total", value: `${(recommendedBattery.battery.capacityKwh * displayQuantity).toFixed(1)} kWh` },
      { label: "Tensão Nom.", value: `${recommendedBattery.battery.voltage} V` },
      { label: "Vida Útil", value: `${recommendedBattery.battery.lifespanCycles} Ciclos` },
      { label: "Expansão", value: `Max ${recommendedBattery.battery.parallelUnits} un.` },
      { label: "Comunicação", value: recommendedBattery.battery.protocol },
  ];
  
  return (
    <div className={`min-h-0 text-slate-800 p-6 md:p-12 pt-6 transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className="max-w-screen-xl mx-auto">
        <div id="results-container">
          
          {/* Header Minimalista */}
          <div className="text-center mb-16 animate-fade-in-up">
            <h1 className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#0d518e] to-[#0d518e] uppercase tracking-widest ">
              Projeto Sugerido
            </h1>
            <p className="text-slate-500 text-sm mt-2 uppercase tracking-[0.3em] font-medium font-medium">Dimensionamento Híbrido Inteligente</p>
          </div>

          {/* Barra de Métricas (Vidro Fino Horizontal) - Autonomia Removida da Visualização Principal */}
          <GlassCard variant="lite" className="p-1 mb-16 max-w-2xl mx-auto animate-fade-in-up rounded-full flex flex-col md:flex-row items-center justify-between gap-2 backdrop-blur-xl border-slate-200 shadow-2xl" style={{ animationDelay: '100ms' }}>
                <div className="flex-1 w-full md:w-auto flex items-center justify-center gap-4 py-4 md:py-6 px-6 relative group">
                    <div className="p-3 bg-slate-100/50 rounded-full text-[#0d518e]">
                        <BoltIcon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest font-medium">Pico Simultâneo</p>
                        <p className="text-2xl font-bold text-slate-800 font-tech">
                            <AnimatedNumber value={simultaneousPeak} formatter={(n) => n.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} /> 
                            <span className="text-sm text-slate-600 ml-1">W</span>
                        </p>
                    </div>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-px bg-blue-50 hidden md:block"></div>
                </div>

                <div className="flex-1 w-full md:w-auto flex items-center justify-center gap-4 py-4 md:py-6 px-6 relative group">
                    <div className="p-3 bg-slate-100/50 rounded-full text-[#0d518e]">
                        <BatteryIcon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest font-medium">Consumo Diário</p>
                        <p className="text-2xl font-bold text-slate-800 font-tech">
                            <AnimatedNumber value={dailyConsumption / 1000} formatter={(n) => n.toFixed(2)} /> 
                            <span className="text-sm text-slate-600 ml-1">kWh</span>
                        </p>
                    </div>
                </div>
          </GlassCard>
          
          {warning && (
            <div className="max-w-4xl mx-auto mb-12 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
                <div className="bg-red-500/5 backdrop-blur-md border border-red-500/20 rounded-2xl p-4 flex items-start gap-4 shadow-sm">
                    <ShieldCheckIcon className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="text-red-600 font-bold mb-1 text-sm uppercase tracking-widest">Aviso de Compatibilidade</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">{warning}</p>
                    </div>
                </div>
            </div>
          )}

          {/* Título de Seção com Ícone Animado */}
          <div className="flex items-center justify-center gap-3 mb-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
             <SparklesIcon className="w-5 h-5 text-[#0d518e] animate-pulse-slow" />
             <h2 className="text-sm font-bold text-slate-500 font-bold uppercase tracking-[0.2em]">Kit Recomendado</h2>
             <div className="h-px w-12 bg-[#FAB515]/50"></div>
          </div>
          
          {!primaryInverter && <p role="status" className="max-w-4xl mx-auto mb-8 p-5 rounded-2xl border border-amber-200 bg-amber-50 text-sm text-slate-700">Não há inversor compatível no catálogo para a rede e a bateria selecionadas. Altere a rede ou a bateria para obter uma combinação compatível.</p>}
          {/* GRID PRINCIPAL: KIT SUGERIDO (Hierarquia Alta) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 max-w-6xl mx-auto mb-20 px-4 items-start">
            {primaryInverter && (
              <EquipmentDetailCard 
                title={primaryInverter.inverter.name}
                quantity={primaryInverter.quantity}
                imageUrl={primaryInverter.inverter.imageUrl}
                type="inverter"
                isPrimary={true}
                delay="250ms"
                specs={[
                    { label: "Potência Nom.", value: `${primaryInverter.inverter.power} W` },
                    { label: "Corrente Máx.", value: `${primaryInverter.inverter.maxChargeDischargeCurrent || '-'} A` },
                    { label: "Dimensões", value: primaryInverter.inverter.dimensions },
                    { label: "Peso", value: primaryInverter.inverter.weight ? `${primaryInverter.inverter.weight} kg` : 'Não informado' },
                    { label: "Proteção", value: primaryInverter.inverter.ipClass },
                    { label: "Switch UPS", value: `${primaryInverter.inverter.upsSwitchTime} ms` },
                ]}
              />
            )}
            
            {/* WRAPPER PARA CARD DE BATERIA + SUGESTÕES */}
            <div className="flex flex-col md:flex-row gap-4 h-full">
                
                {/* CARD DE BATERIA */}
                <EquipmentDetailCard 
                    className="flex-1 w-full"
                    title={recommendedBattery.battery.name}
                    quantity={displayQuantity}
                    imageUrl={recommendedBattery.battery.imageUrl}
                    type="battery"
                    isPrimary={true}
                    delay="350ms"
                    hvRackCount={displayBMUs}
                    warningMessage={recommendedBattery.battery.name.includes("BOS-W") 
                        ? "Requisito Técnico : Sistema de Alta Tensão. Obrigatório uso de mínimo 5 baterias em série para atingir a tensão de partida (220V+)." // Alterado para '5 baterias'
                        : undefined
                    }
                    originalRequiredQuantity={recommendedBattery.originalRequiredQuantity}
                    specs={batterySpecs}
                />

                {/* SUGESTÕES DE CONFIGURAÇÃO (HV) - Aparece se existirem opções */}
                {recommendedBattery.options && recommendedBattery.options.length > 0 && (
                     <div className="flex flex-col gap-3 md:w-56 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                        <div className="bg-blue-50 backdrop-blur-md border border-slate-200 rounded-2xl p-4 h-full flex flex-col gap-2">
                             <div className="flex items-center gap-2 mb-2 text-slate-600 group/tooltip relative">
                                 <SparklesIcon className="w-4 h-4 text-[#0d518e]" />
                                 <span className="text-[10px] font-bold uppercase tracking-widest">Sugestões</span>
                                 
                                 {/* Ícone de Informação Técnica */}
                                 <InformationCircleIcon className="w-3.5 h-3.5 text-slate-500 hover:text-slate-800 cursor-help transition-colors" />

                                 {/* Tooltip */}
                                 <div className="absolute top-6 left-0 w-48 p-3 bg-white border border-slate-200 rounded-xl text-[10px] text-slate-600 shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-50">
                                    <p className="leading-relaxed">
                                        <span className="text-[#0d518e] font-bold block mb-1">Nota Técnica:</span>
                                        Sistemas High Voltage exigem limites específicos de tensão e simetria absoluta entre as torres (Control Box).
                                    </p>
                                 </div>
                             </div>
                             
                             {/* Container de Opções Ajustado - Removido h-full para evitar ghost card */}
                             <div className="flex flex-col gap-3 h-fit">
                                 {recommendedBattery.options.map((option, idx) => (
                                     <button
                                        key={idx}
                                        onClick={() => setSelectedOptionIndex(idx)}
                                        className={`
                                            relative p-3 rounded-xl border text-left transition-all duration-300 group overflow-visible
                                            ${selectedOptionIndex === idx 
                                                ? 'bg-white text-slate-900 border-white shadow-sm scale-[1.02]' 
                                                : 'bg-blue-50 text-slate-600 border-slate-200 hover:bg-blue-50 hover:border-white/30'
                                            }
                                        `}
                                     >
                                         {/* Tag "Recomendado" Ajustada para não ser cortada */}
                                         {option.isBestOption && (
                                             <div className={`absolute -top-2.5 right-2 bg-[#FAB515] text-[#020617] text-[8px] font-bold px-2 py-0.5 rounded-full shadow-md z-10 ${selectedOptionIndex !== idx ? 'opacity-90' : ''}`}>
                                                 Recomendado
                                             </div>
                                         )}

                                         <div className="flex flex-col gap-1">
                                             <span className="text-[9px] text-[#0d518e] uppercase font-bold tracking-wide">Opção {idx + 1}</span>
                                             <span className={`text-sm font-bold font-mono ${selectedOptionIndex === idx ? 'text-slate-900' : 'text-slate-800'}`}>
                                                 {/* Alterado 'Módulos' para 'Baterias' */}
                                                 {option.totalQuantity} Baterias
                                             </span>
                                             <span className={`text-[10px] leading-tight mt-0.5 ${selectedOptionIndex === idx ? 'text-slate-600' : 'text-slate-500'}`}>
                                                 {option.description}
                                             </span>
                                         </div>
                                     </button>
                                 ))}
                             </div>
                        </div>
                     </div>
                )}
            </div>
          </div>

          {/* SEÇÃO SECUNDÁRIA: LISTA + ALTERNATIVAS */}
          <div className="max-w-7xl mx-auto animate-fade-in-up grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20 items-start" style={{ animationDelay: '500ms' }}>
            
            {/* Left Column: Equipment List (Secondary Hierarchy) */}
            <div className="lg:col-span-4">
                {/* Alterado para variant="lite" com border glow sutil #fab11a para dar destaque */}
                <GlassCard variant="lite" className="p-6 rounded-[2rem] border-slate-200 h-full shadow-sm hover:border-[#fab11a]/30 transition-colors">
                    <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
                        <CollectionIcon className="w-5 h-5 text-slate-500" />
                        {/* Título alterado para #fab11a */}
                        <h3 className="text-xs font-bold text-[#0d518e] font-medium uppercase tracking-[0.15em]">Cargas Consideradas</h3>
                    </div>
                    
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {equipmentList.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-white/[0.02] rounded-xl border border-slate-200 text-sm hover:bg-white/[0.05] transition-all">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <span className="text-[10px] font-bold text-slate-900 bg-[#FAB515] px-2 py-0.5 rounded shadow-sm">{item.quantity}x</span>
                                    <span className="font-medium text-slate-600 text-xs truncate">{item.name}</span>
                                </div>
                                <div className="text-slate-500 font-mono text-xs ml-2">
                                    {((item.power * item.quantity * item.hours) / 1000).toFixed(1)} kWh
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            </div>

            {/* Right Column: Compatible Alternatives (Secondary Hierarchy) */}
            <div className="lg:col-span-8">
                 {alternativeInverters && alternativeInverters.length > 0 ? (
                    <div className="h-full flex flex-col">
                        <div className="flex items-center gap-3 mb-6 pl-2">
                            <ArrowUturnLeftIcon className="w-4 h-4 text-slate-500 rotate-180" />
                            <h3 className="text-xs font-bold text-slate-500 font-medium uppercase tracking-[0.15em]">Alternativas Compatíveis</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {alternativeInverters.map((alt, index) => (
                                <EquipmentDetailCard
                                    key={alt.inverter.name}
                                    title={alt.inverter.name}
                                    quantity={alt.quantity}
                                    imageUrl={alt.inverter.imageUrl}
                                    type="inverter"
                                    isPrimary={false} // Use Lite style
                                    delay={`${500 + (index * 100)}ms`}
                                    specs={[
                                        { label: "Potência", value: `${alt.inverter.power} W` },
                                        { label: "Corrente", value: `${alt.inverter.maxChargeDischargeCurrent} A` },
                                    ]}
                                />
                            ))}
                        </div>
                    </div>
                 ) : null}
            </div>
          </div>
          
          <div className="text-center mt-12 pt-8 border-t border-slate-200 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
             <p className="text-slate-600 text-[10px] font-medium uppercase tracking-[0.2em]">
                Novos Produtos | Fotus Distribuidora Solar
             </p>
          </div>
        </div>
        
        {/* ACTION BUTTONS */}
        <div className="flex flex-row justify-center items-center mt-8 gap-6 md:gap-10 pb-10 animate-fade-in-up" style={{ animationDelay: '700ms' }}>
          
          <button 
             onClick={onEdit} 
             className="group flex flex-col items-center gap-3 transition-transform duration-300 hover:-translate-y-1"
          >
             {/* Atualizado para variant="premium" e cores #FAB515 */}
             <GlassCard variant="premium" className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center border-[#FAB515]/30 glow-yellow transition-all">
                 <PencilSquareIcon className="w-6 h-6 text-[#0d518e]" />
             </GlassCard>
             <span className="text-[10px] font-bold uppercase tracking-widest text-[#0d518e] font-bold">Editar Cargas</span>
          </button>
          
          <button 
             onClick={onBack} 
             className="group flex flex-col items-center gap-3 transition-transform duration-300 hover:-translate-y-1"
          >
             {/* Atualizado para variant="premium" e cores #FAB515 */}
             <GlassCard variant="premium" className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center border-[#FAB515]/30 glow-yellow transition-all">
                 <ArrowUturnLeftIcon className="w-6 h-6 text-[#0d518e]" />
             </GlassCard>
             <span className="text-[10px] font-bold uppercase tracking-widest text-[#0d518e] font-bold">Reiniciar</span>
          </button>

          {/* NOVO BOTÃO TELA INICIAL */}
          <button 
             onClick={onHome} 
             className="group flex flex-col items-center gap-3 transition-transform duration-300 hover:-translate-y-1"
          >
             <GlassCard variant="premium" className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center border-[#FAB515]/30 glow-yellow transition-all">
                 <HouseIcon className="w-6 h-6 text-[#0d518e]" />
             </GlassCard>
             <span className="text-[10px] font-bold uppercase tracking-widest text-[#0d518e] font-bold">Tela Inicial</span>
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
