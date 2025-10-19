import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LabelList, Legend, LineChart, Line, Area, AreaChart, ReferenceLine } from 'recharts';
import {
  Wind,
  Settings,
  AlertCircle,
  CheckCircle,
  Filter,
  Download,
  RefreshCw,
  Wrench,
  Calendar,
  FileText,
  BarChart3,
  TrendingUp,
  Users,
  Zap,
  Grid3X3
} from 'lucide-react';
import './App.css';

function App() {
  const [dashboardData, setDashboardData] = useState(null);
  const [anoFiltro, setAnoFiltro] = useState('todos');
  const [dadosFiltrados, setDadosFiltrados] = useState(null);
  const [abaAtiva, setAbaAtiva] = useState('analise');
  const [hoverValue, setHoverValue] = useState(null);

  useEffect(() => {
    fetch('/dashboard_data.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("✅ Dados carregados:", data);
        setDashboardData(data);
        setDadosFiltrados(data.todos);
      })
      .catch(error => console.error('❌ Erro ao buscar dashboard data:', error));
  }, []);

  useEffect(() => {
    if (dashboardData) {
      setDadosFiltrados(dashboardData[anoFiltro]);
    }
  }, [anoFiltro, dashboardData]);

  // Função para calcular cor baseada na quantidade (0-47)
  const calcularCorHex = (quantidade, max = 47) => {
    const ratio = quantidade / max;

    const red = Math.floor(255 * (1 - ratio));
    const green = Math.floor(255 * ratio);
    const blue = 50;

    return `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`;
  };

  const handleFiltrar = (ano) => {
    setAnoFiltro(ano);
  };

  const handleExportar = () => {
    console.log("Exportando dados...");
  };

  const handleAtualizar = () => {
    window.location.reload();
  };

  // Adicione estas variantes no seu MetricCard:
  const MetricCard = ({ title, value, subtitle, icon: Icon, color = "blue", variant = "default", trend }) => (
    <Card className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50/80 border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className={`absolute inset-0 bg-gradient-to-br opacity-5 
      ${variant === 'alert' ? 'from-red-500 to-orange-500' :
          variant === 'success' ? 'from-green-500 to-emerald-500' :
            variant === 'info' ? 'from-blue-500 to-cyan-500' :
              variant === 'orange' ? 'from-orange-500 to-amber-500' :
                variant === 'purple' ? 'from-purple-500 to-violet-500' :
                  variant === 'pink' ? 'from-pink-500 to-rose-500' :
                    variant === 'yellow' ? 'from-yellow-500 to-amber-500' :
                      variant === 'indigo' ? 'from-indigo-500 to-purple-500' :
                        variant === 'teal' ? 'from-teal-500 to-cyan-500' :
                          variant === 'lime' ? 'from-lime-500 to-green-500' :
                            variant === 'fuchsia' ? 'from-fuchsia-500 to-pink-500' :
                              variant === 'rose' ? 'from-rose-500 to-pink-500' :
                                variant === 'sky' ? 'from-sky-500 to-blue-500' :
                                  variant === 'emerald' ? 'from-emerald-500 to-green-500' :
                                    'from-blue-500 to-purple-500'
        }`} />

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className={`text-sm font-semibold 
        ${variant === 'alert' ? 'text-red-600' :
            variant === 'success' ? 'text-green-600' :
              variant === 'info' ? 'text-blue-600' :
                variant === 'orange' ? 'text-orange-600' :
                  variant === 'purple' ? 'text-purple-600' :
                    variant === 'pink' ? 'text-pink-600' :
                      variant === 'yellow' ? 'text-yellow-600' :
                        variant === 'indigo' ? 'text-indigo-600' :
                          variant === 'teal' ? 'text-teal-600' :
                            variant === 'lime' ? 'text-lime-600' :
                              variant === 'fuchsia' ? 'text-fuchsia-600' :
                                variant === 'rose' ? 'text-rose-600' :
                                  variant === 'sky' ? 'text-sky-600' :
                                    variant === 'emerald' ? 'text-emerald-600' :
                                      'text-gray-600'
          }`}>
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg 
        ${variant === 'alert' ? 'bg-red-100 text-red-600' :
            variant === 'success' ? 'bg-green-100 text-green-600' :
              variant === 'info' ? 'bg-blue-100 text-blue-600' :
                variant === 'orange' ? 'bg-orange-100 text-orange-600' :
                  variant === 'purple' ? 'bg-purple-100 text-purple-600' :
                    variant === 'pink' ? 'bg-pink-100 text-pink-600' :
                      variant === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                        variant === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
                          variant === 'teal' ? 'bg-teal-100 text-teal-600' :
                            variant === 'lime' ? 'bg-lime-100 text-lime-600' :
                              variant === 'fuchsia' ? 'bg-fuchsia-100 text-fuchsia-600' :
                                variant === 'rose' ? 'bg-rose-100 text-rose-600' :
                                  variant === 'sky' ? 'bg-sky-100 text-sky-600' :
                                    variant === 'emerald' ? 'bg-emerald-100 text-emerald-600' :
                                      'bg-blue-100 text-blue-600'
          } group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>

      <CardContent>
        <div className={`text-3xl font-bold mb-1 
        ${variant === 'alert' ? 'text-red-600' :
            variant === 'success' ? 'text-green-600' :
              variant === 'info' ? 'text-blue-600' :
                variant === 'orange' ? 'text-orange-600' :
                  variant === 'purple' ? 'text-purple-600' :
                    variant === 'pink' ? 'text-pink-600' :
                      variant === 'yellow' ? 'text-yellow-600' :
                        variant === 'indigo' ? 'text-indigo-600' :
                          variant === 'teal' ? 'text-teal-600' :
                            variant === 'lime' ? 'text-lime-600' :
                              variant === 'fuchsia' ? 'text-fuchsia-600' :
                                variant === 'rose' ? 'text-rose-600' :
                                  variant === 'sky' ? 'text-sky-600' :
                                    variant === 'emerald' ? 'text-emerald-600' :
                                      'text-gray-900'
          }`}>
          {value || 0}
        </div>
        <p className={`text-xs font-medium 
        ${variant === 'alert' ? 'text-red-500' :
            variant === 'success' ? 'text-green-500' :
              variant === 'info' ? 'text-blue-500' :
                variant === 'orange' ? 'text-orange-500' :
                  variant === 'purple' ? 'text-purple-500' :
                    variant === 'pink' ? 'text-pink-500' :
                      variant === 'yellow' ? 'text-yellow-500' :
                        variant === 'indigo' ? 'text-indigo-500' :
                          variant === 'teal' ? 'text-teal-500' :
                            variant === 'lime' ? 'text-lime-500' :
                              variant === 'fuchsia' ? 'text-fuchsia-500' :
                                variant === 'rose' ? 'text-rose-500' :
                                  variant === 'sky' ? 'text-sky-500' :
                                    variant === 'emerald' ? 'text-emerald-500' :
                                      'text-gray-500'
          }`}>
          {subtitle}
        </p>
        {trend && (
          <div className={`flex items-center gap-1 mt-2 text-xs ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className={`h-3 w-3 ${trend > 0 ? '' : 'rotate-180'}`} />
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 border border-gray-200 rounded-xl shadow-xl">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">{entry.name}:</span>
              <span className="font-semibold text-gray-900">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Tooltip customizado para posições com gradiente
  const CustomTooltipPosicoes = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const quantidade = payload[0].value;
      const percentual = ((quantidade / 47) * 100).toFixed(1);
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 border border-gray-200 rounded-xl shadow-xl">
          <p className="font-semibold text-gray-900 mb-2">Posição {label}</p>
          <div className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: calcularCorHex(quantidade) }}
            />
            <span className="text-gray-600">Quantidade:</span>
            <span className="font-semibold text-gray-900">{quantidade}</span>
          </div>
          <div className="flex items-center gap-2 text-sm mt-1">
            <span className="text-gray-600">Percentual:</span>
            <span className="font-semibold text-gray-900">{percentual}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: `${percentual}%`,
                backgroundColor: calcularCorHex(quantidade)
              }}
            />
          </div>
        </div>
      );
    }
    return null;
  };

  // Funções auxiliares para dados seguros
  const getSafeArray = (array) => Array.isArray(array) ? array : [];
  const getSafeNumber = (value) => value || 0;

  // Estado de loading
  if (!dashboardData || !dadosFiltrados) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <Zap className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Carregando Dashboard</h3>
          <p className="text-gray-600 text-sm">Analisando dados de callipers...</p>
        </div>
      </div>
    );
  }

  // Dados seguros para renderização
  const safeSubstituicoesPorParque = getSafeArray(dadosFiltrados.substituicoesPorParque);
  const safeStatusCallipers = getSafeArray(dadosFiltrados.statusCallipers);
  const safeSubstituicoesPorMes = getSafeArray(dadosFiltrados.substituicoesPorMes);
  const safePercentualTipoSubstituicao = getSafeArray(dadosFiltrados.percentualTipoSubstituicao);
  const safePosicaoCallipers = getSafeArray(dadosFiltrados.posicaoCallipers);
  const safeMaquinasProblema = getSafeArray(dadosFiltrados.maquinasProblema);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Monitoramento Callipers
                </h1>
                <p className="text-gray-600 text-sm">Complexo Eólico Santo Inácio • 2024-2025</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-white/60 backdrop-blur-sm border-gray-300/60 hover:bg-white"
                onClick={handleExportar}
              >
                <Download className="h-4 w-4" />
                Exportar
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-white/60 backdrop-blur-sm border-gray-300/60 hover:bg-white"
              >
                <Filter className="h-4 w-4" />
                Filtrar
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-white/60 backdrop-blur-sm border-gray-300/60 hover:bg-white"
                onClick={handleAtualizar}
              >
                <RefreshCw className="h-4 w-4" />
                Atualizar
              </Button>
            </div>
          </div>

          {/* Filtros de Ano */}
          <div className="flex flex-wrap gap-2 mt-6">
            <Badge
              variant={anoFiltro === 'todos' ? "default" : "outline"}
              className={`cursor-pointer px-4 py-2 text-sm font-medium transition-all ${anoFiltro === 'todos'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-white/60 text-gray-700 hover:bg-white border-gray-300/60'
                }`}
              onClick={() => handleFiltrar('todos')}
            >
              Todos os Anos
            </Badge>
            <Badge
              variant={anoFiltro === '2024' ? "default" : "outline"}
              className={`cursor-pointer px-4 py-2 text-sm font-medium transition-all ${anoFiltro === '2024'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-white/60 text-gray-700 hover:bg-white border-gray-300/60'
                }`}
              onClick={() => handleFiltrar('2024')}
            >
              2024
            </Badge>
            <Badge
              variant={anoFiltro === '2025' ? "default" : "outline"}
              className={`cursor-pointer px-4 py-2 text-sm font-medium transition-all ${anoFiltro === '2025'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-white/60 text-gray-700 hover:bg-white border-gray-300/60'
                }`}
              onClick={() => handleFiltrar('2025')}
            >
              2025
            </Badge>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="container mx-auto px-6 py-8">
        {/* Grid de Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <MetricCard
            title="Total Turbinas"
            value={getSafeNumber(dadosFiltrados.totalTurbinas)}
            subtitle="Complexo eólico"
            icon={Wind}
            variant="info" // Azul
          />
          <MetricCard
            title="Total de Callipers"
            value={getSafeNumber(dadosFiltrados.totalCallipers)}
            subtitle="Qtd. de Callipers"
            icon={Settings}
            variant="sky" // Verde
          />
          <MetricCard
            title="Vedações Substituidas"
            value={getSafeNumber(dadosFiltrados.callipersSubstituidos)}
            subtitle="Qtd. de Substituições"
            icon={Wrench}
            variant="emerald" // Azul (ou crie uma nova variante)
          />
          <MetricCard
            title="Callipers com By-Pass"
            value={getSafeNumber(dadosFiltrados.callipersByPass)}
            subtitle="Com vazamento"
            icon={AlertCircle}
            variant="alert" // Vermelho
          />
          <MetricCard
            title="Callipers com vedações originais"
            value={getSafeNumber(dadosFiltrados.callipersSemVazamento)}
            subtitle="Pendente substituição"
            icon={CheckCircle}
            variant="yellow" // Verde
          />
        </div>

        {/* Abas do Dashboard */}
        <Tabs value={abaAtiva} onValueChange={setAbaAtiva} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/60 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-1">
            <TabsTrigger
              value="analise"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-xl transition-all"
            >
              <BarChart3 className="h-4 w-4" />
              Análise Geral
            </TabsTrigger>
            <TabsTrigger
              value="posicoes"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-xl transition-all"
            >
              <Grid3X3 className="h-4 w-4" />
              Posições - Callipers
            </TabsTrigger>
            <TabsTrigger
              value="evolucao"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-xl transition-all"
            >
              <TrendingUp className="h-4 w-4" />
              Evolução Temporal
            </TabsTrigger>
            <TabsTrigger
              value="relatorios"
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-xl transition-all"
            >
              <FileText className="h-4 w-4" />
              Relatórios
            </TabsTrigger>
          </TabsList>

          {/* Aba 1: Análise Geral */}
          <TabsContent value="analise" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Substituições por Parque */}
              <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Substituições por Parque
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Quantidade de callipers substituídos por parque
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={safeSubstituicoesPorParque} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis
                        dataKey="PARQUE"
                        tick={{ fontSize: 14 }}
                        angle={-23}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        dataKey="Total_Substituicoes"
                        fill="url(#colorGradient)"
                        radius={[6, 6, 0, 0]}
                      >
                        <LabelList
                          dataKey="Total_Substituicoes"
                          position="top"
                          style={{ fontSize: '12px', fontWeight: '600', fill: '#374151' }}
                        />
                      </Bar>
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#17934bff" stopOpacity={0.8} />
                          <stop offset="100%" stopColor="#93d81dff" stopOpacity={0.8} />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Status dos Callipers */}
              <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    Status dos Callipers
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Distribuição por condição atual
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={safeStatusCallipers}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ Status, Quantidade, percent }) => {
                          const displayStatus = Status === "Reparos substituidos"
                            ? "Reparos\nsubstituidos"
                            : Status;
                          return `${displayStatus}: (${(percent * 100).toFixed(1)}%)`;
                        }}
                        outerRadius={100}
                        innerRadius={60}
                        fill="#8884d8"
                        dataKey="Quantidade"
                        nameKey="Status"
                      >
                        {safeStatusCallipers.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              entry.Status === "By-passada" ? "#ff0000" :
                                entry.Status === "Sem vazamento" ? "#e4d076ff" :
                                  entry.Status === "Reparos substituidos" ? "#28c55cff" :
                                    '#806d6bff'
                            }
                            stroke={entry.Status === "by-passado" ? "#dc2626" : undefined}
                            strokeWidth={entry.Status === "By-passada" ? 2 : 1}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend
                        formatter={(value, entry) => (
                          <span style={{
                            color: value === "by-passado" ? "#dc2626" : "#333",
                            fontWeight: value === "by-passado" ? "bold" : "normal"
                          }}>
                            {value}
                          </span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Aba 2: Posições dos Callipers */}
          <TabsContent value="posicoes" className="space-y-6">
            {/* Gráfico de Barras com Gradiente */}
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Grid3X3 className="h-5 w-5 text-green-600" />
                  Distribuição - Posição x Turbina
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Quantidade de callipers substituídos por posição (Total geral 47 Turbinas)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={500}>
                  <BarChart
                    data={[...safePosicaoCallipers].sort((a, b) => {
                      // Extrai o número do calliper para ordenação numérica
                      const numA = parseInt(a.Posicao.replace('Calliper ', ''));
                      const numB = parseInt(b.Posicao.replace('Calliper ', ''));
                      return numA - numB;
                    })}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis
                      dataKey="Posicao"
                      tick={{ fontSize: 16, fontWeight: '600' }}
                    />
                    <YAxis
                      tick={{ fontSize: 14 }}
                      label={{ value: 'Quantidade', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip content={<CustomTooltipPosicoes />} />
                    <Bar dataKey="Quantidade" radius={[6, 6, 0, 0]} barSize={50}>
                      <LabelList
                        dataKey="Quantidade"
                        position="top"
                        style={{ fontSize: '16px', fontWeight: '700', fill: '#320f0fff' }}
                      />
                      {[...safePosicaoCallipers]
                        .sort((a, b) => {
                          const numA = parseInt(a.Posicao.replace('Calliper ', ''));
                          const numB = parseInt(b.Posicao.replace('Calliper ', ''));
                          return numA - numB;
                        })
                        .map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill="#1fac2dff"
                            stroke="#1184cbff"
                            strokeWidth={0}
                          />
                        ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba 3: Evolução Temporal */}
          <TabsContent value="evolucao" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Evolução Mensal */}
              <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Evolução Mensal
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Qtd. de Substituições por Mês
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart
                      data={safeSubstituicoesPorMes}
                      margin={{ top: 50, right: 30, left: 20, bottom: 40 }}
                    >
                      <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4dc516ff" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#476badff" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis
                        dataKey="Mes_Ano"
                        tick={{ fontSize: 12, angle: -45, textAnchor: "end" }}
                        interval={0}
                        height={60}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="Total_Substituicoes"
                        stroke="#d7cdc1ff"
                        fill="url(#colorUv)"
                        strokeWidth={3}
                        dot={{
                          fill: '#3b82f6',
                          strokeWidth: 2,
                          r: 4
                        }}
                        activeDot={{ r: 6, fill: '#1d4ed8' }}
                      >
                        <LabelList
                          dataKey="Total_Substituicoes"
                          position="top"
                          offset={15}
                          fill="#000000"
                          style={{
                            fontSize: '12px',
                            fontWeight: 'bold',
                            textShadow: '0px 0px 3px white'
                          }}
                        />
                      </Area>
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Tipo de Substituição */}
              <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-orange-600" />
                    Tipo de Substituição
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Distribuição entre O-Ring e Pastilhas
                    <br />
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={safePercentualTipoSubstituicao} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis dataKey="Tipo" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(value, name) => {
                        if (name === 'Percentual') return [`${value}%`, 'Percentual'];
                        return [value, 'Quantidade'];
                      }} />
                      <Bar dataKey="Quantidade" radius={[6, 6, 0, 0]}>
                        <LabelList
                          dataKey="Quantidade"
                          position="top"
                          formatter={(value, entry) => {
                            // Calcular porcentagem baseada no total de 235 callipers
                            const percentual = ((value / 235) * 100).toFixed(1);
                            return `${value} (${percentual}%)`;
                          }}
                          style={{ fontSize: '12px', fontWeight: '600', fill: '#374151' }}
                        />
                        {safePercentualTipoSubstituicao.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.Tipo === "O-Ring" ? "#3bf6e6ff" : "#a262acff"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Aba 4: Relatórios */}
          <TabsContent value="relatorios" className="space-y-6">
            {/* Cards Superiores - Resumo e Ações */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Resumo por Status
                  </CardTitle>
                  <CardDescription>Distribuição detalhada dos callipers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {safeStatusCallipers.map((status, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor:
                                status.Status === "By-passada" ? "#ff0000" :
                                  status.Status === "Sem vazamento" ? "#e1cf49ff" :
                                    status.Status === "Reparos substituidos" ? "#24c324ff" :
                                      status.color || '#6b7280'
                            }}
                          />
                          <span className="text-sm font-medium text-gray-700">{status.Status}</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900">{status.Quantidade}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    Ações Recomendadas
                  </CardTitle>
                  <CardDescription>Prioridades de manutenção</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getSafeNumber(dadosFiltrados.callipersSubstituidos) > 0 && (
                      <div className="flex items-start gap-3 p-3 bg-green-50/50 border border-green-200 rounded-lg">
                        <Wrench className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-green-800">
                            {getSafeNumber(dadosFiltrados.callipersSubstituidos)} Vedações substituídas
                          </p>
                          <p className="text-xs text-green-600 mt-1">Manutenção concluída</p>
                        </div>
                      </div>
                    )}
                    {getSafeNumber(dadosFiltrados.callipersSemVazamento) > 0 && (
                      <div className="flex items-start gap-3 p-3 bg-yellow-50/50 border border-yellow-200 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-yellow-800">
                            {getSafeNumber(dadosFiltrados.callipersSemVazamento)} Callipers sem vazamento
                          </p>
                          <p className="text-xs text-yellow-600 mt-1">Aguardando programação de substituição</p>
                        </div>
                      </div>
                    )}
                    {getSafeNumber(dadosFiltrados.callipersByPass) > 0 && (
                      <div className="flex items-start gap-3 p-3 bg-red-50/50 border border-red-200 rounded-lg">
                        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-red-800">
                            {getSafeNumber(dadosFiltrados.callipersByPass)} Callipers by-passados
                          </p>
                          <p className="text-xs text-red-600 mt-1">Intervenção urgente necessária</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Card Inferior - Máquinas com Problemas (largura dupla) */}
            <div className="grid grid-cols-1 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    Relação de Máquinas Pendentes de Substituição.
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Lista de turbinas com callipers by-passados e Pendentes de substituição.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto rounded-lg border border-gray-200/60">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200/60">
                          <th className="text-left p-4 font-semibold text-gray-700">Máquina (WTG)</th>
                          <th className="text-left p-4 font-semibold text-gray-700">Parque</th>
                          <th className="text-left p-4 font-semibold text-gray-700">Posição</th>
                          <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                          <th className="text-left p-4 font-semibold text-gray-700">Data</th>
                        </tr>
                      </thead>
                      <tbody>
                        {safeMaquinasProblema.length > 0 ? (
                          safeMaquinasProblema.map((maquina, index) => (
                            <tr key={index} className="border-b border-gray-200/40 hover:bg-gray-50/50 transition-colors">
                              <td className="p-4 text-gray-900 font-medium">{maquina.WTG || 'N/A'}</td>
                              <td className="p-4 text-gray-700">{maquina.PARQUE || 'N/A'}</td>
                              <td className="p-4 text-gray-700">{maquina.POSICAO_CALLIPER || 'N/A'}</td>
                              <td className="p-4">
                                <Badge
                                  variant="outline"
                                  className={`font-medium ${maquina.STATUS?.toLowerCase().includes('by-pass')
                                    ? 'bg-red-50 text-red-700 border-red-200'
                                    : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                    }`}
                                >
                                  {maquina.STATUS || 'N/A'}
                                </Badge>
                              </td>
                              <td className="p-4 text-gray-700">
                                {maquina.ANO_SUBSTITUICAO && maquina.ANO_SUBSTITUICAO !== "Data Não Informada" ?
                                  new Date(maquina.ANO_SUBSTITUICAO).toLocaleDateString('pt-BR') :
                                  maquina.ANO_SUBSTITUICAO || 'N/A'
                                }
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="p-8 text-center text-gray-500">
                              <div className="flex flex-col items-center gap-2">
                                <CheckCircle className="h-8 w-8 text-green-400" />
                                <span className="font-medium">Nenhuma máquina com problemas encontrada</span>
                                <span className="text-sm">Todas as máquinas estão operacionais</span>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Rodapé */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/60">
            <span className="text-sm text-gray-600">
              Mostrando dados para: <span className="font-semibold text-gray-900">{anoFiltro === 'todos' ? 'Todos os anos' : anoFiltro}</span>
            </span>
            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
            <span className="text-sm text-gray-600">
              {getSafeNumber(dadosFiltrados.totalTurbinas)} turbinas • {getSafeNumber(dadosFiltrados.totalCallipers)} callipers
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;