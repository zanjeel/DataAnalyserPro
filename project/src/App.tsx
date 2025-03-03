import React, { useState } from 'react';
import { FileUp, BarChart4, PieChart, LineChart, Table, Download } from 'lucide-react';
import FileUploader from './components/FileUploader';
import DataSummary from './components/DataSummary';
import DataTable from './components/DataTable';
import DataVisualizations from './components/DataVisualizations';
import { DataSet } from './types';

function App() {
  const [data, setData] = useState<DataSet | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'table' | 'visualizations'>('summary');

  const handleDataLoaded = (parsedData: DataSet) => {
    setData(parsedData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-indigo-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart4 size={28} />
              <h1 className="text-2xl font-bold">Excel Data Analyzer</h1>
            </div>
            <p className="text-indigo-100">Upload, analyze, visualize</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!data ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Upload Excel File</h2>
              <p className="text-gray-600 mb-6">
                Upload your Excel file to get instant analysis and visualizations. All processing happens in your browser - no data is sent to any server.
              </p>
              <FileUploader onDataLoaded={handleDataLoaded} />
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-indigo-100 p-4 rounded-full mb-4">
                    <FileUp size={24} className="text-indigo-600" />
                  </div>
                  <h3 className="font-medium text-gray-800">Upload</h3>
                  <p className="text-gray-600 text-sm mt-2">Upload your Excel file securely</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="bg-indigo-100 p-4 rounded-full mb-4">
                    <Table size={24} className="text-indigo-600" />
                  </div>
                  <h3 className="font-medium text-gray-800">Analyze</h3>
                  <p className="text-gray-600 text-sm mt-2">Get detailed data analysis</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="bg-indigo-100 p-4 rounded-full mb-4">
                    <LineChart size={24} className="text-indigo-600" />
                  </div>
                  <h3 className="font-medium text-gray-800">Visualize</h3>
                  <p className="text-gray-600 text-sm mt-2">See beautiful charts and graphs</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Analysis Results</h2>
                <button 
                  onClick={() => setData(null)}
                  className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors"
                >
                  Upload New File
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="flex border-b">
                <button
                  className={`px-6 py-3 font-medium ${
                    activeTab === 'summary' ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-700' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab('summary')}
                >
                  Summary
                </button>
                <button
                  className={`px-6 py-3 font-medium ${
                    activeTab === 'table' ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-700' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab('table')}
                >
                  Data Table
                </button>
                <button
                  className={`px-6 py-3 font-medium ${
                    activeTab === 'visualizations' ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-700' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab('visualizations')}
                >
                  Visualizations
                </button>
              </div>

              <div className="p-6">
                {activeTab === 'summary' && data && <DataSummary data={data} />}
                {activeTab === 'table' && data && <DataTable data={data} />}
                {activeTab === 'visualizations' && data && <DataVisualizations data={data} />}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <BarChart4 size={20} />
              <span className="font-semibold">Excel Data Analyzer</span>
            </div>
            <p className="text-gray-400 text-sm">
              All data processing happens in your browser. No data is sent to any server.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;