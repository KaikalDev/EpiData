import pandas as pd
import os
from .models import *





# MAPA_COLUNAS_CRITERIO = {
#     "porAno": ["Município de residência", "2021", "2022", "2023", "2024", "2025", "Total"],
#     "porGenero": ["Município de residência", "Masculino", "Feminino", "Ignorado", "Total"],
#     "porFaixaEtaria": ["Município de residência", "<1 Ano", "1-4", "5-9", "10-14", "15-19", "20-39", "40-59", "60-64", "65-"],
#     "porMes": ["Município de residência", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez", "Total"]
# }

# def leitor_csv(arquivo, criterio:Criterio):
    
#     colunas = MAPA_COLUNAS_CRITERIO.get(criterio.nome)
    
#     caminho_do_script = os.path.dirname(os.path.abspath(__file__))
#     caminho_da_pasta_data = os.path.join(os.path.dirname(caminho_do_script), 'api', 'data')
#     caminho_completo = os.path.join(caminho_da_pasta_data, arquivo)

#     df = pd.read_csv(caminho_completo, encoding='cp1252', delimiter=";")

#     lista_municipios = []

#     for _, row in df.iterrows():
#         municipio_nome = row.iloc[0]
#         print(municipio_nome)
#         municipio_dados = []
#         dados_por_coluna = {}


#         for coluna in colunas:
#             if coluna != "Município de residência":
#                 try:
#                     dado = int(row.loc[coluna])
#                 except ValueError:
#                     dado = 0
#                 dados_por_coluna[coluna] = dado
#         municipio_dados.append(dados_por_coluna)

#         lista_dados = Municipio(nome=municipio_nome, dados=municipio_dados)
#         lista_municipios.append(lista_dados)

#     criterio.municipios = lista_municipios

#     return criterio

# tabela = pd.read_csv(r'api\data\zikaPorMunicipioEmUmAno.csv', encoding='cp1252', delimiter=";")

# print(tabela.iloc[0, 0])
# print(tabela.iloc[0, 1])
# print(tabela.iloc[0, 2])
# print(tabela.iloc[0, 3])
# print(tabela.iloc[0, 4])
# print(tabela.iloc[0, 5])
# print(tabela.iloc[0, 6])

# 
def leitor(caminho, nomeCriterio):
    try:
        df = pd.read_csv(caminho, encoding="cp1252", delimiter=";", skipfooter=1, engine='python')
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
