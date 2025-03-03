import { DataSet, DataPoint, ColumnStats } from '../types';

export const analyzeData = (rawData: any[], fileName: string, fileSize: number): DataSet => {
  // Extract headers (first row)
  const headers = rawData[0] as string[];
  
  // Extract data rows (skip header row)
  const dataRows = rawData.slice(1);
  
  // Convert to array of objects with header keys
  const data: DataPoint[] = dataRows.map(row => {
    const dataPoint: DataPoint = {};
    headers.forEach((header, index) => {
      const value = row[index];
      
      // Try to convert to appropriate type
      if (value === undefined || value === null || value === '') {
        dataPoint[header] = null;
      } else if (!isNaN(Number(value)) && value !== '') {
        dataPoint[header] = Number(value);
      } else if (value === 'true' || value === 'false') {
        dataPoint[header] = value === 'true';
      } else {
        dataPoint[header] = value;
      }
    });
    return dataPoint;
  });
  
  // Calculate statistics for each column
  const stats: ColumnStats[] = headers.map(header => {
    const values = data.map(row => row[header]);
    const nonNullValues = values.filter(value => value !== null) as (string | number | boolean)[];
    
    // Determine column type
    let type: 'string' | 'number' | 'boolean' | 'date' | 'mixed' = 'mixed';
    
    if (nonNullValues.length > 0) {
      const types = new Set(nonNullValues.map(value => typeof value));
      
      if (types.size === 1) {
        if (types.has('number')) type = 'number';
        else if (types.has('string')) type = 'string';
        else if (types.has('boolean')) type = 'boolean';
      }
    }
    
    // Calculate basic statistics
    const columnStats: ColumnStats = {
      name: header,
      type,
      count: nonNullValues.length,
      unique: new Set(nonNullValues.map(String)).size,
      missing: values.length - nonNullValues.length,
    };
    
    // Calculate numeric statistics if applicable
    if (type === 'number') {
      const numericValues = nonNullValues as number[];
      
      columnStats.min = Math.min(...numericValues);
      columnStats.max = Math.max(...numericValues);
      columnStats.mean = numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length;
      
      // Calculate median
      const sorted = [...numericValues].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      columnStats.median = sorted.length % 2 === 0
        ? (sorted[mid - 1] + sorted[mid]) / 2
        : sorted[mid];
      
      // Calculate standard deviation
      const mean = columnStats.mean;
      const squaredDiffs = numericValues.map(val => Math.pow(val - mean, 2));
      columnStats.std = Math.sqrt(squaredDiffs.reduce((sum, val) => sum + val, 0) / numericValues.length);
    }
    
    // Calculate frequencies for categorical data
    if (type === 'string' || type === 'boolean') {
      const frequencies: Record<string, number> = {};
      nonNullValues.forEach(value => {
        const key = String(value);
        frequencies[key] = (frequencies[key] || 0) + 1;
      });
      columnStats.frequencies = frequencies;
      
      // Find mode (most common value)
      let maxFreq = 0;
      let mode: string | undefined;
      
      Object.entries(frequencies).forEach(([value, freq]) => {
        if (freq > maxFreq) {
          maxFreq = freq;
          mode = value;
        }
      });
      
      if (mode) columnStats.mode = type === 'boolean' ? mode === 'true' : mode;
    }
    
    return columnStats;
  });
  
  return {
    fileName,
    fileSize,
    rowCount: data.length,
    columnCount: headers.length,
    headers,
    data,
    stats
  };
};