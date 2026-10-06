import React, { useState } from 'react';
import { ArrowLeft, Cpu } from 'lucide-react';
import SimulationScreen from '../conecta/components/SimulationScreen';
import ResultsScreen from '../conecta/components/ResultsScreen';
import { calculateHybrid } from '../conecta/calculations';
import type { Equipment, CalculationResults } from '../conecta/types';

const GRIDS = [
  { label: 'Monofásico', voltage: '127 V', value: 'Mono-127V' },
  { label: 'Monofásico', voltage: '220 V', value: '220V' },
  { label: 'Split Phase Bifásico', voltage: '127 / 220 V', value: 'Split-Phase' },
  { label: 'Off-Grid', voltage: '220 V', value: 'Off-Grid' },
  { label: 'Trifásico', voltage: '220 V', value: 'Triphasic-220V' },
  { label: 'Trifásico', voltage: '380 V', value: '380V' },
];

export function HybridCalculator() {
  const [grid, setGrid] = useState<string | null>(null);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [showResults, setShowResults] = useState(false);
  const reset = () => { setEquipment([]); setResults(null); setShowResults(false); };
  return (
    <section className="conecta-tool">
      {!grid ? (
        <div className="p-6 lg:p-8 space-y-6">
          <header>
            <div className="flex items-center gap-3"><Cpu className="text-[#0d518e]" /><h1 className="text-2xl font-black text-slate-800">Conecta Híbridos</h1></div>
            <p className="text-sm text-slate-500 mt-2">Escolha a rede para dimensionar as cargas, o inversor e o banco de baterias.</p>
          </header>
          <div className="bg-white border border-slate-200 rounded-3xl p-6 lg:p-8 shadow-sm">
            <h2 className="font-bold text-lg mb-5">Qual é a tensão da rede?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {GRIDS.map(option => (
                <button key={option.value} onClick={() => setGrid(option.value)} className="text-left rounded-2xl p-5 border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-[#0d518e] focus-visible:outline-2 focus-visible:outline-[#0d518e] transition-colors">
                  <span className="block text-sm font-semibold text-slate-600">{option.label}</span>
                  <strong className="block text-2xl text-[#0d518e] mt-2">{option.voltage}</strong>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="px-6 lg:px-8 pt-6 flex flex-wrap items-center justify-between gap-3">
            <button onClick={() => { setGrid(null); setShowResults(false); }} className="inline-flex items-center gap-2 text-sm font-semibold text-[#0d518e]"><ArrowLeft size={16} />Alterar rede</button>
            <span className="text-xs font-semibold bg-white border border-slate-200 px-3 py-2 rounded-xl">{GRIDS.find(option => option.value === grid)?.label} · {GRIDS.find(option => option.value === grid)?.voltage}</span>
          </div>
          {showResults ? (
            <ResultsScreen results={results} equipmentList={equipment} onEdit={() => setShowResults(false)} onBack={reset} onHome={() => { reset(); setGrid(null); }} />
          ) : (
            <SimulationScreen equipmentList={equipment} setEquipmentList={setEquipment} gridVoltage={grid} onCalculate={config => { setResults(calculateHybrid(equipment, grid, config)); setShowResults(true); }} />
          )}
        </>
      )}
    </section>
  );
}
