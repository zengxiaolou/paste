import { DataTypes } from './enum';

export interface clipData {
  id: number;
  type: DataTypes;
  content: string;

  icon?: string;
  appName?: string;
  from?: string;
  tags?: string;
  created_at?: Date;
}
