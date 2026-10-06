import React, { useState } from 'react';
import { Calculator, CreditCard } from 'lucide-react';
import { calculateInstallments, TAXAS } from '../conecta/interest';

const money = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const parseMoney = (value: string) => Number(value.replace(/\D/g, '')) / 100;
const currencyInput = (value: string) => value.replace(/\D/g, '') ? money(parseMoney(value)) : '';

export function InterestCalculator() {
  const [value, setValue] = useState('');
  const [discount, setDiscount] = useState('');
  const [entry, setEntry] = useState('');
  const [mode, setMode] = useState<'normal' | 'entrada'>('normal');
  const [selected, setSelected] = useState(12);
  const amount = parseMoney(value);
  const entryAmount = parseMoney(entry);
  const discountAmount = Number(discount.replace(',', '.'));
  const invalidDiscount = !Number.isFinite(discountAmount) || discountAmount < 0 || discountAmount > 100;
  const invalid = amount <= 0 || (mode === 'normal' && invalidDiscount) || (mode === 'entrada' && entryAmount > amount);
  const cards = calculateInstallments(amount, discountAmount, entryAmount, mode === 'entrada');
  const current = cards.find(card => card.months === selected)!;
  const inputClass = 'w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-lg text-[#0d518e] focus:outline-none focus:ring-2 focus:ring-[#0d518e]/30';
  return (
    <section className="p-6 lg:p-8 space-y-6">
      <header>
        <div className="flex items-center gap-3"><Calculator className="text-[#0d518e]" /><h1 className="text-2xl font-black text-slate-800">Conecta Juros</h1></div>
        <p className="text-sm text-slate-500 mt-2">Calcule e compare parcelas no cartão de crédito.</p>
      </header>
      <div className="bg-white rounded-3xl p-5 lg:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-bold text-lg flex items-center gap-2"><CreditCard size={20} className="text-[#0d518e]" />Simulador de parcelas</h2>
          <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
            {(['normal', 'entrada'] as const).map(option => <button key={option} aria-pressed={mode === option} onClick={() => setMode(option)} className={`px-4 py-2 rounded-lg text-xs font-bold ${mode === option ? 'bg-[#0d518e] text-white' : 'text-slate-600'}`}>{option === 'normal' ? 'Normal' : 'Com entrada'}</button>)}
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="space-y-2"><span className="block text-xs font-semibold text-slate-600">Valor do kit</span><input inputMode="numeric" value={value} onChange={e => setValue(currencyInput(e.target.value))} placeholder="R$ 0,00" className={inputClass} /></label>
          {mode === 'normal' ? <label className="space-y-2"><span className="block text-xs font-semibold text-slate-600">Desconto (%)</span><input inputMode="decimal" value={discount} onChange={e => setDiscount(e.target.value)} placeholder="0" className={inputClass} /></label> : <label className="space-y-2"><span className="block text-xs font-semibold text-slate-600">Entrada</span><input inputMode="numeric" value={entry} onChange={e => setEntry(currencyInput(e.target.value))} placeholder="R$ 0,00" className={inputClass} /></label>}
        </div>
        <p className="text-xs text-slate-500">Simulação com a tabela de taxas importada do Conecta Juros. Frete e descarga não estão incluídos.</p>
        {invalid ? <p className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-sm text-slate-600" role="status">{entryAmount > amount && mode === 'entrada' ? 'A entrada não pode ser maior que o valor do kit.' : invalidDiscount && mode === 'normal' ? 'Informe um desconto entre 0% e 100%.' : 'Informe o valor do kit para simular as parcelas.'}</p> : (
          <>
            {mode === 'entrada' && (
              <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5 space-y-5">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[['Valor do kit', amount], ['Entrada', current.entry], [`Cartão com juros (${selected}x)`, current.financedTotal], ['Total do cliente', current.total]].map(([label, number]) => <div key={String(label)}><p className="text-xs text-slate-500 mb-1">{label}</p><strong className="text-[#0d518e]">{money(Number(number))}</strong></div>)}
                </div>
                <div className="pt-4 border-t border-blue-200 flex flex-wrap justify-between gap-4">
                  <div><h3 className="font-bold text-sm text-[#0d518e]">Configuração BKO</h3><p className="text-xs text-slate-600 mt-1">Desconto para ajustar o total após a taxa.</p></div>
                  <div><p className="text-xs text-slate-500">Percentual de desconto</p><strong className="text-[#0d518e]">-{(TAXAS[selected] / (1 + TAXAS[selected]) * 100).toFixed(4)}%</strong></div>
                  <div><p className="text-xs text-slate-500">Solicitar ao BKO</p><strong className="text-[#0d518e]">{money(current.total / (1 + TAXAS[selected]))}</strong></div>
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
              {cards.map(card => <button key={card.months} onClick={() => setSelected(card.months)} aria-pressed={selected === card.months} className={`text-center rounded-2xl border p-4 transition-colors ${selected === card.months ? 'bg-blue-50 border-[#0d518e] ring-1 ring-[#0d518e]' : 'bg-slate-50 border-slate-200 hover:border-[#0d518e]/50'}`}><span className="block text-xs font-bold text-[#0d518e] mb-2">{card.months}x</span><strong className="block text-base text-slate-800">{money(card.installment)}</strong><span className="block text-xs text-slate-500 mt-2">Total {money(card.total)}</span><span className="block text-[11px] text-slate-500 mt-1">Taxa {(card.rate * 100).toFixed(2).replace('.', ',')}%</span></button>)}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
