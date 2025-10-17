# Dashboard de Manutenção de Aerogeradores

Este projeto contém um dashboard interativo para análise de dados de manutenção de aerogeradores, desenvolvido com React e tecnologias modernas.

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou pnpm (recomendado)

## 🚀 Como executar localmente

### 1. Descompactar o arquivo
Extraia o conteúdo do arquivo `dashboard-manutencao-fixed.zip` em um diretório de sua preferência.

### 2. Navegar até o diretório
```bash
cd dashboard-manutencao
```

### 3. Instalar dependências
```bash
# Usando pnpm (recomendado)
pnpm install

# Ou usando npm
npm install
```

### 4. Executar o servidor de desenvolvimento
```bash
# Usando pnpm
pnpm run dev

# Ou usando npm
npm run dev
```

### 5. Acessar o dashboard
Abra seu navegador e acesse: `http://localhost:5173`

## 📊 Funcionalidades do Dashboard

- **Cards de Métricas**: Total de Callipers e Intervenções (2014-2025)
- **Gráficos Interativos**:
  - Intervenções por Mês
  - Mix de Intervenções por Parque (O-ring, Pastilhas, Ambos)
  - Faixa de Idade da Vedação/Pastilha
  - Qualidade dos Registros (gráfico de pizza com legenda)
  - Performance por Técnico
  - Evolução Anual das Intervenções (com legenda)

## 🔧 Processamento de Dados

O arquivo `calculate_metrics.py` processa os dados do Excel e gera o arquivo JSON usado pelo dashboard:

```bash
python3 calculate_metrics.py
```

Este script:
- Carrega dados do arquivo Excel
- Processa e limpa os dados
- Calcula métricas de confiabilidade
- Gera o arquivo `dashboard_data.json`

## 📁 Estrutura do Projeto

```
dashboard-manutencao/
├── src/
│   ├── App.jsx              # Componente principal
│   ├── assets/
│   │   └── dashboard_data.json  # Dados processados
│   └── components/ui/       # Componentes UI (shadcn/ui)
├── calculate_metrics.py     # Script de processamento
└── package.json            # Dependências do projeto
```

## 🛠️ Tecnologias Utilizadas

- **React 18** - Framework frontend
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI
- **Recharts** - Gráficos interativos
- **Lucide React** - Ícones
- **Python/Pandas** - Processamento de dados

## 📈 Dados Analisados

O dashboard analisa dados de manutenção incluindo:
- Substituição de O-rings
- Substituição de Pastilhas de Freio
- Performance por técnico
- Distribuição por parque
- Evolução temporal (2014-2025)

## 🔍 Solução de Problemas

### Dashboard não carrega
1. Verifique se o arquivo `dashboard_data.json` existe em `src/assets/`
2. Execute o script `calculate_metrics.py` para gerar os dados
3. Verifique o console do navegador (F12) para erros

### Erro ao instalar dependências
1. Certifique-se de ter Node.js 18+ instalado
2. Limpe o cache: `npm cache clean --force` ou `pnpm store prune`
3. Delete `node_modules` e reinstale

### Gráficos não aparecem
1. Verifique se os dados estão sendo carregados corretamente
2. Abra o console do navegador para verificar erros
3. Certifique-se de que o arquivo JSON está no formato correto

## 📞 Suporte

Se encontrar problemas, verifique:
1. Console do navegador (F12 → Console)
2. Terminal onde o servidor está rodando
3. Formato dos dados no arquivo JSON

---

**Desenvolvido com ❤️ para análise de manutenção de aerogeradores**
