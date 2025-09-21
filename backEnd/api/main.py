from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import apiRouters
from .leitor import leitor
from .models import Criterio, DoencaAnalisada
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*']
)


app.include_router(router=apiRouters.router, prefix='/api', tags=['Rotas da Api'])


# para rodar: uvicorn api.main:app --reload --port 5000