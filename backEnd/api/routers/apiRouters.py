from fastapi import APIRouter
from ..leitor import leitor, leitor_
from ..models import *
import os
from typing import Optional
router = APIRouter()

DADOS = None

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

@router.on_event("startup")
def load_data():
    global DADOS
    
    dados_por_ano = {}
    total_absoluto = 0

    caminho_base = os.path.join("api", "data", "paraiba", "zika", "anos")
    anos = os.listdir(caminho_base)

    for indexAno, dir in enumerate(anos):
        criterios = {}

        files = os.listdir(os.path.join(caminho_base, dir))
        ano = MAPEAMENTO_ANOS.get(indexAno)
        total_por_ano = None

        for index, file in enumerate(files):
            caminho_arquivo = os.path.join(caminho_base, dir, file)
            if caminho_arquivo.endswith(".csv"):
                nomeCriterio = MAPEAMENTO_CRITERIOS.get(index)
                dados_por_criterio = leitor_(caminho_arquivo, ano)
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
        casos=casos
    )

    if DADOS:
        print("ok")
    else:
        print("not ok")


@router.get("/dados")
async def getAllDados():
    return DADOS

@router.get("/dados/anos")
async def getDadosFromAnos(ano:Optional[str]=None):

    if ano:
        try:
            return DADOS.casos.anos[ano]
        except KeyError:
            return {"Error": "Ano não encontrado! Coloque no intervalo de 2020-2024"}

    return DADOS.casos

@router.get("/dados/anos/{ano}/{criterio}")
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

