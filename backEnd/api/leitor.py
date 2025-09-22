import pandas as pd
import os
from .models import *


def leitor(caminho, nomeCriterio):
    try:
        df = pd.read_csv(caminho, encoding="cp1252", delimiter=";", skipfooter=1, skiprows=3, engine='python')
        df_headers = df.columns.tolist()
        df_headers.pop(0)
        lista_dados_dos_municipios = {}

        

        for i, row in df.iterrows():

            municipio = "".join((list(map(lambda letra: letra if letra.isalpha() else "", str(row.iloc[0]))))).strip() #pega o nome do municipio
            if municipio not in lista_dados_dos_municipios:
                lista_dados_dos_municipios[municipio] = {}

            for col in df_headers:
                valor = str(row[col]).replace("-", "0")
                try:
                    valor_int = int(float(valor))
                except ValueError:
                    valor_int = 0
                lista_dados_dos_municipios[municipio].update({col:valor_int})
                
        return Criterio(
            nome=nomeCriterio,
            municipios=lista_dados_dos_municipios
        )

    except FileNotFoundError:
        print("Arquivo não encontrado - ", caminho)
    except Exception as e:
        print("Erro desconhecido: ", e)

MAPEAMENTO_CRITERIOS = {
    0:"porFaixaEtaria",
    1:"porGenero",
    2:"porMes",
}

MAPEAMENTO_ANOS = {
    0:"2020",
    1:"2021",
    2:"2022",
    3:"2023",
    4:"2024",
}

def leitor_(caminho, ano):
    df = pd.read_csv(caminho, encoding="cp1252", delimiter=";", skipfooter=20, skiprows=3, engine='python')
    df_headers = df.columns.tolist()
    df_headers.pop(0)

    lista_dados_dos_municipios = {}

    for i, row in df.iterrows():
        
        municipio = "".join((list(filter(lambda letra: letra.isalpha(), str(row.iloc[0]))))).strip()
        
        if municipio not in lista_dados_dos_municipios:
                lista_dados_dos_municipios[municipio] = {}
                
        for col in df_headers:
            try:
                valor_int = int(float(row[col]))
            except ValueError:
                valor_int = 0
            lista_dados_dos_municipios[municipio].update({col:valor_int})
    
    

    return Criterio(
        municipios=lista_dados_dos_municipios
    )

   




if __name__ == "__main__":
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