export const mean = (arr: number[]): number =>
  arr.reduce((acc, v) => acc + v, 0) / arr.length

export const median = (arr: number[]): number => {
  const sorted = [...arr].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid]
}

export const std = (arr: number[]): number => {
  const m = mean(arr)
  const variance = arr.reduce((acc, v) => acc + (v - m) ** 2, 0) / arr.length
  return Math.sqrt(variance)
}

export const FormatNumber = (num: number) => {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num)
}

export const normalize = (str: string) =>
  str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '')
