import pandas as pd
import numpy as np
from datetime import datetime
import json
import os

# Carregar o arquivo Excel
base_dir = os.path.dirname(os.path.abspath(__file__))
excel_path = os.path.join(base_dir, "Analise-de-substituicao-de-calliper.xlsx")

try:
    df = pd.read_excel(excel_path)
    print("✅ Arquivo Excel carregado com sucesso!")
    print(f"📊 Colunas disponíveis: {list(df.columns)}")
    print(f"📋 Total de registros: {len(df)}")
except Exception as e:
    print(f"❌ Erro ao carregar arquivo Excel: {e}")
    exit()

# Renomear colunas para nomes consistentes
column_mapping = {
    'PARQUE': 'PARQUE',
    'ANO DE SUBSTITUICAO': 'ANO_SUBSTITUICAO', 
    'WTG': 'WTG',
    'POSSICAO DO CALLIPER': 'POSICAO_CALLIPER',
    'SUBSTITUICAO DO ORING': 'SUBSTITUICAO_ORING',
    'SUBSTITUICAO DAS PASTILHA': 'SUBSTITUICAO_PASTILHA',
    'CONDICAO CALLIPER': 'CONDICAO_CALLIPER',
    'STATUS': 'STATUS',
    'TECNICO': 'TECNICO'
}

df = df.rename(columns=column_mapping)

print("🔄 Tratando dados...")

# Converter datas e lidar com valores inválidos
df["ANO_SUBSTITUICAO"] = pd.to_datetime(df["ANO_SUBSTITUICAO"], errors='coerce')
df["SUBSTITUICAO_ORING"] = pd.to_datetime(df["SUBSTITUICAO_ORING"], errors='coerce')
df["SUBSTITUICAO_PASTILHA"] = pd.to_datetime(df["SUBSTITUICAO_PASTILHA"], errors='coerce')

# Preencher valores vazios
df["TECNICO"] = df["TECNICO"].fillna("Não Informado").replace("-", "Não Informado")
df["PARQUE"] = df["PARQUE"].fillna("Não Informado")
df["WTG"] = df["WTG"].fillna("Não Informado")
df["POSICAO_CALLIPER"] = df["POSICAO_CALLIPER"].fillna("Não Informado")
df["STATUS"] = df["STATUS"].fillna("Não Informado")

print(f"📊 Total de registros após tratamento: {len(df)}")

# --- FUNÇÃO PARA CALCULAR DADOS POR ANO ---
def calcular_dados_por_ano(df, ano=None):
    if ano:
        dados_ano = df[df["ANO_SUBSTITUICAO"].dt.year == ano]
    else:
        dados_ano = df
    
    print(f"📊 Processando {len(dados_ano)} registros para ano: {ano if ano else 'todos'}")
    
    # FILTRAR APENAS SUBSTITUIÇÕES QUE REALMENTE OCORRERAM
    substituicoes_reais = dados_ano[
        (dados_ano["SUBSTITUICAO_ORING"].notna()) | 
        (dados_ano["SUBSTITUICAO_PASTILHA"].notna())
    ]
    
    # Remover registros que são apenas problemas
    substituicoes_reais = substituicoes_reais[
        ~substituicoes_reais["STATUS"].str.lower().str.contains('by.pass|bypass|sem vazamento|pendente', na=False, regex=True)
    ]
    
    print(f"🔧 Substituições reais encontradas: {len(substituicoes_reais)}")
    
    # Métricas principais (usando TODOS os dados para os cards)
    total_turbinas = dados_ano["WTG"].nunique()
    total_callipers = len(dados_ano)
    
    # Turbinas by-passadas
    turbinas_bypass = dados_ano[dados_ano["STATUS"].str.lower().str.contains('by.pass|bypass', na=False, regex=True)]
    qtd_turbinas_bypass = turbinas_bypass["WTG"].nunique()
    
    # Turbinas sem vazamento
    turbinas_sem_vazamento = dados_ano[dados_ano["STATUS"].str.lower().str.contains('sem vazamento|pendente', na=False, regex=True)]
    qtd_turbinas_sem_vazamento = turbinas_sem_vazamento["WTG"].nunique()
    
    # SUBSTITUIÇÕES POR PARQUE - APENAS SUBSTITUIÇÕES REAIS
    substituicoes_por_parque = substituicoes_reais.groupby("PARQUE").size().reset_index(name="Total_Substituicoes")
    print(f"🏭 Substituições por parque: {substituicoes_por_parque.to_dict('records')}")
    
    # Status dos callipers (usando TODOS os dados)
    status_counts = dados_ano["STATUS"].value_counts().reset_index()
    status_counts.columns = ["Status", "Quantidade"]
    
    # SUBSTITUIÇÕES POR MÊS - APENAS SUBSTITUIÇÕES REAIS
    substituicoes_reais_com_data = substituicoes_reais.dropna(subset=["ANO_SUBSTITUICAO"])
    substituicoes_por_mes = substituicoes_reais_com_data.groupby(
        substituicoes_reais_com_data["ANO_SUBSTITUICAO"].dt.to_period("M")
    ).size().reset_index(name="Total_Substituicoes")
    substituicoes_por_mes["ANO_SUBSTITUICAO"] = substituicoes_por_mes["ANO_SUBSTITUICAO"].astype(str)
    substituicoes_por_mes = substituicoes_por_mes.rename(columns={"ANO_SUBSTITUICAO": "Mes_Ano"})
    
    # 🔥 TIPO DE SUBSTITUIÇÃO - CÁLCULO CORRETO
    print("🔍 Calculando tipo de substituição...")
    
    # CONTAGEM INDIVIDUAL DE CADA TIPO DE SUBSTITUIÇÃO
    # Cada substituição conta como +1, independente de ser apenas uma peça ou ambas
    
    # Contar O-Rings substituídos (cada linha com data de O-Ring conta como +1)
    oring_count = substituicoes_reais["SUBSTITUICAO_ORING"].notna().sum()
    
    # Contar Pastilhas substituídas (cada linha com data de Pastilha conta como +1)
    pastilha_count = substituicoes_reais["SUBSTITUICAO_PASTILHA"].notna().sum()
    
    # Total de substituições realizadas (soma de todas as intervenções)
    total_substituicoes = oring_count + pastilha_count
    
    print(f"📋 Contagem de substituições:")
    print(f"   - O-Rings substituídos: {oring_count}")
    print(f"   - Pastilhas substituídas: {pastilha_count}")
    print(f"   - Total de intervenções: {total_substituicoes}")
    
    # Calcular percentuais baseado no TOTAL de intervenções
    percentual_oring = (oring_count / total_substituicoes) * 100 if total_substituicoes > 0 else 0
    percentual_pastilha = (pastilha_count / total_substituicoes) * 100 if total_substituicoes > 0 else 0
    
    # Verificar se a soma dá 100% (arredondamento)
    soma_percentuais = percentual_oring + percentual_pastilha
    print(f"   - Soma dos percentuais: {soma_percentuais:.1f}%")
    
    percentual_tipo = pd.DataFrame({
        "Tipo": ["O-Ring", "Pastilhas"],
        "Percentual": [percentual_oring, percentual_pastilha],
        "Quantidade": [oring_count, pastilha_count]
    })
    
    # Posição dos callipers (usando SUBSTITUIÇÕES REAIS)
    posicao_counts = substituicoes_reais["POSICAO_CALLIPER"].value_counts().reset_index()
    posicao_counts.columns = ["Posicao", "Quantidade"]
    
    # MÁQUINAS COM PROBLEMAS - TODOS OS REGISTROS PROBLEMÁTICOS
    maquinas_problema = dados_ano[
        dados_ano["STATUS"].str.lower().str.contains('by.pass|bypass|sem vazamento|pendente', na=False, regex=True)
    ]
    
    print(f"🔍 Encontradas {len(maquinas_problema)} máquinas com problemas")
    print(f"🔧 Substituições reais totais: {len(substituicoes_reais)}")
    
    # Preparar dados para relatório
    maquinas_problema_list = []
    for _, row in maquinas_problema.iterrows():
        wtg = row["WTG"]
        parque = row["PARQUE"]
        posicao = row["POSICAO_CALLIPER"]
        status = row["STATUS"]
        data_substituicao = row["ANO_SUBSTITUICAO"]
        
        if pd.isna(wtg) or wtg == "":
            wtg = "WTG Não Informado"
        if pd.isna(parque) or parque == "":
            parque = "Parque Não Informado"
        if pd.isna(posicao) or posicao == "":
            posicao = "Posição Não Informada"
        if pd.isna(status) or status == "":
            status = "Status Não Informado"
        
        maquinas_problema_list.append({
            "WTG": str(wtg),
            "PARQUE": str(parque),
            "POSICAO_CALLIPER": str(posicao),
            "STATUS": str(status),
            "ANO_SUBSTITUICAO": data_substituicao.strftime('%Y-%m-%d') if pd.notna(data_substituicao) else "Data Não Informada"
        })
    
    # Calcular callipers substituídos para o card
    callipers_substituidos = len(substituicoes_reais)
    
    return {
        "totalTurbinas": total_turbinas,
        "totalCallipers": total_callipers,
        "turbinasByPass": qtd_turbinas_bypass,
        "turbinasSemVazamento": qtd_turbinas_sem_vazamento,
        "callipersSubstituidos": callipers_substituidos,
        "substituicoesPorParque": substituicoes_por_parque.to_dict(orient="records"),
        "statusCallipers": status_counts.to_dict(orient="records"),
        "substituicoesPorMes": substituicoes_por_mes.to_dict(orient="records"),
        "percentualTipoSubstituicao": percentual_tipo.to_dict(orient="records"),
        "posicaoCallipers": posicao_counts.to_dict(orient="records"),
        "maquinasProblema": maquinas_problema_list
    }

# --- CALCULAR DADOS PARA TODOS OS ANOS E FILTRADOS ---
dados_todos = calcular_dados_por_ano(df)
dados_2024 = calcular_dados_por_ano(df, 2024)
dados_2025 = calcular_dados_por_ano(df, 2025)

# --- CORRIGIR ANOS DISPONÍVEIS ---
anos_validos = df["ANO_SUBSTITUICAO"].dt.year.dropna().unique()
anos_validos = [int(ano) for ano in anos_validos if not pd.isna(ano)]
anos_validos.sort()

print(f"📅 Anos disponíveis: {anos_validos}")

# --- DADOS COMPLETOS PARA O DASHBOARD ---
dashboard_data = {
    "todos": dados_todos,
    "2024": dados_2024,
    "2025": dados_2025,
    "anosDisponiveis": anos_validos,
    "parques": df["PARQUE"].unique().tolist()
}

# Adicionar cores
cores_status = {
    "by-passado": "#ef4444",
    "bypassado": "#ef4444",
    "sem vazamento": "#22c55e", 
    "pendente": "#f59e0b",
    "reparos substituidos": "#3b82f6",
    "reparado": "#3b82f6",
    "operacional": "#22c55e",
    "não informado": "#6b7280"
}

for ano in ["todos", "2024", "2025"]:
    for item in dashboard_data[ano]["statusCallipers"]:
        status_lower = item["Status"].lower().strip()
        item["color"] = cores_status.get(status_lower, "#6b7280")
    
    for item in dashboard_data[ano]["percentualTipoSubstituicao"]:
        if item["Tipo"] == "O-Ring":
            item["color"] = "#3b82f6"
        else:
            item["color"] = "#f59e0b"
    
    cores_posicao = {"1": "#3b82f6", "2": "#22c55e", "3": "#f59e0b", "4": "#ef4444", "5": "#8b5cf6"}
    for item in dashboard_data[ano]["posicaoCallipers"]:
        posicao = str(item["Posicao"]).strip()
        item["color"] = cores_posicao.get(posicao, "#6b7280")

# Garantir que todos os arrays existam
for ano in ["todos", "2024", "2025"]:
    for key in ["substituicoesPorParque", "statusCallipers", "substituicoesPorMes", 
                "percentualTipoSubstituicao", "posicaoCallipers", "maquinasProblema"]:
        if key not in dashboard_data[ano]:
            dashboard_data[ano][key] = []

# Salvar JSON
output_dir = os.path.join(base_dir, "public")
os.makedirs(output_dir, exist_ok=True)
output_path = os.path.join(output_dir, "dashboard_data.json")

with open(output_path, "w", encoding="utf-8") as f:
    json.dump(dashboard_data, f, indent=4, ensure_ascii=False, default=str)

print(f"✅ Dados do dashboard atualizados e salvos em: {output_path}")
print(f"📊 RESUMO FINAL:")
print(f"   - Todos os anos: {dados_todos['totalTurbinas']} turbinas, {dados_todos['totalCallipers']} callipers")
print(f"   - Callipers substituídos: {dados_todos['callipersSubstituidos']}")
print(f"   - Turbinas by-pass: {dados_todos['turbinasByPass']}")
print(f"   - Turbinas sem vazamento: {dados_todos['turbinasSemVazamento']}")
print(f"   - Máquinas com problemas: {len(dados_todos['maquinasProblema'])}")
print(f"   - O-Rings substituídos: {dados_todos['percentualTipoSubstituicao'][0]['Quantidade']}")
print(f"   - Pastilhas substituídas: {dados_todos['percentualTipoSubstituicao'][1]['Quantidade']}")
print(f"   - Total intervenções: {dados_todos['percentualTipoSubstituicao'][0]['Quantidade'] + dados_todos['percentualTipoSubstituicao'][1]['Quantidade']}")