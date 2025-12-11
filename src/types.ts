export type SharedItemType = 'file' | 'image' | 'pdf' | 'text' | 'url' | 'unknown';

export interface SharedItem {
  id: string;
  type: SharedItemType;
  mimeType?: string;
  fileName?: string;
  fileExtension?: string;
  path?: string;     
  url?: string;          
  size?: number;
  createdAt?: string;    
}

export interface GetItemsResult {
  items: SharedItem[];
}

export interface OpenInAppConfig {
  allowedTypes?: SharedItemType[];
}