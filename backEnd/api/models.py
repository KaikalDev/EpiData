from pydantic import BaseModel
from typing import Optional

class Criterio(BaseModel):
    municipios:dict = None
    
class Casos(BaseModel):
    total:int
    anos:dict

class DoencaAnalisada(BaseModel):
    nome:str
    estado_analisado:str
    casos:Optional[Casos] = None


class CasosPorAno(BaseModel):
    total:int
    criterios: Optional[dict]

#anos > ano > criterio > municipios
