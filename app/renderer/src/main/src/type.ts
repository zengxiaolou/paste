import { DataTypes } from './enum';

export interface ClipData {
  id: number;
  type: DataTypes;
  content: string;

  icon?: string;
  appName?: string;
  from?: string;
  tags?: string;
  collection?: boolean;
  created_at?: Date;
}

export interface ClipboardDataQuery {
  type?: DataTypes;
  content?: string;
  icon?: string;
  appName?: string;
  from?: string;
  tags?: string;
  collection?: boolean;
  createdAt?: Date;
  page?: number;
  size?: number;
}
