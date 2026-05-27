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
