export interface DataPoint {
  [key: string]: string | number | boolean | null;
}

export interface ColumnStats {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'mixed';
  count: number;
  unique: number;
  missing: number;
  min?: number | string | Date;
  max?: number | string | Date;
  mean?: number;
  median?: number;
  mode?: string | number;
  std?: number;
  frequencies?: Record<string, number>;
}

export interface DataSet {
  fileName: string;
  fileSize: number;
  rowCount: number;
  columnCount: number;
  headers: string[];
  data: DataPoint[];
  stats: ColumnStats[];
}

export interface ChartData {
  name: string;
  value: number;
}