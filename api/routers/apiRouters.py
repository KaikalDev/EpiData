from fastapi import APIRouter
from ..leitor import leitor
from ..models import DoencaAnalisada
import os
from typing import Optional
router = APIRouter()

DADOS = None

MAPEAMENTO_CRITERIOS = {
    0:"porAno",
    1:"porFaixaEtaria",
    2:"porGenero",
    3:"porMes",
}


@router.on_event("startup")
def load_data():
    global DADOS
    dados_por_criterio = []
    for index, file in enumerate(os.listdir(r'api\data')):
        criterio = leitor(os.path.join("api", "data", file), MAPEAMENTO_CRITERIOS[index])

        if criterio:
            dados_por_criterio.append(criterio)
    
    DADOS = DoencaAnalisada(nome="zika", criterios=dados_por_criterio)

    if DADOS:
        print("ok")
    else:
        print("not ok")


@router.get("/dados")
async def getAllDados():
    return DADOS

@router.get("/dados/{criterio}")
async def getDadosFromCriterio(criterio:str, municipio:Optional[str]=None):
    index = None
    for i, c in MAPEAMENTO_CRITERIOS.items():
        if c.lower() == criterio.lower():
            index = i
    
    if not index:
        return {"Error": "Criterio não encontrado"}
    
    if municipio:
        try:
            return DADOS.criterios[index].municipios.get(municipio.upper())
        except KeyError:
            return {"Error": "Municipio não encontrado"}

    return DADOS.criterios[index]
