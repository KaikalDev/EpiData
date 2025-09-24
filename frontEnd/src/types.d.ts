declare module '*.csv' {
  const value: string
  export default value
}

declare type Ano = '2024' | '2023' | '2022' | '2021' | '2020'

declare type TypeDado = (string | number)[][]
