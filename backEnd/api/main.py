from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.leitor import leitor_, leitorIBGE
from api.models import *
import os
import copy
import pandas as pd
from datetime import datetime
from sklearn.ensemble import RandomForestRegressor
import numpy as np
import json
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

# PREVISÃO POR MUNICÍPIO


from collections import defaultdict

def get_municipios_data():
    try:
        # Acessa os dados anuais do seu objeto global DADOS
        dados_anos = DADOS.casos.anos.items()
    except NameError:
        # Caso o DADOS não esteja definido (para testes ou ambiente local)
        print("ERRO: O objeto DADOS não está acessível.")
        return {}
    except AttributeError:
        print("ERRO: A estrutura DADOS.casos.anos não foi encontrada.")
        return {}

    municipios_data = defaultdict(lambda: defaultdict(dict))
    
    for ano, dado_ano in dados_anos:
        # Acessa os dados mensais por município dentro dos critérios
        dados_por_municipio = dado_ano.criterios.get("pormes").municipios

        for municipio, dados_meses in dados_por_municipio.items():
            if municipio != "Total":
                for mes, valor in dados_meses.items():
                    if mes != "Total":
                        municipios_data[municipio][ano][mes] = valor
    return municipios_data


def get_df_global_dados_reestruturados():
    municipios_data = get_municipios_data()
    meses_map = {"Jan": 1, "Fev": 2, "Mar": 3, "Abr": 4, "Mai": 5, "Jun": 6, 
                 "Jul": 7, "Ago": 8, "Set": 9, "Out": 10, "Nov": 11, "Dez": 12}
    
    dados_list = []
    
    for municipio, anos_data in municipios_data.items():
        all_series = pd.Series(dtype=float)
        serie_casos = []
        
        # Constrói a série temporal e coleta dados para as features de escala/contagem
        for ano, meses_data in anos_data.items():
            indexed_data = {}
            for mes, total_casos in meses_data.items():
                index = f"{ano}-{meses_map[mes]:02d}"
                indexed_data[index] = total_casos
                serie_casos.append(total_casos)
            
            new_series = pd.Series(indexed_data)
            all_series = pd.concat([all_series, new_series])

        # Calcula as Features de Escala (X4) e Contagem (X5)
        media_historica = np.mean(serie_casos) if serie_casos else 0
        log_media_historica = np.log1p(media_historica) # Log(1 + Média)
        contagem_meses = len(all_series)

        # Cria o DataFrame do Município
        df_municipio = all_series.to_frame(name="Casos")
        df_municipio.sort_index(inplace=True)
        
        df_municipio["Casos_Mes_Anterior"] = df_municipio["Casos"].shift(1)
        df_municipio["municipio"] = municipio
        
        df_municipio["Log_Media_Casos"] = log_media_historica
        df_municipio["Contagem_Meses"] = contagem_meses
        
        dados_list.append(df_municipio)

    # Combina em um único DataFrame global
    df_global = pd.concat(dados_list)
    df_global.dropna(inplace=True)

    # Cria a feature Mes_Num (X2)
    df_global["Mes_Num"] = df_global.index.str[5:].astype(int)
    
    # Cria o ID do Município (X3) e o mapeamento
    df_global['Municipio_Encoded'], unique_munis = pd.factorize(df_global['municipio'])
    municipio_mapping = dict(zip(unique_munis, range(len(unique_munis))))

    # Mapeamento das features constantes para uso na PREVISÃO (evitando recalculo)
    media_mapping = df_global.drop_duplicates(subset=['Municipio_Encoded']).set_index('Municipio_Encoded')['Log_Media_Casos']
    contagem_mapping = df_global.drop_duplicates(subset=['Municipio_Encoded']).set_index('Municipio_Encoded')['Contagem_Meses']

    df_global.drop(columns=['municipio'], inplace=True)
    
    return df_global, municipio_mapping, media_mapping, contagem_mapping

# ==============================================================================
# 2. FUNÇÃO DE TREINAMENTO
# ==============================================================================

def get_global_random_forest_treinado(df_global):
    """
    OBJETIVO: Treinar o modelo global de Random Forest Regressor.
    
    DETALHES: O modelo é treinado usando todas as 5 features criadas.
    """
    # Define todas as features de treino (X)
    feature_train = df_global[["Casos_Mes_Anterior", "Mes_Num", "Municipio_Encoded", "Log_Media_Casos", "Contagem_Meses"]]
    # Define a variável target (Y)
    target_train = df_global["Casos"]

    model = RandomForestRegressor(n_estimators=100, random_state=17)
    model.fit(feature_train, target_train)

    return model

# ==============================================================================
# 3. FUNÇÃO DE PREVISÃO
# ==============================================================================

def prever_casos_2026_modelo_global(df_global, modelo_global, municipio_mapping, media_mapping, contagem_mapping):
    # Encontra o último caso real (semente) para cada município
    df_last_case = df_global.reset_index(names=['data_mes']).groupby('Municipio_Encoded')["Casos"].last()
    
    previsoes_raw = {}
    
    for municipio_nome, municipio_id in municipio_mapping.items():
        
        # Pega o último caso real do histórico ou assume 0
        try:
            ultimo_caso_real = df_last_case.loc[municipio_id]
        except KeyError:
            ultimo_caso_real = 0 
            
        # Pega as features constantes do município
        log_media_caso = media_mapping.get(municipio_id, 0.0)
        contagem_meses = contagem_mapping.get(municipio_id, 0.0)
            
        proximo_mes_anterior = ultimo_caso_real
        previsoes_mensais = {}
        
        for mes in range(1, 13): # Previsão para Jan (1) a Dez (12)
            
            # Monta as features para a previsão do mês atual
            features_previsao = pd.DataFrame({
                "Casos_Mes_Anterior": [proximo_mes_anterior],
                "Mes_Num": [mes],
                "Municipio_Encoded": [municipio_id],
                "Log_Media_Casos": [log_media_caso],
                "Contagem_Meses": [contagem_meses]
            })
            
            previsao_mes_atual = modelo_global.predict(features_previsao)[0]
            previsao_arredondada = max(0, round(previsao_mes_atual))
            
            nome_mes = datetime.strptime(str(mes), "%m").strftime("%b")
            previsoes_mensais[nome_mes] = previsao_arredondada
            
            # Atualiza a semente para a próxima iteração
            proximo_mes_anterior = previsao_arredondada 
            
        previsoes_raw[municipio_nome] = {
            "total_casos_2026": sum(previsoes_mensais.values()),
            "previsoes_mensais_2026": previsoes_mensais
        }
        
    return previsoes_raw

# ==============================================================================
# 4. FUNÇÃO PRINCIPAL E FORMATAÇÃO DA RESPOSTA
# ==============================================================================
def get_previsao_municipios_2026_modelo_global():
    # Prepara os dados
    try:
        df_global, municipio_mapping, media_mapping, contagem_mapping = get_df_global_dados_reestruturados()
    except Exception as e:
        return {"erro": f"Falha na preparação dos dados. Verifique a estrutura de DADOS. Erro: {e}"}

    # Se o DataFrame global estiver vazio (sem dados válidos), retorna erro
    if df_global.empty:
         return {"erro": "Nenhum dado válido encontrado para treinamento. Verifique a estrutura de DADOS."}
    
    # Treina o modelo
    modelo_global = get_global_random_forest_treinado(df_global)
    
    #  Faz as previsões
    previsoes_raw = prever_casos_2026_modelo_global(df_global, modelo_global, municipio_mapping, media_mapping, contagem_mapping)
    
    #  Formata o resultado
    resultado_api = []
    total_geral_2026 = 0
    
    for municipio, dados_previsao in previsoes_raw.items():
        total_casos = dados_previsao["total_casos_2026"]
        total_geral_2026 += total_casos
        
        resultado_api.append({
            "municipio": municipio,
            "total": total_casos,
            "previsoes_mensais": dados_previsao["previsoes_mensais_2026"]
        })
        
    # Ordena para a saída final
    resultado_api.sort(key=lambda x: x["total"], reverse=True)
    
    output_final = {
        "total_geral": total_geral_2026,
        "previsoes_por_municipio": resultado_api
    }

    return output_final


@app.get("/analisar/casos/total_mensal")
async def get_total_mensal_2026():
    dados = get_previsao_municipios_2026_modelo_global()

    soma = {}
    for dado in dados.get("previsoes_por_municipio"):
        dados_mensal = dado["previsoes_mensais"]

        for mes, valor in dados_mensal.items():
            if mes not in soma:
                soma[mes] = 0
            soma[mes] += valor
    print(soma)
        
    return {"total_mensal": soma}

@app.get("/analisar/casos/total_por_municipio")
async def get_total_municipios_2026():
    dados = get_previsao_municipios_2026_modelo_global()
    
    
    
    return dados


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