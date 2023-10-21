export interface clipData {
  id?: number;
  type: 'html' | 'image';
  content: string;

  icon?: string;
  appName?: string;
  from?: string;
  tags?: string;
  created_at?: Date;
}
