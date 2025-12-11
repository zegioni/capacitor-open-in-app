import { registerPlugin } from '@capacitor/core';
import type { SharedItem, SharedItemType, GetItemsResult, OpenInAppConfig } from './types';
import { filterImages, filterItemsByType, filterPdfs } from './filters';

export type { SharedItem, SharedItemType, GetItemsResult, OpenInAppConfig } from './types';

export interface OpenInAppPlugin {
  getItems(): Promise<GetItemsResult>;
}

export const OpenInApp = registerPlugin<OpenInAppPlugin>('OpenInAppPlugin');

let currentConfig: OpenInAppConfig = {};

export const configure = (config: OpenInAppConfig): void => {
  currentConfig = { ...currentConfig, ...config };
};

const applyConfigFilter = (items: SharedItem[]): SharedItem[] => {
  if (!currentConfig.allowedTypes || currentConfig.allowedTypes.length === 0) {
    return items;
  }
  const allowedTypes = new Set<SharedItemType>(currentConfig.allowedTypes);
  return items.filter((item: SharedItem) => allowedTypes.has(item.type));
};

export const getItemsByType = async (type: SharedItemType): Promise<SharedItem[]> => {
  const { items } = await OpenInApp.getItems();
  const filtered = applyConfigFilter(items);
  return filterItemsByType(filtered, type);
};

export const getPdfs = async (): Promise<SharedItem[]> => {
  const { items } = await OpenInApp.getItems();
  const filtered = applyConfigFilter(items);
  return filterPdfs(filtered);
};

export const getImages = async (): Promise<SharedItem[]> => {
  const { items } = await OpenInApp.getItems();
  const filtered = applyConfigFilter(items);
  return filterImages(filtered);
};