from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.leitor import leitor_, leitorIBGE
from api.models import *
import os
import copy
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from numpy import round
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

# funções base para os DADOS

def get_total_dados_por_mes():
    dados_totais_por_ano = {}
    for ano, dado in DADOS.casos.anos.items():
        dados_por_municipio = dado.criterios.get("pormes").municipios
        dados_totais_por_ano[ano] = {}
        for dados in dados_por_municipio.values():
            for mes, valor in dados.items():
                if mes not in dados_totais_por_ano and mes != "Total":
                    dados_totais_por_ano[ano].update({mes:0})
                
                if mes != "Total":
                    dados_totais_por_ano[ano][mes] += valor
    return dados_totais_por_ano

# preciso converter os dados de dicts para uma grande series temporal
def get_total_dados_por_mes_reestruturados():
    meses_map = {"Jan": 1, "Fev": 2, "Mar": 3, "Abr": 4, "Mai": 5, "Jun": 6, 
             "Jul": 7, "Ago": 8, "Set": 9, "Out": 10, "Nov": 11, "Dez": 12}
    
    series = pd.Series(dtype=float) # crio minha serie float vazia, como se fosse uma lista

    #preencher com os dados totais:
    raw_data = get_total_dados_por_mes()
    for ano in raw_data.keys():
        # pego o total de casos de cada mes de cada ano e coloco num indice
        for mes, total_casos in raw_data[ano].items():
            # cria indice fácil de ordenar: 2020-01, 2020-02
            dados_indexados = {f"{ano}-{meses_map[mes]:02d}":total_casos}
            
            # primeiro arg passo ele mesmo e coloco a nova lista sobre ele
            series = pd.concat([series, pd.Series(dados_indexados)])
    #ordena os indices, não tem nenhum efeito nesse caso, mas pode ser que tenha no futuro
    series.sort_index(inplace=True)
    return series.to_frame()

def get_df_total_dados_por_mes():
    df = get_total_dados_por_mes_reestruturados()

    df.rename(columns={0:"Casos"}, inplace=True)
    #cria nova coluna baseando-se que y = casos e X = casos_mes_anterior
    df["Casos_Mes_Anterior"] = df["Casos"].shift(1)
    
    #elimina linhas que contenha NAN que é o caso da primeira
    #df.index retorna uma lista de todos os index do df
    df["Mes_Num"] = df.index.str[5:].astype(int)

    df.dropna(inplace=True)

    return df

def get_random_forest_treinado_via_casos_totais_por_mes(data):
    feature_train = data[["Casos_Mes_Anterior", "Mes_Num"]]
    #o que eu quero
    target_train = data["Casos"]

    model = RandomForestRegressor(n_estimators=100, random_state=17)
    model.fit(feature_train, target_train)

    return model


@app.get("/analisar/casos/total_por_mes/{ano}")
async def prever_total_casos_por_mes(ano:str):
    
    if ano and int(ano) >= 2025:
        meses_map_reverso = {
            1: "Jan",
            2: "Fev",
            3: "Mar",
            4: "Abr",
            5: "Mai",
            6: "Jun",
            7: "Jul",
            8: "Ago",
            9: "Set",
            10: "Out",
            11: "Nov",
            12: "Dez"
        }

        previsoes = {}

        base_previsao = get_total_dados_por_mes()["2024"]["Dez"] #último mês que tem dados
        
        df_treino = get_df_total_dados_por_mes()
        model = get_random_forest_treinado_via_casos_totais_por_mes(df_treino)

        # para as diferenças dos anos, se for 2026, processará a previsão para 2026 passando também pelos dados de 2025 por exemplo
        anos_a_analisar = []

        #para conseguir em ordem descrecente os anos até o ano da análise atual
        for i in range(0, int(ano) - 2024):
            anos_a_analisar.append(str(2025 + i))
        for ano_analisado in anos_a_analisar:

            for mes in range(1, 13):

                x_previsao = pd.DataFrame({
                    "Casos_Mes_Anterior": [base_previsao],
                    "Mes_Num": [mes]
                })

                y_previsao = model.predict(x_previsao)[0] #retorna lista, então, o indice 0
                previsao_arredondada = max(0, int(round(y_previsao)))
                
                
                base_previsao = y_previsao
                if ano_analisado not in previsoes:
                    previsoes[ano_analisado] = {}
                previsoes[ano_analisado].update({meses_map_reverso[mes]:previsao_arredondada})
            
        
        total_previsoes_ano = {}
        for ano_previsao, dados_mes in previsoes.items():
            total = 0
            for valor in dados_mes.values():
                total += valor
            total_previsoes_ano[ano_previsao] = total
        

        return {"total":total_previsoes_ano, "previsoes": previsoes}
    else:
        return {"status": "error", "message":"Ano inválido! Somente é aceito de 2025 para cima para a previsão"}

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