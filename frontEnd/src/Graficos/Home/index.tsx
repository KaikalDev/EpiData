import { useEffect, useState } from 'react'
import { GetDadosPorMunicipioObj } from '../../Data'
import MapPB from '../MapPb'
import geoJsonData from '../../Data/geojs-25-mun.json'

const Home = () => {
  const [ano, setAno] = useState('2024')
  const [dadosMunicipio, setDadosMunicipio] = useState<
    { municipio: string; casos: number }[]
  >([])

  useEffect(() => {
    const fetchData = async () => {
      const fetchMunicipio = await GetDadosPorMunicipioObj(ano as Ano)
      setDadosMunicipio(fetchMunicipio)
    }

    fetchData()
  }, [ano])

  return (
    <>
      <select value={ano} onChange={(e) => setAno(e.target.value)}>
        <option value="2024">2024</option>
        <option value="2023">2023</option>
        <option value="2022">2022</option>
        <option value="2021">2021</option>
        <option value="2020">2020</option>
      </select>

      <div>
        <MapPB dataPorMunicipio={dadosMunicipio} geoJsonData={geoJsonData} />
        <p>Mapa dos casos na Paraíba ({ano}).</p>
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
    </>
  )
}

export default Home
