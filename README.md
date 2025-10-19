# 📊 Dashboard de Substituição de Callipers

Um dashboard interativo para monitoramento e análise de substituições de callipers em parques eólicos.

## 🚀 Funcionalidades

### 📈 Métricas Principais
- **Total de Turbinas** - Quantidade total de turbinas no complexo eólico
- **Total de Callipers** - Inventário completo de callipers
- **Vedações Substituídas** - Volume de intervenções realizadas
- **Turbinas com By-Pass** - Identificação de equipamentos críticos
- **Turbinas com Vedação Original** - Pendências de manutenção

### 📊 Gráficos e Visualizações
- **Status dos Callipers** - Distribuição por condição atual
- **Distribuição por Posição** - Quantidade de substituições por posição
- **Evolução Mensal** - Volume de substituições ao longo do tempo
- **Tipo de Substituição** - Distribuição entre O-Ring e Pastilhas
- **Substituições por Parque** - Performance por parque eólico

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React.js, TypeScript, Tailwind CSS
- **Gráficos**: Recharts
- **Processamento**: Python, Pandas
- **Dados**: Excel/CSV

## 📁 Estrutura do Projeto

```
dashboard-substituicao-calliper/
├── public/
│   └── dashboard_data.json
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx
│   │   └── ui/
│   └── types/
├── calculate_metrics.py
└── Analise-de-substituicao-de-calliper.xlsx
```

## ⚙️ Instalação e Configuração

### Pré-requisitos
- Node.js 16+
- Python 3.8+
- Pandas

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd dashboard-substituicao-calliper
```

### 2. Instale as dependências do frontend
```bash
npm install
```

### 3. Instale as dependências do Python
```bash
pip install pandas openpyxl
```

### 4. Prepare os dados
Coloque o arquivo Excel na raiz do projeto:
- `Analise-de-substituicao-de-calliper.xlsx`

### 5. Processe os dados
```bash
python calculate_metrics.py
```

### 6. Execute o dashboard
```bash
npm run dev
```

## 📋 Estrutura dos Dados

O arquivo Excel deve conter:

| Coluna | Descrição | Tipo |
|--------|------------|------|
| PARQUE | Nome do parque eólico | Texto |
| ANO DE SUBSTITUICAO | Data da substituição | Data |
| WTG | Identificação da turbina | Texto |
| POSSICAO DO CALLIPER | Posição do calliper (1-5) | Texto |
| SUBSTITUICAO DO ORING | Data substituição O-Ring | Data |
| SUBSTITUICAO DAS PASTILHA | Data substituição pastilhas | Data |
| CONDICAO CALLIPER | Condição atual | Texto |
| STATUS | Status do calliper | Texto |
| TECNICO | Técnico responsável | Texto |

## 🎨 Personalização

### Cores dos Cards
- `info` - Azul
- `success` - Verde  
- `alert` - Vermelho/Laranja
- `orange` - Laranja
- `purple` - Roxo

### Cores dos Gráficos
- **By-passado**: 🔴 Vermelho
- **Sem vazamento**: ⚫ Cinza  
- **Reparos substituídos**: 🟢 Verde
- **O-Ring**: 🔵 Azul
- **Pastilhas**: 🟠 Laranja

## 🔄 Processamento de Dados

### Critérios de Cálculo
- **Callipers substituídos**: Registros com data de O-Ring OU Pastilha
- **Turbinas com by-pass**: Status contendo "by-pass" ou "bypass"
- **Substituições mensais**: Inclui reincidências
- **Filtros**: Remove registros com WTG ou posição inválidos

### Script de Processamento
O `calculate_metrics.py` realiza:
1. Limpeza e validação dos dados
2. Cálculo de métricas agregadas
3. Geração do JSON para o dashboard
4. Tratamento de reincidências

## 📈 Interpretação dos Dados

### Métricas Chave
- **Eficiência de Manutenção**: Callipers substituídos vs. total
- **Criticalidade**: Turbinas em by-pass
- **Backlog**: Turbinas com vedações originais
- **Tendência**: Evolução mensal das substituições

## 🐛 Solução de Problemas

### Dados Não Carregam
- Verifique se o arquivo Excel está na raiz
- Execute `python calculate_metrics.py` para regenerar

### Gráficos Não Renderizam
- Verifique o console do navegador
- Confirme se o `dashboard_data.json` foi gerado

### Valores Inconsistentes
- Revise a estrutura do arquivo Excel
- Verifique os critérios de filtro no script

## 👥 Autores

- **Seu Nome** - *Deivid Marcio*

---

**⚠️ Nota**: Este dashboard é uma ferramenta de apoio à decisão. Sempre valide os insights com a equipe técnica.
