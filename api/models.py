from pydantic import BaseModel
from typing import List, Optional, Any, Dict

class Criterio(BaseModel):
    nome:str
    municipios:dict = None


class DoencaAnalisada(BaseModel):
    nome:str
    criterios:Optional[List[Criterio]] = None


