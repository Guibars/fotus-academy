export const TAXAS: Record<number, number> = {
    1: 0.0327, 2: 0.0393, 3: 0.0463, 4: 0.0534, 5: 0.0605, 6: 0.0676,
    7: 0.0815, 8: 0.0888, 9: 0.0960, 10: 0.1014, 11: 0.1108, 12: 0.1161,
    13: 0.1257, 14: 0.1333, 15: 0.1408, 16: 0.1485, 17: 0.1562, 18: 0.1620,
    19: 0.1717, 20: 0.1795, 21: 0.1875
};

export function calculateInstallments(value: number, discount: number, downPayment: number, withEntry: boolean) {
  const base = withEntry ? value : value * (1 - discount / 100);
  const entry = withEntry ? Math.min(value, Math.max(0, downPayment)) : 0;
  const financed = Math.max(0, base - entry);
  return Object.entries(TAXAS).map(([count, rate]) => {
    const months = Number(count);
    const financedTotal = financed * (1 + rate);
    return { months, rate, installment: financedTotal / months, total: entry + financedTotal, entry, financedTotal };
  });
}
