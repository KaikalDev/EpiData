import { useEffect, useState } from 'react'
import Chart from 'react-google-charts'
import {
  GetDadosFaixaEtaria,
  GetDadosGenero,
  GetDadosMeses
} from '../../services'

const Pizza = () => {
  const [ano, setAno] = useState('2024')
  const [dadosGenero, setDadosGenero] = useState<TypeDado>([
    ['Genero', 'Casos']
  ])
  const [dadosMes, setDadosMes] = useState<TypeDado>([['Mes', 'Casos']])
  const [dadosFaixaEtaria, setDadosFaixaEtaria] = useState<TypeDado>([
    ['Faixa Etaria', 'Casos']
  ])

  useEffect(() => {
    const fetchData = async () => {
      const fetchGenero = await GetDadosGenero(ano as Ano)
      const fetchMes = await GetDadosMeses(ano as Ano)
      const fetchFaixaEtaria = await GetDadosFaixaEtaria(ano as Ano)
      setDadosGenero(fetchGenero)
      setDadosMes(fetchMes)
      setDadosFaixaEtaria(fetchFaixaEtaria)
    }

    fetchData()
  }, [ano])

  return (
    <>
      <select
        value={ano}
        onChange={(e) => setAno(e.target.value)}
        name=""
        id=""
      >
        <option value="2024">2024</option>
        <option value="2023">2023</option>
        <option value="2022">2022</option>
        <option value="2021">2021</option>
        <option value="2020">2020</option>
      </select>
      <div>
        <Chart
          chartType="PieChart"
          width="100%"
          height="500px"
          data={dadosGenero}
          options={{
            title: `Distribuição de casos por gênero - ${ano}`,
            pieHole: 0.3
          }}
        />
        <p>
          <b>Análise Diagnóstica:</b> O gênero feminino foi consistentemente o
          mais afetado em todos os anos, representando a maioria dos casos de
          Zika.
          <br />
          <br />
          <b>Análise Descritiva:</b> A maior prevalência em mulheres pode estar
          ligada a fatores sociais (maior exposição em ambientes domésticos) e à
          maior busca por serviços de saúde, resultando em mais diagnósticos.
        </p>
      </div>
      <div>
        <Chart
          chartType="PieChart"
          width="100%"
          height="500px"
          data={dadosMes}
          options={{
            title: `Distribuição de casos por mês - ${ano}`,
            pieHole: 0.3
          }}
        />
        <p>
          <b>Análise Diagnóstica:</b> O padrão sazonal dos surtos variou: os
          picos foram no início do ano em 2020 e 2024 e se deslocaram para o
          meio do ano (junho/julho) em 2021 e 2022.
          <br />
          <br />
          <b>Análise Descritiva:</b> A flutuação dos picos sazonais está
          diretamente ligada à variação dos padrões de precipitação anual, que
          influencia a proliferação do mosquito.
        </p>
      </div>
      <div>
        <Chart
          chartType="PieChart"
          width="100%"
          height="500px"
          data={dadosFaixaEtaria}
          options={{
            title: `Distribuição de casos por Faixa etária - ${ano}`,
            pieHole: 0.3
          }}
        />
        <p>
          <b>Análise Diagnóstica:</b> A alta incidência nas faixas etárias de 20
          a 39 anos indica um impacto direto na força de trabalho e na economia
          do estado.
          <br />
          <br />
          <b>Análise Descritiva:</b> A alta incidência entre 20 e 39 anos causa
          absenteísmo no trabalho e onera o sistema de saúde, gerando perdas
          socioeconômicas.
          <br />
          <br />
          <b>Análise Diagnóstica:</b> A alta incidência nas faixas etárias de 20
          a 39 anos indica um impacto direto na força de trabalho e na economia
          do estado.
          <br />
          <br />
          <b>Análise Descritiva:</b> A alta incidência nessa faixa etária se
          deve à maior mobilidade social e exposição ao mosquito em ambientes de
          trabalho e estudo, com sérias implicações para gestantes.
        </p>
      </div>
    </>
  )
}

export default Pizza
