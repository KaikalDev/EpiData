import pandas as pd
import os
from api.models import *


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

def normalize_municipio(municipio):
    municipio_formatado = str(municipio).upper()
    campos_possiveis = {
    'AGUABRANCA': 'Água Branca',
    'AGUIAR': 'Aguiar',
    'ALAGOAGRANDE': 'Alagoa Grande',
    'ALAGOANOVA': 'Alagoa Nova',
    'ALAGOINHA': 'Alagoinha',
    'ALCANTIL': 'Alcantil',
    'ALGODAODEJANDAIRA': 'Algodão de Jandaíra',
    'ALHANDRA': 'Alhandra',
    'AMPARO': 'Amparo',
    'APARECIDA': 'Aparecida',
    'ARACAGI': 'Araçagi',
    'ARARA': 'Arara',
    'ARARUNA': 'Araruna',
    'AREIA': 'Areia',
    'AREIADEBARAUNAS': 'Areia de Baraúnas',
    'AREIAL': 'Areial',
    'AROEIRAS': 'Aroeiras',
    'ASSUNCAO': 'Assunção',
    'BAIADATRAICAO': 'Baía da Traição',
    'BANANEIRAS': 'Bananeiras',
    'BARAUNA': 'Baraúna',
    'BARRADESANTAROSA': 'Barra de Santa Rosa',
    'BARRADESANTAANA': 'Barra de Santana',
    'BARRADESAOMIGUEL': 'Barra de São Miguel',
    'BAYEUX': 'Bayeux',
    'BELEM': 'Belém',
    'BELEMDOBREJODOCRUZ': 'Belém do Brejo do Cruz',
    'BERNARDINOBATISTA': 'Bernardino Batista',
    'BOAVENTURA': 'Boa Ventura',
    'BOAVISTA': 'Boa Vista',
    'BOMJESUS': 'Bom Jesus',
    'BOMSUCESSO': 'Bom Sucesso',
    'BONITODESANTAFE': 'Bonito de Santa Fé',
    'BOQUEIRAO': 'Boqueirão',
    'BORBOREMA': 'Borborema',
    'BREJODOCRUZ': 'Brejo do Cruz',
    'BREJODOSSANTOS': 'Brejo dos Santos',
    'CAAPORA': 'Caaporã',
    'CABACEIRAS': 'Cabaceiras',
    'CABEDELO': 'Cabedelo',
    'CACHOEIRADOSINDIOS': 'Cachoeira dos Índios',
    'CACIMBADEAREIA': 'Cacimba de Areia',
    'CACIMBADEDENTRO': 'Cacimba de Dentro',
    'CACIMBAS': 'Cacimbas',
    'CAICARA': 'Caiçara',
    'CAJAZEIRAS': 'Cajazeiras',
    'CAJAZEIRINHAS': 'Cajazeirinhas',
    'CALDASBRANDAO': 'Caldas Brandão',
    'CAMALAU': 'Camalaú',
    'CAMPINAGRANDE': 'Campina Grande',
    'CAPIM': 'Capim',
    'CARAUBAS': 'Caraúbas',
    'CARRAPATEIRA': 'Carrapateira',
    'CASSERENGUE': 'Casserengue',
    'CATINGUEIRA': 'Catingueira',
    'CATOLEDOROCHA': 'Catolé do Rocha',
    'CATURITE': 'Caturité',
    'CONCEICAO': 'Conceição',
    'CONDADO': 'Condado',
    'CONDE': 'Conde',
    'CONGO': 'Congo',
    'COREMAS': 'Coremas',
    'COXIXOLA': 'Coxixola',
    'CRUZDOESPIRITOSANTO': 'Cruz do Espírito Santo',
    'CUBATI': 'Cubati',
    'CUITE': 'Cuité',
    'CUITEGI': 'Cuitegi',
    'CUITEDEMAMANGUAPE': 'Cuité de Mamanguape',
    'CURRALDECIMA': 'Curral de Cima',
    'CURRALVELHO': 'Curral Velho',
    'DAMIAO': 'Damião',
    'DESTERRO': 'Desterro',
    'DIAMANTE': 'Diamante',
    'DONAINES': 'Dona Inês',
    'DUASESTRADAS': 'Duas Estradas',
    'EMAS': 'Emas',
    'ESPERANCA': 'Esperança',
    'FAGUNDES': 'Fagundes',
    'FREIMARTINHO': 'Frei Martinho',
    'GADOBRAVO': 'Gado Bravo',
    'GUARABIRA': 'Guarabira',
    'GURINHEM': 'Gurinhém',
    'GURJAO': 'Gurjão',
    'IBIARA': 'Ibiara',
    'IMACULADA': 'Imaculada',
    'INGA': 'Ingá',
    'ITABAIANA': 'Itabaiana',
    'ITAPORANGA': 'Itaporanga',
    'ITAPOROROCA': 'Itapororoca',
    'ITATUBA': 'Itatuba',
    'JACARAU': 'Jacaraú',
    'JERICO': 'Jericó',
    'JOAOPESSOA': 'João Pessoa',
    'JUAREZTAVORA': 'Juarez Távora',
    'JUAZEIRINHO': 'Juazeirinho',
    'JUNCODOSERIDO': 'Junco do Seridó',
    'JURIPIRANGA': 'Juripiranga',
    'JURU': 'Juru',
    'LAGOA': 'Lagoa',
    'LAGOADEDENTRO': 'Lagoa de Dentro',
    'LAGOASECA': 'Lagoa Seca',
    'LASTRO': 'Lastro',
    'LIVRAMENTO': 'Livramento',
    'LOGRADOURO': 'Logradouro',
    'LUCENA': 'Lucena',
    'MAEDAGUA': 'Mãe d\'Água',
    'MALTA': 'Malta',
    'MAMANGUAPE': 'Mamanguape',
    'MANAIRA': 'Manaíra',
    'MARCACAO': 'Marcação',
    'MARI': 'Mari',
    'MARIZOPOLIS': 'Marizópolis',
    'MASSARANDUBA': 'Massaranduba',
    'MATARACA': 'Mataraca',
    'MATINHAS': 'Matinhas',
    'MATOGROSSO': 'Mato Grosso',
    'MATUREIA': 'Maturéia',
    'MOGEIRO': 'Mogeiro',
    'MONTADAS': 'Montadas',
    'MONTEHOREBE': 'Monte Horebe',
    'MONTEIRO': 'Monteiro',
    'MULUNGU': 'Mulungu',
    'NATUBA': 'Natuba',
    'NAZAREZINHO': 'Nazarezinho',
    'NOVAFLORESTA': 'Nova Floresta',
    'NOVAOLINDA': 'Nova Olinda',
    'NOVAPALMEIRA': 'Nova Palmeira',
    'OLHODAGUA': 'Olho d\'Água',
    'OLIVEDOS': 'Olivedos',
    'OUROVELHO': 'Ouro Velho',
    'PARARI': 'Parari',
    'PASSAGEM': 'Passagem',
    'PATOS': 'Patos',
    'PAULISTA': 'Paulista',
    'PEDRABRANCA': 'Pedra Branca',
    'PEDRALAVRADA': 'Pedra Lavrada',
    'PEDRASDEFOGO': 'Pedras de Fogo',
    'PIANCO': 'Piancó',
    'PICUI': 'Picuí',
    'PILAR': 'Pilar',
    'PILÕES': 'Pilões',
    'PILOEZINHOS': 'Pilõezinhos',
    'PIRPIRITUBA': 'Pirpirituba',
    'PITIMBU': 'Pitimbu',
    'POCINHOS': 'Pocinhos',
    'POCODANTAS': 'Poço Dantas',
    'POCODEJOSEDEMOURA': 'Poço de José de Moura',
    'POMBAL': 'Pombal',
    'PRATA': 'Prata',
    'PRINCESAISABEL': 'Princesa Isabel',
    'PUXINANA': 'Puxinanã',
    'QUEIMADAS': 'Queimadas',
    'QUIXABA': 'Quixaba',
    'REMIGIO': 'Remígio',
    'PEDROREGIS': 'Pedro Régis',
    'RIACHAO': 'Riachão',
    'RIACHAODOBACAMARTE': 'Riachão do Bacamarte',
    'RIACHAODOPOCÓ': 'Riachão do Poçó',
    'RIACHODOSANTOANTONIO': 'Riacho de Santo Antônio',
    'RIACHODOSCAVALOS': 'Riacho dos Cavalos',
    'RIOTINTO': 'Rio Tinto',
    'SALGADINHO': 'Salgadinho',
    'SALGADODESAO FELIX': 'Salgado de São Félix',
    'SANTACECILIA': 'Santa Cecília',
    'SANTACRUZ': 'Santa Cruz',
    'SANTAHELENA': 'Santa Helena',
    'SANTAINES': 'Santa Inês',
    'SANTALUZIA': 'Santa Luzia',
    'SANTANADEMANGUEIRA': 'Santana de Mangueira',
    'SANTANADOSGARROTES': 'Santana dos Garrotes',
    'JOCACLAUDINO': 'Joca Claudino',
    'SANTARITA': 'Santa Rita',
    'SANTATERESINHA': 'Santa Teresinha',
    'SANTOANDRE': 'Santo André',
    'SAOBENTO': 'São Bento',
    'SAOBENTINHO': 'São Bentinho',
    'SAODOMINGOSDOCARIRI': 'São Domingos do Cariri',
    'SAODOMINGOS': 'São Domingos',
    'SAOFRANCISCO': 'São Francisco',
    'SAOJOAODOCARIRI': 'São João do Cariri',
    'SAOJOAODOTIGRE': 'São João do Tigre',
    'SAOJOSEDALAGOATAPADA': 'São José da Lagoa Tapada',
    'SAOJOSEDECAIANA': 'São José de Caiana',
    'SAOJOSEDEESPINHARAS': 'São José de Espinharas',
    'SAOJOSEDOSRAMOS': 'São José dos Ramos',
    'SAOJOSEDEPIRANHAS': 'São José de Piranhas',
    'SAOJOSEDEPRINCESA': 'São José de Princesa',
    'SAOJOSEDOBONFIM': 'São José do Bonfim',
    'SAOJOSEDOBREJODOCRUZ': 'São José do Brejo do Cruz',
    'SAOJOSEDOSABUGI': 'São José do Sabugi',
    'SAOJOSEDOSCORDEIROS': 'São José dos Cordeiros',
    'SAOMAMEDE': 'São Mamede',
    'SAOMIGUELDETAIPU': 'São Miguel de Taipu',
    'SAOSEBASTIAODELAGOADAROCA': 'São Sebastião de Lagoa de Roça',
    'SAOSEBASTIAODOUMBUZEIRO': 'São Sebastião do Umbuzeiro',
    'SAPE': 'Sapé',
    'SAOVICENTEDOSERIDO': 'São Vicente do Seridó',
    'SERRABRANCA': 'Serra Branca',
    'SERRADARAIZ': 'Serra da Raiz',
    'SERRAGRANDE': 'Serra Grande',
    'SERRAREDONDA': 'Serra Redonda',
    'SERRARIA': 'Serraria',
    'SERTAOZINHO': 'Sertãozinho',
    'SOBRADO': 'Sobrado',
    'SOLANEA': 'Solânea',
    'SOLEDADE': 'Soledade',
    'SOSSEGO': 'Sossêgo',
    'SOUSA': 'Sousa',
    'SUME': 'Sumé',
    'TACIMA': 'Tacima',
    'TAPEROA': 'Taperoá',
    'TAVARES': 'Tavares',
    'TEIXEIRA': 'Teixeira',
    'TENORIO': 'Tenório',
    'TRIUNFO': 'Triunfo',
    'UIRAUNA': 'Uiraúna',
    'UMBUZEIRO': 'Umbuzeiro',
    'VARZEA': 'Várzea',
    'VIEIROPOLIS': 'Vieirópolis',
    'VISTASERRANA': 'Vista Serrana',
    'ZABELE': 'Zabelê',
    'TOTAL':'Total'
    }
    
    try:
        return campos_possiveis[municipio_formatado]
    except KeyError:
        return None



def leitor_(caminho, ano):
    #aplica encoding para ler melhor os caracteres especiais
    df = pd.read_csv(caminho, encoding="cp1252", delimiter=";", skipfooter=20, skiprows=3, engine='python')
    df_headers = df.columns.tolist()
    df_headers.pop(0)

    lista_dados_dos_municipios = {}
    lista_nomes_dos_municipios = []
    for i, row in df.iterrows():
        #para deixar o nome do município capitalizado e com os espaços necessários
        municipio = normalize_municipio("".join((list(filter(lambda letra: letra.isalpha(), str(row.iloc[0]))))).strip())
        
        if municipio is None:
            continue
        
        if municipio not in lista_nomes_dos_municipios:
            lista_nomes_dos_municipios.append(municipio)

        if municipio not in lista_dados_dos_municipios:
                lista_dados_dos_municipios[municipio] = {}

        for col in df_headers:
            try:
                valor_int = int(float(row[col]))
            except ValueError:
                valor_int = 0
            lista_dados_dos_municipios[municipio].update({col:valor_int})
    
    
    return (Criterio(
        municipios=lista_dados_dos_municipios
    ), lista_nomes_dos_municipios)

   
def leitorIBGE(municipiosAnalisados, dadosPorAno, caminho=None):
    dados = pd.read_csv(caminho, encoding="latin1", engine="python", delimiter=",")

    novos_nomes = {
        'Munic&iacute;pio [-]': 'Município',
        'C&oacute;digo [-]': 'Código',
        'Gent&iacute;lico [-]': 'Gentílico',
        'Prefeito [2025]': 'Prefeito',
        '&Aacute;rea Territorial - km&sup2; [2024]': 'Área Territorial (km²)',
        'Popula&ccedil;&atilde;o no &uacute;ltimo censo - pessoas [2022]': 'População Censo (2022)',
        'Densidade demogr&aacute;fica - hab/km&sup2; [2022]': 'Densidade Demográfica (hab/km²)',
        'Popula&ccedil;&atilde;o estimada - pessoas [2025]': 'População Estimada (2025)',
        'Escolariza&ccedil;&atilde;o &lt;span&gt;6 a 14 anos&lt;/span&gt; - % [2022]': 'Escolarização (6-14 anos)',
        'IDHM &lt;span&gt;&Iacute;ndice de desenvolvimento humano municipal&lt;/span&gt; [2010]': 'IDHM (2010)',
        'Mortalidade infantil - &oacute;bitos por mil nascidos vivos [2023]': 'Mortalidade Infantil (2023)',
        'Total de receitas brutas realizadas - R$ [2024]': 'Receitas (2024)',
        'Total de despesas brutas empenhadas - R$ [2024]': 'Despesas (2024)',
        'PIB per capita - R$ [2021]': 'PIB per capita (2021)',
        'Unnamed: 14': 'Coluna Vazia'  # Ou remova essa coluna se não precisar
    }

    dados.rename(columns=novos_nomes, inplace=True)

    #somente as colunas necessárias
    for col in dados.columns.tolist():
        if col not in ["Município", "População Censo (2022)", "IDHM (2010)", "PIB per capita (2021)"]:
            dados.drop(columns=[col], inplace=True)

    def limpa_municipio(municipio):
        municipio_limpo = str(municipio).strip()

        substituicoes = {
            '&Aacute;': 'Á',
            '&atilde;': 'ã',
            '&ccedil;': 'ç',
            '&ecirc;': 'ê',
            '&iacute;': 'í',
            '&otilde;': 'õ',
            '&uacute;': 'ú',
            '&Uacute;': 'Ú',
            '&atilde;': 'ã',
            '&atilde;o': 'ão',
            '&atilde;a': 'ãa',
            '&Atilde;': 'Ã',
            '&ocirc;': 'ô',
            '&Ocirc;': 'Ô',
            '&sup2;': '²',
            '&igrave;': 'ì',
            '&euml;': 'ë',
            '&aacute;': 'á',
            '&Atilde;o': 'ão',
            '&oacute;': "ó",
            '&eacute;': 'é',
            '&acirc;': 'â',
            ';': ''
        }

        for subs, char in substituicoes.items():
            municipio_limpo = municipio_limpo.replace(subs, char)
        
        return municipio_limpo
    
    
    #aplica a limpeza para cada município
    dados["Município"] = dados["Município"].apply(limpa_municipio)
    # retorna uma máscara que contenha os municípios que estejam na lista dos analisados
    filtragem = dados['Município'].isin(municipiosAnalisados)
    # aplica a filtragem no dataset
    dados_filtrados_pelos_municipios_analisados = dados[filtragem]

    dados_municipios = {}

    for i, row in dados_filtrados_pelos_municipios_analisados.iterrows():
        dados_municipios.update({row[0]: {"População": row[1], "IDHM": row[2], "PIB":row[3], "Total": ""}})

    return dados_municipios


if __name__ == "__main__":
    pass
    
    

    