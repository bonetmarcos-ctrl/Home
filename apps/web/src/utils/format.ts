export function formatMoney(amount: number, currency = "EUR"): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "percent",
    maximumFractionDigits: 0
  }).format(value);
}

export function todayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function monthLabel(month: string): string {
  const [year = 0, monthIndex = 1] = month.split("-").map(Number);
  return new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric" }).format(
    new Date(Date.UTC(year, monthIndex - 1, 1))
  );
}