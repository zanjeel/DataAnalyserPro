import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { DataSet, ColumnStats, ChartData } from '../types';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308'];

interface DataVisualizationsProps {
  data: DataSet;
}

const DataVisualizations: React.FC<DataVisualizationsProps> = ({ data }) => {
  const [selectedColumn, setSelectedColumn] = useState<string>(data.headers[0]);

  const numericalColumns = useMemo(() => {
    return data.stats.filter(col => col.type === 'number').map(col => col.name);
  }, [data.stats]);

  const categoricalColumns = useMemo(() => {
    return data.stats.filter(col => col.type === 'string' || col.type === 'boolean').map(col => col.name);
  }, [data.stats]);

  const getColumnStats = (columnName: string): ColumnStats | undefined => {
    return data.stats.find(stat => stat.name === columnName);
  };

  const getFrequencyData = (columnName: string): ChartData[] => {
    const stats = getColumnStats(columnName);
    if (!stats?.frequencies) return [];
    return Object.entries(stats.frequencies).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const getNumericDistribution = (columnName: string): ChartData[] => {
    const values = data.data.map(row => Number(row[columnName])).filter(val => !isNaN(val));
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;
    const bucketCount = 10;
    const bucketSize = range / bucketCount;

    const buckets = Array(bucketCount).fill(0);
    values.forEach(value => {
      const bucketIndex = Math.min(Math.floor((value - min) / bucketSize), bucketCount - 1);
      buckets[bucketIndex]++;
    });

    return buckets.map((count, i) => ({
      name: `${(min + i * bucketSize).toFixed(1)} - ${(min + (i + 1) * bucketSize).toFixed(1)}`,
      value: count,
    }));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Data Visualizations</h2>
        <div className="flex space-x-4">
          <select
            value={selectedColumn}
            onChange={(e) => setSelectedColumn(e.target.value)}
            className="px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {data.headers.map((header) => (
              <option key={header} value={header}>
                {header}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Categorical Data Visualization */}
      {categoricalColumns.includes(selectedColumn) && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Category Distribution</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getFrequencyData(selectedColumn)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Numerical Data Visualization */}
      {numericalColumns.includes(selectedColumn) && (
        <>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Value Distribution</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getNumericDistribution(selectedColumn)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#6366f1" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Summary Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['min', 'max', 'mean', 'median'].map((stat) => {
                const value = getColumnStats(selectedColumn)?.[stat as keyof ColumnStats];
                return (
                  <div key={stat} className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 capitalize">{stat}</div>
                    <div className="text-lg font-medium text-gray-800">
                      {typeof value === 'number' ? value.toFixed(2) : value || 'N/A'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DataVisualizations;