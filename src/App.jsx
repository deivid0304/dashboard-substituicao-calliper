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
  Grid3X3,
  Printer,
  Menu,
  X
} from 'lucide-react';
import './App.css';

function App() {
  const [dashboardData, setDashboardData] = useState(null);
  const [anoFiltro, setAnoFiltro] = useState('todos');
  const [dadosFiltrados, setDadosFiltrados] = useState(null);
  const [abaAtiva, setAbaAtiva] = useState('analise');
  const [hoverValue, setHoverValue] = useState(null);
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar tamanho da tela
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarAberta(true);
      } else {
        setSidebarAberta(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    if (isMobile) {
      setSidebarAberta(false);
    }
  };

  const handleExportar = () => {
    window.print();
  };

  const handleAtualizar = () => {
    window.location.reload();
  };

  const toggleSidebar = () => {
    setSidebarAberta(!sidebarAberta);
  };

  // Componente MetricCard
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
        <div className={`text-2xl lg:text-3xl font-bold mb-1 
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex flex-col md:flex-row">
      {/* Botão Menu Mobile */}
      {isMobile && (
        <div className="fixed top-4 left-4 z-50">
          <Button
            onClick={toggleSidebar}
            className="bg-white/80 backdrop-blur-sm border border-gray-200/60 shadow-lg"
            size="sm"
          >
            {sidebarAberta ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      )}

      {/* Overlay para mobile quando sidebar está aberta */}
      {isMobile && sidebarAberta && (
        <div 
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarAberta(false)}
        />
      )}

      {/* Sidebar Vertical */}
      <div className={`
        ${isMobile 
          ? `fixed top-0 left-0 h-full z-40 transform transition-transform duration-300 ${
              sidebarAberta ? 'translate-x-0' : '-translate-x-full'
            }`
          : 'relative'
        }
        w-64 bg-white/95 backdrop-blur-sm border-r border-gray-200/60 flex flex-col p-6
      `}>
        {/* Logo/Título da Sidebar */}
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl shadow-lg">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Callipers</h2>
            <p className="text-xs text-gray-600">Monitoramento</p>
          </div>
        </div>

        {/* Botões de Filtro - Layout Vertical */}
        <div className="space-y-3 flex-1">
          <Button
            variant={anoFiltro === 'todos' ? "default" : "outline"}
            className={`w-full justify-start gap-3 h-12 transition-all duration-300 font-medium ${anoFiltro === 'todos'
              ? 'bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:from-blue-700 hover:to-purple-800 transform hover:scale-[1.02]'
              : 'bg-white/70 backdrop-blur-sm border-gray-300/70 text-gray-700 hover:bg-white hover:border-gray-400 hover:shadow-md'
              }`}
            onClick={() => handleFiltrar('todos')}
          >
            <Calendar className="h-4 w-4" />
            Todos os Anos
          </Button>

          <Button
            variant={anoFiltro === '2024' ? "default" : "outline"}
            className={`w-full justify-start gap-3 h-12 transition-all duration-300 font-medium ${anoFiltro === '2024'
              ? 'bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:from-blue-700 hover:to-purple-800 transform hover:scale-[1.02]'
              : 'bg-white/70 backdrop-blur-sm border-gray-300/70 text-gray-700 hover:bg-white hover:border-gray-400 hover:shadow-md'
              }`}
            onClick={() => handleFiltrar('2024')}
          >
            <Calendar className="h-4 w-4" />
            2024
          </Button>

          <Button
            variant={anoFiltro === '2025' ? "default" : "outline"}
            className={`w-full justify-start gap-3 h-12 transition-all duration-300 font-medium ${anoFiltro === '2025'
              ? 'bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:from-blue-700 hover:to-purple-800 transform hover:scale-[1.02]'
              : 'bg-white/70 backdrop-blur-sm border-gray-300/70 text-gray-700 hover:bg-white hover:border-gray-400 hover:shadow-md'
              }`}
            onClick={() => handleFiltrar('2025')}
          >
            <Calendar className="h-4 w-4" />
            2025
          </Button>

          <div className="pt-4 border-t border-gray-200/60 mt-4">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 h-12 bg-white/70 backdrop-blur-sm border-gray-300/70 text-gray-700 hover:bg-white hover:border-gray-400 hover:shadow-md transition-all duration-300 font-medium"
              onClick={handleExportar}
            >
              <Printer className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col min-h-screen w-full">
        {/* Header Centralizado */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60">
          <div className="container mx-auto px-4 sm:px-6 py-6 md:py-8">
            <div className="flex flex-col items-center justify-center text-center gap-4">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-2xl shadow-lg">
                <Zap className="h-8 w-8 md:h-10 md:w-10 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-br from-gray-900 to-blue-600 bg-clip-text text-transparent">
                  Monitoramento Callipers
                </h1>
                <p className="text-gray-600 text-sm sm:text-lg mt-2 font-medium">
                  Complexo Eólico Santo Inácio • 2024-2025
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo do Dashboard */}
        <div className="flex-1 container mx-auto px-4 sm:px-6 py-6 md:py-8">
          {/* Grid de Métricas - Responsivo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-4 mb-6 md:mb-8">
            <MetricCard
              title="Total Turbinas"
              value={getSafeNumber(dadosFiltrados.totalTurbinas)}
              subtitle="Complexo eólico"
              icon={Wind}
              variant="info"
            />
            <MetricCard
              title="Total de Callipers"
              value={getSafeNumber(dadosFiltrados.totalCallipers)}
              subtitle="Qtd. de Callipers"
              icon={Settings}
              variant="sky"
            />
            <MetricCard
              title="Vedações Substituidas"
              value={getSafeNumber(dadosFiltrados.callipersSubstituidos)}
              subtitle="Qtd. de Substituições"
              icon={Wrench}
              variant="emerald"
            />
            <MetricCard
              title="Callipers com By-Pass"
              value={getSafeNumber(dadosFiltrados.callipersByPass)}
              subtitle="Com vazamento"
              icon={AlertCircle}
              variant="alert"
            />
            <MetricCard
              title="Callipers com vedações originais"
              value={getSafeNumber(dadosFiltrados.callipersSemVazamento)}
              subtitle="Pendente substituição"
              icon={CheckCircle}
              variant="yellow"
            />
          </div>

          {/* Abas do Dashboard */}
          <Tabs value={abaAtiva} onValueChange={setAbaAtiva} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6 md:mb-8 bg-white/60 backdrop-blur-sm border border-gray-200/60 rounded-xl md:rounded-2xl p-1 gap-1">
              <TabsTrigger
                value="analise"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg md:rounded-xl transition-all text-xs md:text-sm py-2 md:py-3"
              >
                <BarChart3 className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Análise Geral</span>
                <span className="sm:hidden">Geral</span>
              </TabsTrigger>
              <TabsTrigger
                value="posicoes"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg md:rounded-xl transition-all text-xs md:text-sm py-2 md:py-3"
              >
                <Grid3X3 className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Posições</span>
                <span className="sm:hidden">Posições</span>
              </TabsTrigger>
              <TabsTrigger
                value="evolucao"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg md:rounded-xl transition-all text-xs md:text-sm py-2 md:py-3"
              >
                <TrendingUp className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Evolução</span>
                <span className="sm:hidden">Evolução</span>
              </TabsTrigger>
              <TabsTrigger
                value="relatorios"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg md:rounded-xl transition-all text-xs md:text-sm py-2 md:py-3"
              >
                <FileText className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Relatórios</span>
                <span className="sm:hidden">Relatórios</span>
              </TabsTrigger>
            </TabsList>

            {/* Aba 1: Análise Geral */}
            <TabsContent value="analise" className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {/* Substituições por Parque */}
                <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                      Substituições por Parque
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-sm md:text-base">
                      Quantidade de callipers substituídos por parque
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={safeSubstituicoesPorParque} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis
                          dataKey="PARQUE"
                          tick={{ fontSize: 12 }}
                          angle={isMobile ? -45 : -23}
                          textAnchor="end"
                          height={isMobile ? 80 : 60}
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
                            style={{ fontSize: isMobile ? '10px' : '12px', fontWeight: '600', fill: '#374151' }}
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
                    <CardTitle className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Users className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
                      Status dos Callipers
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-sm md:text-base">
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
                          outerRadius={isMobile ? 80 : 100}
                          innerRadius={isMobile ? 40 : 60}
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
            <TabsContent value="posicoes" className="space-y-4 md:space-y-6">
              {/* Gráfico de Barras com Gradiente */}
              <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Grid3X3 className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
                    Distribuição - Posição x Turbina
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-sm md:text-base">
                    Quantidade de callipers substituídos por posição (Total geral 47 Turbinas)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={[...safePosicaoCallipers].sort((a, b) => {
                        const numA = parseInt(a.Posicao.replace('Calliper ', ''));
                        const numB = parseInt(b.Posicao.replace('Calliper ', ''));
                        return numA - numB;
                      })}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis
                        dataKey="Posicao"
                        tick={{ fontSize: isMobile ? 12 : 16, fontWeight: '600' }}
                      />
                      <YAxis
                        tick={{ fontSize: isMobile ? 12 : 14 }}
                        label={{ value: 'Quantidade', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip content={<CustomTooltipPosicoes />} />
                      <Bar dataKey="Quantidade" radius={[6, 6, 0, 0]} barSize={isMobile ? 30 : 50}>
                        <LabelList
                          dataKey="Quantidade"
                          position="top"
                          style={{ 
                            fontSize: isMobile ? '12px' : '16px', 
                            fontWeight: '700', 
                            fill: '#320f0fff' 
                          }}
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
            <TabsContent value="evolucao" className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {/* Evolução Mensal */}
                <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                      Evolução Mensal
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-sm md:text-base">
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
                    <CardTitle className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Wrench className="h-4 w-4 md:h-5 md:w-5 text-orange-600" />
                      Tipo de Substituição
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-sm md:text-base">
                      Distribuição entre O-Ring e Pastilhas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={safePercentualTipoSubstituicao} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis dataKey="Tipo" tick={{ fontSize: isMobile ? 12 : 14 }} />
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
                              const percentual = ((value / 235) * 100).toFixed(1);
                              return `${value} (${percentual}%)`;
                            }}
                            style={{ 
                              fontSize: isMobile ? '12px' : '14px', 
                              fontWeight: '600', 
                              fill: '#374151' 
                            }}
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
            <TabsContent value="relatorios" className="space-y-4 md:space-y-6">
              {/* Card Inferior - Máquinas com Problemas */}
              <div className="grid grid-cols-1 gap-4 md:gap-6">
                <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 md:h-5 md:w-5 text-red-600" />
                      Relação de Máquinas Pendentes de Substituição
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-sm md:text-base">
                      Lista de turbinas com callipers by-passados e Pendentes de substituição.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto rounded-lg border border-gray-200/60">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200/60">
                            <th className="text-left p-3 md:p-4 font-semibold text-gray-700">Máquina (WTG)</th>
                            <th className="text-left p-3 md:p-4 font-semibold text-gray-700">Parque</th>
                            <th className="text-left p-3 md:p-4 font-semibold text-gray-700">Posição</th>
                            <th className="text-left p-3 md:p-4 font-semibold text-gray-700">Status</th>
                            <th className="text-left p-3 md:p-4 font-semibold text-gray-700">Data</th>
                          </tr>
                        </thead>
                        <tbody>
                          {safeMaquinasProblema.length > 0 ? (
                            safeMaquinasProblema.map((maquina, index) => (
                              <tr key={index} className="border-b border-gray-200/40 hover:bg-gray-50/50 transition-colors">
                                <td className="p-3 md:p-4 text-gray-900 font-medium">{maquina.WTG || 'N/A'}</td>
                                <td className="p-3 md:p-4 text-gray-700">{maquina.PARQUE || 'N/A'}</td>
                                <td className="p-3 md:p-4 text-gray-700">{maquina.POSICAO_CALLIPER || 'N/A'}</td>
                                <td className="p-3 md:p-4">
                                  <Badge
                                    variant="outline"
                                    className={`font-medium text-xs ${maquina.STATUS?.toLowerCase().includes('by-pass')
                                      ? 'bg-red-50 text-red-700 border-red-200'
                                      : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                      }`}
                                  >
                                    {maquina.STATUS || 'N/A'}
                                  </Badge>
                                </td>
                                <td className="p-3 md:p-4 text-gray-700">
                                  {maquina.ANO_SUBSTITUICAO && maquina.ANO_SUBSTITUICAO !== "Aguardando Programação" ?
                                    new Date(maquina.ANO_SUBSTITUICAO).toLocaleDateString('pt-BR') :
                                    maquina.ANO_SUBSTITUICAO || 'N/A'
                                  }
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="5" className="p-6 md:p-8 text-center text-gray-500">
                                <div className="flex flex-col items-center gap-2">
                                  <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-green-400" />
                                  <span className="font-medium text-sm md:text-base">Nenhuma máquina com problemas encontrada</span>
                                  <span className="text-xs md:text-sm">Todas as máquinas estão operacionais</span>
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
          <div className="mt-6 md:mt-8 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/60">
              <span className="text-sm text-gray-600">
                Mostrando dados para: <span className="font-semibold text-gray-900">{anoFiltro === 'todos' ? 'Todos os anos' : anoFiltro}</span>
              </span>
              <span className="hidden sm:block w-1 h-1 bg-gray-400 rounded-full"></span>
              <span className="text-sm text-gray-600">
                {getSafeNumber(dadosFiltrados.totalTurbinas)} turbinas • {getSafeNumber(dadosFiltrados.totalCallipers)} callipers
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;