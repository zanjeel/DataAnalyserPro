import React from 'react';
import { FileText, Table, BarChart, AlertCircle } from 'lucide-react';
import { DataSet } from '../types';

interface DataSummaryProps {
  data: DataSet;
}

const DataSummary: React.FC<DataSummaryProps> = ({ data }) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const getDataQualityScore = (): number => {
    // Calculate a simple data quality score based on missing values
    const totalCells = data.rowCount * data.columnCount;
    const missingCells = data.stats.reduce((sum, col) => sum + col.missing, 0);
    const completeness = 1 - missingCells / totalCells;
    
    // Scale from 0-100
    return Math.round(completeness * 100);
  };

  const getDataTypeDistribution = () => {
    const types: Record<string, number> = {
      number: 0,
      string: 0,
      boolean: 0,
      date: 0,
      mixed: 0
    };
    
    data.stats.forEach(col => {
      types[col.type]++;
    });
    
    return types;
  };

  const typeDistribution = getDataTypeDistribution();
  const qualityScore = getDataQualityScore();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Data Summary</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <FileText size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">File</h3>
              <p className="text-lg font-semibold text-gray-800">{data.fileName}</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">Size: {formatFileSize(data.fileSize)}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <Table size={20} className="text-green-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Dimensions</h3>
              <p className="text-lg font-semibold text-gray-800">{data.rowCount} × {data.columnCount}</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">{data.rowCount} rows, {data.columnCount} columns</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <BarChart size={20} className="text-purple-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Data Types</h3>
              <p className="text-lg font-semibold text-gray-800">
                {typeDistribution.number > 0 && `${typeDistribution.number} Numeric`}
                {typeDistribution.string > 0 && typeDistribution.number > 0 && ', '}
                {typeDistribution.string > 0 && `${typeDistribution.string} Text`}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            {typeDistribution.date > 0 && `${typeDistribution.date} Date, `}
            {typeDistribution.boolean > 0 && `${typeDistribution.boolean} Boolean, `}
            {typeDistribution.mixed > 0 && `${typeDistribution.mixed} Mixed`}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="bg-amber-100 p-3 rounded-full mr-4">
              <AlertCircle size={20} className="text-amber-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Data Quality</h3>
              <p className="text-lg font-semibold text-gray-800">{qualityScore}%</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                qualityScore > 80 ? 'bg-green-600' : qualityScore > 50 ? 'bg-amber-500' : 'bg-red-600'
              }`} 
              style={{ width: `${qualityScore}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <h3 className="text-lg font-medium mb-4">Column Statistics</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Column</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unique</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Missing</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mean</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.stats.map((column, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{column.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${column.type === 'number' ? 'bg-blue-100 text-blue-800' : 
                      column.type === 'string' ? 'bg-green-100 text-green-800' : 
                      column.type === 'date' ? 'bg-purple-100 text-purple-800' : 
                      column.type === 'boolean' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'}`}>
                    {column.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{column.count}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{column.unique}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {column.missing > 0 ? (
                    <span className="text-amber-600 font-medium">{column.missing}</span>
                  ) : (
                    column.missing
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {column.type === 'number' ? column.min?.toString() : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {column.type === 'number' ? column.max?.toString() : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {column.type === 'number' && column.mean ? column.mean.toFixed(2) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataSummary;