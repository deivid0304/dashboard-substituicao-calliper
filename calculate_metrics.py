import pandas as pd
import numpy as np
from datetime import datetime
import json
import os
from typing import Dict, List, Any, Optional

class GerenciadorDadosCallipers:
    """
    Classe principal para gerenciar todo o processo de dados dos callipers
    """
    
    def __init__(self, excel_path: str):
        self.excel_path = excel_path
        self.df = None
        self.df_clean = None
        self.dashboard_data = {}
        self._carregar_dados()
    
    def _carregar_dados(self) -> None:
        """Carrega e prepara os dados do Excel"""
        try:
            self.df = pd.read_excel(self.excel_path)
            print("✅ Arquivo Excel carregado com sucesso!")
            print(f"📊 Colunas disponíveis: {list(self.df.columns)}")
            print(f"📋 Total de registros: {len(self.df)}")
            
            self._renomear_colunas()
            self._tratar_dados()
            
        except Exception as e:
            print(f"❌ Erro ao carregar arquivo Excel: {e}")
            raise
    
    def _renomear_colunas(self) -> None:
        """Renomeia colunas para padrão consistente"""
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
        
        self.df = self.df.rename(columns=column_mapping)
    
    def _tratar_dados(self) -> None:
        """Realiza tratamento e limpeza dos dados"""
        print("🔄 Tratando dados...")
        
        # Converter datas
        self.df["ANO_SUBSTITUICAO"] = pd.to_datetime(self.df["ANO_SUBSTITUICAO"], errors='coerce')
        self.df["SUBSTITUICAO_ORING"] = pd.to_datetime(self.df["SUBSTITUICAO_ORING"], errors='coerce')
        self.df["SUBSTITUICAO_PASTILHA"] = pd.to_datetime(self.df["SUBSTITUICAO_PASTILHA"], errors='coerce')
        
        # Criar cópia limpa
        self.df_clean = self.df.copy()
        
        # Identificar registros válidos
        condicoes_validas = (
            self.df_clean["WTG"].notna() & 
            (self.df_clean["WTG"] != "") & 
            self.df_clean["POSICAO_CALLIPER"].notna() & 
            (self.df_clean["POSICAO_CALLIPER"] != "")
        )
        
        # Aplicar filtro
        self.df_clean = self.df_clean[condicoes_validas]
        
        print(f"📊 Registros válidos encontrados: {len(self.df_clean)}")
        print(f"🗑️  Registros inválidos removidos: {len(self.df) - len(self.df_clean)}")
        
        # Preencher valores restantes
        self.df_clean["TECNICO"] = self.df_clean["TECNICO"].fillna("Não Informado").replace("-", "Não Informado")
        self.df_clean["PARQUE"] = self.df_clean["PARQUE"].fillna("Não Informado")
        self.df_clean["STATUS"] = self.df_clean["STATUS"].fillna("Não Informado")
        
        print(f"📊 Total de registros após limpeza: {len(self.df_clean)}")
    
    def gerar_dashboard_data(self) -> Dict[str, Any]:
        """Gera todos os dados para o dashboard"""
        print("📅 Calculando dados para todos os anos...")
        
        # Usar a função de compatibilidade para garantir o mesmo comportamento
        dados_todos = calcular_dados_por_ano(self.df_clean)
        
        print("📅 Calculando dados para 2024...")
        dados_2024 = calcular_dados_por_ano(self.df_clean, 2024)
        
        print("📅 Calculando dados para 2025...")
        dados_2025 = calcular_dados_por_ano(self.df_clean, 2025)
        
        # Obter anos disponíveis
        anos_validos = self.df_clean["ANO_SUBSTITUICAO"].dt.year.dropna().unique()
        anos_validos = [int(ano) for ano in anos_validos if not pd.isna(ano)]
        anos_validos.sort()
        
        print(f"📅 Anos disponíveis: {anos_validos}")
        
        # Estrutura principal - MESMA ESTRUTURA DO CÓDIGO ORIGINAL
        self.dashboard_data = {
            "todos": dados_todos,
            "2024": dados_2024,
            "2025": dados_2025,
            "anosDisponiveis": anos_validos,
            "parques": self.df_clean["PARQUE"].unique().tolist()
        }
        
        # Aplicar cores (MESMA LÓGICA DO CÓDIGO ORIGINAL)
        self._aplicar_cores()
        
        return self.dashboard_data
    
    def _aplicar_cores(self) -> None:
        """Aplica esquema de cores aos dados do dashboard"""
        print("🎨 Aplicando cores...")
        
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
            if self.dashboard_data[ano] and "statusCallipers" in self.dashboard_data[ano]:
                for item in self.dashboard_data[ano]["statusCallipers"]:
                    status_lower = item["Status"].lower().strip()
                    item["color"] = cores_status.get(status_lower, "#6b7280")
            
            if self.dashboard_data[ano] and "percentualTipoSubstituicao" in self.dashboard_data[ano]:
                for item in self.dashboard_data[ano]["percentualTipoSubstituicao"]:
                    if item["Tipo"] == "O-Ring":
                        item["color"] = "#3b82f6"
                    else:
                        item["color"] = "#f59e0b"
            
            if self.dashboard_data[ano] and "posicaoCallipers" in self.dashboard_data[ano]:
                cores_posicao = {"1": "#3b82f6", "2": "#22c55e", "3": "#f59e0b", "4": "#ef4444", "5": "#8b5cf6"}
                for item in self.dashboard_data[ano]["posicaoCallipers"]:
                    posicao = str(item["Posicao"]).strip()
                    item["color"] = cores_posicao.get(posicao, "#6b7280")
            
            # Garantir que todos os arrays existam (MESMA LÓGICA DO CÓDIGO ORIGINAL)
            if self.dashboard_data[ano] is None:
                self.dashboard_data[ano] = {}
            
            for key in ["substituicoesPorParque", "statusCallipers", "substituicoesPorMes", 
                        "percentualTipoSubstituicao", "posicaoCallipers", "maquinasProblema"]:
                if key not in self.dashboard_data[ano]:
                    self.dashboard_data[ano][key] = []
    
    def salvar_json(self, output_dir: str = None) -> str:
        """Salva os dados em arquivo JSON"""
        if output_dir is None:
            base_dir = os.path.dirname(self.excel_path)
            output_dir = os.path.join(base_dir, "public")
        
        os.makedirs(output_dir, exist_ok=True)
        output_path = os.path.join(output_dir, "dashboard_data.json")
        
        try:
            with open(output_path, "w", encoding="utf-8") as f:
                json.dump(self.dashboard_data, f, indent=4, ensure_ascii=False, default=str)
            
            print(f"✅ JSON gerado com sucesso em: {output_path}")
            self._imprimir_resumo()
            
            # Verificar se o arquivo foi criado
            if os.path.exists(output_path):
                file_size = os.path.getsize(output_path)
                print(f"📁 Tamanho do arquivo: {file_size} bytes")
            else:
                print("❌ Arquivo JSON não foi criado!")
                
            return output_path
            
        except Exception as e:
            print(f"❌ Erro ao salvar JSON: {e}")
            raise
    
    def _imprimir_resumo(self) -> None:
        """Imprime resumo dos dados gerados"""
        dados_todos = self.dashboard_data["todos"]
        print(f"📊 RESUMO FINAL:")
        print(f"   - Todos os anos: {dados_todos['totalTurbinas']} turbinas, {dados_todos['totalCallipers']} callipers")
        print(f"   - Callipers substituídos: {dados_todos['callipersSubstituidos']}")
        print(f"   - Callipers by-pass: {dados_todos['callipersByPass']}")
        print(f"   - Callipers sem vazamento: {dados_todos['callipersSemVazamento']}")


# --- FUNÇÃO ORIGINAL MODIFICADA PARA CALCULAR CALLIPERS ---
def calcular_dados_por_ano(df, ano=None):
    """
    FUNÇÃO MODIFICADA - Agora calcula quantidade de CALLIPERS (não turbinas) para by-pass e sem vazamento
    """
    try:
        if ano:
            dados_ano = df[df["ANO_SUBSTITUICAO"].dt.year == ano]
            print(f"📊 Processando {len(dados_ano)} registros para ano: {ano}")
        else:
            dados_ano = df
            print(f"📊 Processando {len(dados_ano)} registros para todos os anos")
        
        if len(dados_ano) == 0:
            print(f"⚠️  Nenhum dado encontrado para ano: {ano}")
            return {
                "totalTurbinas": 0,
                "totalCallipers": 0,
                "callipersByPass": 0,  # AGORA: quantidade de callipers
                "callipersSemVazamento": 0,  # AGORA: quantidade de callipers
                "callipersSubstituidos": 0,
                "substituicoesPorParque": [],
                "statusCallipers": [],
                "substituicoesPorMes": [],
                "percentualTipoSubstituicao": [],
                "posicaoCallipers": [],
                "maquinasProblema": []
            }
        
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
        
        # Métricas principais
        total_turbinas = dados_ano["WTG"].nunique()
        total_callipers = len(dados_ano)
        
        # 🔥 CORREÇÃO: CALLIPERS BY-PASS (quantidade de callipers, não turbinas)
        callipers_bypass = dados_ano[dados_ano["STATUS"].str.lower().str.contains('by.pass|bypass', na=False, regex=True)]
        qtd_callipers_bypass = len(callipers_bypass)  # AGORA: quantidade de callipers
        
        # 🔥 CORREÇÃO: CALLIPERS SEM VAZAMENTO (quantidade de callipers, não turbinas)
        callipers_sem_vazamento = dados_ano[dados_ano["STATUS"].str.lower().str.contains('sem vazamento|pendente', na=False, regex=True)]
        qtd_callipers_sem_vazamento = len(callipers_sem_vazamento)  # AGORA: quantidade de callipers
        
        print(f"🔴 Callipers com by-pass: {qtd_callipers_bypass}")
        print(f"🟢 Callipers sem vazamento: {qtd_callipers_sem_vazamento}")
        
        # SUBSTITUIÇÕES POR PARQUE
        substituicoes_por_parque = substituicoes_reais.groupby("PARQUE").size().reset_index(name="Total_Substituicoes")
        print(f"🏭 Substituições por parque: {len(substituicoes_por_parque)}")
        
        # Status dos callipers
        status_counts = dados_ano["STATUS"].value_counts().reset_index()
        status_counts.columns = ["Status", "Quantidade"]
        
        # 🔥 CORREÇÃO: SUBSTITUIÇÕES POR MÊS - CONTAGEM CORRETA
        print("📈 Calculando substituições por mês...")
        
        # Criar lista para armazenar todas as substituições
        todas_substituicoes = []
        
        for _, row in substituicoes_reais.iterrows():
            # Cada calliper substituído conta como 1, independente do tipo de peça
            if pd.notna(row["ANO_SUBSTITUICAO"]):
                mes_ano = row["ANO_SUBSTITUICAO"].to_period("M")
                todas_substituicoes.append({
                    "Mes_Ano": str(mes_ano),
                    "Calliper": f"{row['WTG']}-{row['POSICAO_CALLIPER']}",
                    "Data": row["ANO_SUBSTITUICAO"]
                })
        
        # Agrupar por mês e contar callipers únicos
        if todas_substituicoes:
            df_substituicoes = pd.DataFrame(todas_substituicoes)
            substituicoes_por_mes = df_substituicoes.groupby("Mes_Ano").size().reset_index(name="Total_Substituicoes")
            substituicoes_por_mes = substituicoes_por_mes.sort_values("Mes_Ano")
            print(f"📅 Substituições por mês encontradas: {len(substituicoes_por_mes)}")
        else:
            substituicoes_por_mes = pd.DataFrame(columns=["Mes_Ano", "Total_Substituicoes"])
            print("📅 Nenhuma substituição por mês encontrada")
        
        # TIPO DE SUBSTITUIÇÃO
        oring_count = substituicoes_reais["SUBSTITUICAO_ORING"].notna().sum()
        pastilha_count = substituicoes_reais["SUBSTITUICAO_PASTILHA"].notna().sum()
        total_substituicoes = oring_count + pastilha_count
        
        percentual_oring = (oring_count / total_substituicoes) * 100 if total_substituicoes > 0 else 0
        percentual_pastilha = (pastilha_count / total_substituicoes) * 100 if total_substituicoes > 0 else 0
        
        percentual_tipo = pd.DataFrame({
            "Tipo": ["O-Ring", "Pastilhas"],
            "Percentual": [percentual_oring, percentual_pastilha],
            "Quantidade": [oring_count, pastilha_count]
        })
        
        # Posição dos callipers
        posicao_counts = substituicoes_reais["POSICAO_CALLIPER"].value_counts().reset_index()
        posicao_counts.columns = ["Posicao", "Quantidade"]
         
        # MÁQUINAS COM PROBLEMAS
        maquinas_problema = dados_ano[
            dados_ano["STATUS"].str.lower().str.contains('by.pass|bypass|sem vazamento|pendente', na=False, regex=True)
        ]
        
        print(f"🔍 Encontradas {len(maquinas_problema)} máquinas com problemas")
        
        # Preparar dados para relatório
        maquinas_problema_list = []
        for _, row in maquinas_problema.iterrows():
            wtg = row["WTG"]
            parque = row["PARQUE"]
            posicao = row["POSICAO_CALLIPER"]
            status = row["STATUS"]
            data_substituicao = row["ANO_SUBSTITUICAO"]
            
            maquinas_problema_list.append({
                "WTG": str(wtg),
                "PARQUE": str(parque),
                "POSICAO_CALLIPER": str(posicao),
                "STATUS": str(status),
                "ANO_SUBSTITUICAO": data_substituicao.strftime('%Y-%m-%d') if pd.notna(data_substituicao) else "Aguardando Programação"
            })
        
        # Calcular callipers substituídos
        callipers_substituidos = len(substituicoes_reais)
        
        # 🔥 DEBUG: Verificar dados de substituições por mês
        print(f"🔍 DEBUG - Substituições por mês:")
        for _, mes in substituicoes_por_mes.iterrows():
            print(f"   - {mes['Mes_Ano']}: {mes['Total_Substituicoes']} callipers")
        
        return {
            "totalTurbinas": total_turbinas,
            "totalCallipers": total_callipers,
            "callipersByPass": qtd_callipers_bypass,  # AGORA: quantidade de callipers
            "callipersSemVazamento": qtd_callipers_sem_vazamento,  # AGORA: quantidade de callipers
            "callipersSubstituidos": callipers_substituidos,
            "substituicoesPorParque": substituicoes_por_parque.to_dict(orient="records"),
            "statusCallipers": status_counts.to_dict(orient="records"),
            "substituicoesPorMes": substituicoes_por_mes.to_dict(orient="records"),
            "percentualTipoSubstituicao": percentual_tipo.to_dict(orient="records"),
            "posicaoCallipers": posicao_counts.to_dict(orient="records"),
            "maquinasProblema": maquinas_problema_list
        }
    
    except Exception as e:
        print(f"❌ Erro ao calcular dados para ano {ano}: {e}")
        import traceback
        traceback.print_exc()
        return {
            "totalTurbinas": 0,
            "totalCallipers": 0,
            "callipersByPass": 0,  # AGORA: quantidade de callipers
            "callipersSemVazamento": 0,  # AGORA: quantidade de callipers
            "callipersSubstituidos": 0,
            "substituicoesPorParque": [],
            "statusCallipers": [],
            "substituicoesPorMes": [],
            "percentualTipoSubstituicao": [],
            "posicaoCallipers": [],
            "maquinasProblema": []
        }


# --- EXECUÇÃO PRINCIPAL GARANTIDA ---
def main():
    """Função principal que garante a geração do JSON"""
    base_dir = os.path.dirname(os.path.abspath(__file__))
    excel_path = os.path.join(base_dir, "Analise-de-substituicao-de-calliper.xlsx")
    
    print("🚀 INICIANDO PROCESSAMENTO DE DADOS")
    print(f"📍 Caminho do arquivo: {excel_path}")
    
    try:
        # Verificar se arquivo existe
        if not os.path.exists(excel_path):
            print(f"❌ Arquivo não encontrado: {excel_path}")
            return
        
        # Usar o gerenciador encapsulado
        gerenciador = GerenciadorDadosCallipers(excel_path)
        
        print("\n📊 GERANDO DADOS DO DASHBOARD...")
        dashboard_data = gerenciador.gerar_dashboard_data()
        
        print("\n💾 SALVANDO ARQUIVO JSON...")
        output_path = gerenciador.salvar_json()
        
        print(f"\n🎉 PROCESSO CONCLUÍDO COM SUCESSO!")
        print(f"📁 JSON gerado em: {output_path}")
        
        return dashboard_data
        
    except Exception as e:
        print(f"❌ Erro no processo principal: {e}")
        import traceback
        traceback.print_exc()
        return {}


if __name__ == "__main__":
    # Executar a versão nova encapsulada
    main()