'use client';

import React, { useState, useRef } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  Area,
  AreaChart
} from 'recharts';
import { Point } from './MapMarker';
import { 
  RealEstateAnalytics, 
  RealEstateStats, 
  ChartData, 
  formatCurrency, 
  formatNumber, 
  formatCompactCurrency 
} from '@/lib/realEstateAnalytics';
import { BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, TrendingUp, Download, FileText, Calendar, MapPin, Zap as ScatterIcon } from 'lucide-react';

interface AdvancedRealEstateChartsProps {
  data: Point[];
}

type ChartType = 'scatter' | 'timeSeries' | 'pricePerSqm' | 'histogram' | 'commune' | 'distribution';

const CHART_COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
  '#F97316', '#06B6D4', '#84CC16', '#EC4899', '#6366F1'
];

const AdvancedRealEstateCharts: React.FC<AdvancedRealEstateChartsProps> = ({ data }) => {
  const [selectedChart, setSelectedChart] = useState<ChartType>('scatter');
  const [showStats, setShowStats] = useState(true);
  const chartRef = useRef<HTMLDivElement>(null);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-gray-400 mb-4">
          <BarChart3 className="w-16 h-16 mx-auto mb-4" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No hay datos seleccionados
        </h3>
        <p className="text-gray-500 mb-4">
          Dibuja un círculo en el mapa para seleccionar propiedades y ver los análisis
        </p>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-600">
            💡 Consejo: Usa la herramienta de círculo en el mapa para seleccionar un área y obtener análisis detallados
          </p>
        </div>
      </div>
    );
  }

  const analytics = new RealEstateAnalytics(data);
  const stats = analytics.calculateStats();

  const getChartData = (): ChartData[] => {
    switch (selectedChart) {
      case 'scatter':
        return analytics.getScatterPlotData();
      case 'timeSeries':
        return analytics.getTimeSeriesData();
      case 'pricePerSqm':
        return analytics.getPricePerSqmData();
      case 'histogram':
        return analytics.getHistogramData('price', 12);
      case 'commune':
        return analytics.getCommuneData();
      case 'distribution':
        return analytics.getHistogramData('size', 10);
      default:
        return analytics.getScatterPlotData();
    }
  };

  const chartData = getChartData();

  const downloadPDF = async () => {
    if (typeof window === 'undefined') return;

    try {
      const { jsPDF } = await import('jspdf');
      const html2canvas = (await import('html2canvas')).default;
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const chartElement = chartRef.current;
      
      if (!chartElement) return;

      // Capturar el elemento del gráfico
      const canvas = await html2canvas(chartElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 190; // Ancho en mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Configurar el PDF
      pdf.setFontSize(20);
      pdf.text('Análisis de Mercado Inmobiliario', 20, 20);
      
      pdf.setFontSize(12);
      pdf.text(`Fecha: ${new Date().toLocaleDateString('es-CL')}`, 20, 30);
      pdf.text(`Propiedades analizadas: ${stats.totalProperties}`, 20, 40);
      
      // Agregar estadísticas
      let y = 50;
      pdf.setFontSize(14);
      pdf.text('Estadísticas Principales:', 20, y);
      y += 10;
      
      pdf.setFontSize(10);
      pdf.text(`• Precio promedio: ${formatCurrency(stats.averagePrice)}`, 25, y);
      y += 5;
      pdf.text(`• Precio mediano: ${formatCurrency(stats.medianPrice)}`, 25, y);
      y += 5;
      pdf.text(`• Precio por m²: ${formatCurrency(stats.pricePerSqm)}`, 25, y);
      y += 5;
      pdf.text(`• Superficie promedio: ${formatNumber(stats.averageSize)} m²`, 25, y);
      y += 5;
      pdf.text(`• Volumen total: ${formatCurrency(stats.totalVolume)}`, 25, y);
      y += 10;

      // Agregar gráfico
      pdf.addImage(imgData, 'PNG', 10, y, imgWidth, imgHeight);

      // Descargar
      pdf.save(`analisis-inmobiliario-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error al generar PDF:', error);
    }
  };

  const getChartConfig = () => {
    switch (selectedChart) {
      case 'scatter':
        return {
          title: 'Precio vs Superficie',
          xLabel: 'Superficie (m²)',
          yLabel: 'Precio (CLP)',
          description: 'Relación entre el tamaño y precio de las propiedades'
        };
      case 'timeSeries':
        return {
          title: 'Evolución de Precios en el Tiempo',
          xLabel: 'Fecha',
          yLabel: 'Precio (CLP)',
          description: 'Tendencia histórica de precios'
        };
      case 'pricePerSqm':
        return {
          title: 'Precio por m² vs Superficie',
          xLabel: 'Superficie (m²)',
          yLabel: 'Precio por m² (CLP)',
          description: 'Análisis de precio unitario por superficie'
        };
      case 'histogram':
        return {
          title: 'Distribución de Precios',
          xLabel: 'Rango de Precios',
          yLabel: 'Cantidad de Propiedades',
          description: 'Frecuencia de propiedades por rango de precio'
        };
      case 'commune':
        return {
          title: 'Análisis por Comuna',
          xLabel: 'Cantidad de Propiedades',
          yLabel: 'Precio Promedio (CLP)',
          description: 'Comparación de mercado por comuna'
        };
      case 'distribution':
        return {
          title: 'Distribución de Superficies',
          xLabel: 'Rango de Superficie (m²)',
          yLabel: 'Cantidad de Propiedades',
          description: 'Frecuencia de propiedades por tamaño'
        };
      default:
        return {
          title: 'Análisis de Datos',
          xLabel: 'X',
          yLabel: 'Y',
          description: 'Análisis de propiedades'
        };
    }
  };

  const config = getChartConfig();

  const renderChart = () => {
    const commonProps = {
      width: 500,
      height: 400,
      margin: { top: 20, right: 30, bottom: 60, left: 80 }
    };

    switch (selectedChart) {
      case 'scatter':
        return (
          <ScatterChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              type="number" 
              dataKey="x" 
              name={config.xLabel}
              tickFormatter={(value) => `${value}m²`}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name={config.yLabel}
              tickFormatter={(value) => formatCompactCurrency(value)}
            />
            <Tooltip 
              formatter={(value: any, name: any, props: any) => {
                if (name === config.yLabel) return [formatCurrency(value), 'Precio'];
                if (name === config.xLabel) return [`${value} m²`, 'Superficie'];
                return [value, name];
              }}
              labelFormatter={(label, payload) => {
                if (payload && payload[0]) {
                  const data = payload[0].payload;
                  return `${data.label} - ${data.commune}`;
                }
                return label;
              }}
            />
            <Scatter name="Propiedades" data={chartData} fill="#3B82F6" />
          </ScatterChart>
        );

      case 'timeSeries':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              type="number"
              dataKey="x"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <YAxis 
              tickFormatter={(value) => formatCompactCurrency(value)}
            />
            <Tooltip 
              labelFormatter={(value) => new Date(value).toLocaleDateString()}
              formatter={(value: any) => [formatCurrency(value), 'Precio']}
            />
            <Line 
              type="monotone" 
              dataKey="y" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        );

      case 'pricePerSqm':
        return (
          <ScatterChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              type="number" 
              dataKey="x" 
              name="Superficie"
              tickFormatter={(value) => `${value}m²`}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name="Precio por m²"
              tickFormatter={(value) => formatCompactCurrency(value)}
            />
            <Tooltip 
              formatter={(value: any, name: any) => {
                if (name === 'Precio por m²') return [formatCurrency(value), 'Precio/m²'];
                return [value, name];
              }}
            />
            <Scatter name="Precio por m²" data={chartData} fill="#10B981" />
          </ScatterChart>
        );

      case 'histogram':
      case 'distribution':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="label"
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis />
            <Tooltip 
              formatter={(value: any) => [value, 'Cantidad']}
            />
            <Bar dataKey="y" fill="#F59E0B" />
          </BarChart>
        );

      case 'commune':
        return (
          <ScatterChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              type="number" 
              dataKey="x" 
              name="Cantidad"
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name="Precio Promedio"
              tickFormatter={(value) => formatCompactCurrency(value)}
            />
            <Tooltip 
              formatter={(value: any, name: any) => {
                if (name === 'Precio Promedio') return [formatCurrency(value), 'Precio Promedio'];
                return [value, name];
              }}
              labelFormatter={(label, payload) => {
                if (payload && payload[0]) {
                  return payload[0].payload.label;
                }
                return label;
              }}
            />
            <Scatter name="Comunas" data={chartData} fill="#8B5CF6" />
          </ScatterChart>
        );

      default:
        return (
          <ScatterChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              type="number" 
              dataKey="x" 
              name="X"
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name="Y"
            />
            <Tooltip />
            <Scatter name="Datos" data={chartData} fill="#3B82F6" />
          </ScatterChart>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Análisis de Mercado Inmobiliario
          </h2>
          <p className="text-gray-600">
            {stats.totalProperties} propiedades analizadas • {config.description}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowStats(!showStats)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <TrendingUp className="w-4 h-4" />
            <span>{showStats ? 'Ocultar' : 'Mostrar'} Estadísticas</span>
          </button>
          <button
            onClick={downloadPDF}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Descargar PDF</span>
          </button>
        </div>
      </div>

      {/* Statistics Panel */}
      {showStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Precio Promedio</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCompactCurrency(stats.averagePrice)}
                </p>
              </div>
              <div className="text-blue-500">
                <FileText className="w-8 h-8" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Precio Mediano</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCompactCurrency(stats.medianPrice)}
                </p>
              </div>
              <div className="text-green-500">
                <TrendingUp className="w-8 h-8" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Precio por m²</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCompactCurrency(stats.pricePerSqm)}
                </p>
              </div>
              <div className="text-purple-500">
                <MapPin className="w-8 h-8" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Volumen Total</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCompactCurrency(stats.totalVolume)}
                </p>
              </div>
              <div className="text-orange-500">
                <Calendar className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chart Type Selector */}
      <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
        <button
          onClick={() => setSelectedChart('scatter')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            selectedChart === 'scatter' 
              ? 'bg-blue-500 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          <ScatterIcon className="w-4 h-4" />
          <span>Dispersión</span>
        </button>
        
        <button
          onClick={() => setSelectedChart('timeSeries')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            selectedChart === 'timeSeries' 
              ? 'bg-blue-500 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          <LineChartIcon className="w-4 h-4" />
          <span>Tendencia</span>
        </button>
        
        <button
          onClick={() => setSelectedChart('pricePerSqm')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            selectedChart === 'pricePerSqm' 
              ? 'bg-blue-500 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Precio/m²</span>
        </button>
        
        <button
          onClick={() => setSelectedChart('histogram')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            selectedChart === 'histogram' 
              ? 'bg-blue-500 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Distribución Precios</span>
        </button>
        
        <button
          onClick={() => setSelectedChart('commune')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            selectedChart === 'commune' 
              ? 'bg-blue-500 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Por Comuna</span>
        </button>
        
        <button
          onClick={() => setSelectedChart('distribution')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            selectedChart === 'distribution' 
              ? 'bg-blue-500 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Distribución Tamaños</span>
        </button>
      </div>

      {/* Chart */}
      <div ref={chartRef} className="bg-white p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4 text-center text-gray-800">
          {config.title}
        </h3>
        <div className="w-full h-96">
          <ResponsiveContainer>
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trend Indicator */}
      {stats.trend.percentage > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-center space-x-2">
            <TrendingUp className={`w-5 h-5 ${
              stats.trend.direction === 'up' ? 'text-green-500' : 
              stats.trend.direction === 'down' ? 'text-red-500' : 'text-gray-500'
            }`} />
            <span className="text-sm text-gray-600">
              Tendencia del mercado: 
              <span className={`font-semibold ml-1 ${
                stats.trend.direction === 'up' ? 'text-green-600' : 
                stats.trend.direction === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {stats.trend.direction === 'up' ? 'Alza' : 
                 stats.trend.direction === 'down' ? 'Baja' : 'Estable'} 
                {stats.trend.percentage > 0 && ` (${stats.trend.percentage}%)`}
              </span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedRealEstateCharts;