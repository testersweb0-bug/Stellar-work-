export function toXlm(stroops: string | number | bigint): string {
  const raw = typeof stroops === "bigint" ? stroops : BigInt(stroops);
  const isNegative = raw < 0n;
  const absolute = isNegative ? -raw : raw;

  // 1 XLM = 10,000,000 stroops; convert to 2dp with integer rounding.
  const roundedCents = (absolute * 100n + 5_000_000n) / 10_000_000n;
  const whole = roundedCents / 100n;
  const fraction = roundedCents % 100n;
  const formatter = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
  });
  const wholeFormatted = formatter.format(whole);
  const decimalSeparator =
    new Intl.NumberFormat(undefined, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })
      .formatToParts(1.1)
      .find((part) => part.type === "decimal")?.value ?? ".";

  return `${isNegative ? "-" : ""}${wholeFormatted}${decimalSeparator}${fraction
    .toString()
    .padStart(2, "0")}`;
}

function formatRelativeInterval(deltaMs: number): string {
  const absSeconds = Math.max(1, Math.round(Math.abs(deltaMs) / 1000));
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["week", 60 * 60 * 24 * 7],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
    ["second", 1],
  ];

  const [unit, secondsPerUnit] = units.find(([, size]) => absSeconds >= size) ?? [
    "second",
    1,
  ];
  const value = Math.max(1, Math.round(absSeconds / secondsPerUnit));
  const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: "always" });
  return formatter.format(deltaMs < 0 ? -value : value, unit);
}

export interface DeadlineDisplay {
  exact: string;
  relative: string;
  isPast: boolean;
}

export function formatDeadline(deadline: string): DeadlineDisplay | null {
  if (deadline === "0") return null;

  const deadlineDate = new Date(Number(deadline) * 1000);
  if (Number.isNaN(deadlineDate.getTime())) return null;

  const deltaMs = deadlineDate.getTime() - Date.now();
  return {
    exact: deadlineDate.toLocaleString(),
    relative: formatRelativeInterval(deltaMs),
    isPast: deltaMs < 0,
  };
}
