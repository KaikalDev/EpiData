export const GetDadosByCriterio = async ({
  ano,
  criterio
}: {
  ano: Ano
  criterio: 'porMes' | 'porFaixaEtaria' | 'porGenero'
}) => {
  try {
    const response = await fetch(
      `http://localhost:5000/dados/anos/${ano}/${criterio}`
    )
    if (!response.ok) throw new Error('Erro ao buscar dados')

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Erro no pegar os dados:', error)
    return null
  }
}

export const GetDadosAno = async (ano: Ano) => {
  try {
    const response = await fetch(`http://localhost:5000/dados/total?ano=${ano}`)
    if (!response.ok) throw new Error('Erro ao buscar dados')

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Erro no pegar os dados:', error)
    return null
  }
}

export const GetDadosIBGE = async (ano: Ano) => {
  try {
    const response = await fetch(`http://localhost:5000/dados/ibge/${ano}`)
    if (!response.ok) throw new Error('Erro ao buscar dados')

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Erro no pegar os dados:', error)
    return null
  }
}
