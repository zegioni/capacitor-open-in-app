import type { SharedItem, SharedItemType } from './types';

export const filterItemsByType = (items: SharedItem[], type: SharedItemType): SharedItem[] => {
  return items.filter((item: SharedItem) => item.type === type);
};

export const filterPdfs = (items: SharedItem[]): SharedItem[] => {
  return items.filter((item: SharedItem) => {
    const extension = item.fileExtension?.toLowerCase();
    return (
      item.type === 'pdf' ||
      extension === 'pdf' ||
      item.mimeType === 'application/pdf'
    );
  });
};

export const filterImages = (items: SharedItem[]): SharedItem[] => {
  return items.filter((item: SharedItem) => item.type === 'image');
};
