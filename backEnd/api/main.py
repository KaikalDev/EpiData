from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .leitor import leitor_, leitorIBGE
from .models import *
import os
import copy
from typing import Optional
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*']
)


DADOS = None
DADOS_IBGE = None

MAPEAMENTO_CRITERIOS = {
    0:"porfaixaetaria",
    1:"porgenero",
    2:"pormes",
}

MAPEAMENTO_ANOS = {
    0:"2020",
    1:"2021",
    2:"2022",
    3:"2023",
    4:"2024",
}

DADOS_POPULACAO = {
    "2020":4039277,
    "2021":4059905,
    "2022":3974687,
    "2023":3974687,
    "2024":4145040,

}

@app.get("/")
def root():
    return {"msg": "Hello from FastAPI on Vercel!"}

@app.on_event("startup")
def load_data():
    global DADOS

    dados_por_ano = {}
    total_absoluto = 0

    caminho_base = os.path.join("api", "data", "paraiba", "zika")
    
    caminho_anos = os.path.join(caminho_base, "anos")
    anos = os.listdir(caminho_anos)
    
    set_nomes_dos_municipios = set()

    for indexAno, dir in enumerate(anos):
        criterios = {}
        
        files = os.listdir(os.path.join(caminho_anos, dir))
        ano = MAPEAMENTO_ANOS.get(indexAno)
        total_por_ano = None

        for index, file in enumerate(files):
            caminho_arquivo = os.path.join(caminho_anos, dir, file)
            if caminho_arquivo.endswith(".csv"):
                nomeCriterio = MAPEAMENTO_CRITERIOS.get(index)
                dados_por_criterio, nomes_municipios = leitor_(caminho_arquivo, ano)

                set_nomes_dos_municipios.update(nomes_municipios)

                if not total_por_ano:
                    total_por_ano = dados_por_criterio.municipios.get("Total").get("Total")
                    total_absoluto+= total_por_ano
                criterios[nomeCriterio] = dados_por_criterio
        dados_por_ano[ano] = CasosPorAno(total=total_por_ano, criterios=criterios)

    casos = Casos(
        total=total_absoluto,
        anos=dados_por_ano
    )

    DADOS = DoencaAnalisada(
        nome="Zika",
        estado_analisado="Paraíba",
        casos=casos,
        nomes_municipios_analisados=sorted(list(set_nomes_dos_municipios))
    )


    if DADOS:
        print("DADOS MUNICÍPOS CARREGADOS")
    else:
         print("FALHA NO CARREGAMENTO DOS DADOS - CONSULTE ISAAC")

    global DADOS_IBGE
    DADOS_IBGE = leitorIBGE(DADOS.nomes_municipios_analisados, DADOS.casos.anos, caminho=os.path.join(caminho_base, "ibge", "dadosIBGE.csv"))

@app.get("/dados/ibge/{ano}")
async def getDadosIBGE(ano:str):

    if ano:
        try:
            DADOS.casos.anos[ano]
        except KeyError:
            return {"Error": "Ano não encontrado"}
    
    dados_municipios = DADOS.casos.anos[ano].criterios.get("porfaixaetaria").municipios

    total_por_municipio_por_ano = {}

    for municipio, valores in dados_municipios.items():
        total_por_municipio_por_ano[municipio] = valores.get("Total")

    dados_ibge_filtrados = copy.deepcopy(DADOS_IBGE)

    for municipio, valores in dados_ibge_filtrados.items():
        if total_por_municipio_por_ano.get(municipio) is not None:
            dados_ibge_filtrados[municipio].update({"Total": total_por_municipio_por_ano.get(municipio)})

    dados_filtrados_nao_vazios = {municipio : informacoes for municipio, informacoes in dados_ibge_filtrados.items() if isinstance(informacoes.get("Total"), (int, float))}
    
    return dados_filtrados_nao_vazios
    


@app.get("/dados/populacao")
async def getDadosPopulacao(ano:Optional[str]=None):
    
    if ano:
        try:
            return DADOS_POPULACAO[ano]
        except KeyError:
            return {"Error": "Ano não encontrado"}
    

    return DADOS_POPULACAO

@app.get("/dados")
async def getAllDados():
    return DADOS

@app.get("/dados/criterios")
async def getDadosFromCriterios(ano:Optional[str]=None):

    if ano:
        try:
            return DADOS.casos.anos[ano]
        except KeyError:
            return {"Error": "Ano não encontrado! Coloque no intervalo de 2020-2024"}

    return DADOS.casos

@app.get("/dados/total")
async def getTotalDeDados(ano:Optional[str]=None):


    if not ano:
        dados = {
            "totalParaiba": DADOS.casos.total,
            "2021": DADOS.casos.anos.get("2021").total,
            "2020": DADOS.casos.anos.get("2020").total,
            "2022": DADOS.casos.anos.get("2022").total,
            "2023": DADOS.casos.anos.get("2023").total,
            "2024": DADOS.casos.anos.get("2024").total,
    }
    else:
        return DADOS.casos.anos.get(ano).total

    return dados

@app.get("/dados/anos/{ano}/{criterio}")
async def getDadosFromCriterio(ano:str, criterio:str, municipio:Optional[str]=None):

    try:
        dados_por_ano = DADOS.casos.anos[ano]
    except KeyError:
        return {"Error": "Ano não encontrado! Coloque no intervalo de 2020-2024"}
    
    index = None
    for i, c in MAPEAMENTO_CRITERIOS.items():
        print(c)
        if c.lower() == criterio.lower():
            index = MAPEAMENTO_CRITERIOS.get(i)
            break

    if not index:
        return {"Error": "Criterio não encontrado"}
    
    if municipio:
        try:
            return dados_por_ano.criterios.get(criterio.lower()).municipios.get(municipio.upper())
        except KeyError:
            return {"Error": "Município não encontrado"}
    
    return dados_por_ano.criterios.get(criterio.lower()).municipios



# para rodar: uvicorn api.main:app --reload --port 5000