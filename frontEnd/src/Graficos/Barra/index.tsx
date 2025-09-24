import { useEffect, useState } from 'react'
import Chart from 'react-google-charts'
import {
  GetDadosAnos,
  GetDadosFaixaEtaria,
  GetDadosMeses,
  GetDadosPorMunicipio
} from '../../Data'

const Barra = () => {
  const [ano, setAno] = useState('2024')
  const [dadosMes, setDadosMes] = useState<TypeDado>([['Mes', 'Casos']])
  const [dadosAno, setDadosAno] = useState<TypeDado>([['Ano', 'Casos']])
  const [dadosMunicipio, setDadosMunicipio] = useState<TypeDado>([
    ['Municipio', 'Casos']
  ])
  const [dadosFaixaEtaria, setDadosFaixaEtaria] = useState<TypeDado>([
    ['Faixa Etaria', 'Casos']
  ])

  useEffect(() => {
    const fetchData = async () => {
      const fetchMes = await GetDadosMeses(ano as Ano)
      const fetchFaixaEtaria = await GetDadosFaixaEtaria(ano as Ano)
      const fetchAno = await GetDadosAnos()
      const fetchMunicipio = await GetDadosPorMunicipio({
        ano: ano as Ano,
        quantidade: 10
      })
      setDadosMes(fetchMes)
      setDadosAno(fetchAno)
      setDadosFaixaEtaria(fetchFaixaEtaria)
      setDadosMunicipio(fetchMunicipio)
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
          chartType="ColumnChart"
          width="100%"
          height="500px"
          data={dadosMunicipio}
          options={{
            title: `Casos X Município - ${ano}`,
            legend: { position: 'none' },
            colors: ['#4285F4'],
            hAxis: {
              title: 'Municípios',
              slantedText: true,
              slantedTextAngle: 45
            },
            vAxis: { title: 'Casos' }
          }}
        />
        <p>
          <b>Análise Diagnóstica:</b> O epicentro geográfico da doença mudou ao
          longo dos anos, passando de Queimadas (2021-2022) para Alagoa Grande
          (2023) e, em 2024, para Campina Grande, que se tornou o principal foco
          do surto.
          <br />
          <br />
          <b>Análise Descritiva:</b> A mudança de epicentro aponta para a
          importância do controle local do vetor, que depende do engajamento da
          população na eliminação de criadouros, mesmo em cidades com bom
          saneamento básico.
        </p>
      </div>
      <div>
        <Chart
          chartType="ColumnChart"
          width="100%"
          height="500px"
          data={dadosMes}
          options={{
            title: `Casos X Meses - ${ano}`,
            legend: { position: 'none' },
            colors: ['#4285F4'],
            hAxis: {
              title: 'Meses',
              slantedText: true,
              slantedTextAngle: 45
            },
            vAxis: { title: 'Número de casos' }
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
          chartType="ColumnChart"
          width="100%"
          height="500px"
          data={dadosAno}
          options={{
            title: `Casos X Anos`,
            legend: { position: 'none' },
            colors: ['#4285F4'],
            hAxis: {
              title: 'Ano',
              slantedText: true,
              slantedTextAngle: 45
            },
            vAxis: { title: 'Casos' }
          }}
        />
        <p>
          <b>Análise Diagnóstica:</b> O cenário do Zika nos gráficos da Paraíba
          foi de surtos cíclicos, com picos em 2021, 2022 e 2024, intercalados
          por baixa incidência em 2020 e 2023.
          <br />
          <br />
          <b>Análise Descritiva:</b> O padrão cíclico pode ser resultado da
          interação entre fatores climáticos, como calor e chuva, que propiciam
          o mosquito, e o nível de imunidade da população aos surtos.
        </p>
      </div>
      <div>
        <Chart
          chartType="ColumnChart"
          width="100%"
          height="500px"
          data={dadosFaixaEtaria}
          options={{
            title: `Casos X Faixa etária - ${ano}`,
            legend: { position: 'none' },
            colors: ['#4285F4'],
            hAxis: {
              title: 'Faixa etária',
              slantedText: true,
              slantedTextAngle: 45
            },
            vAxis: { title: 'Casos' }
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

export default Barra
