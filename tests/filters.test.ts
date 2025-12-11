import { describe, it, expect } from 'vitest';
import { filterImages, filterItemsByType, filterPdfs } from '../src/filters';
import type { SharedItem } from '../src/types';

const baseItem = (overrides: Partial<SharedItem>): SharedItem => {
  return {
    id: 'id',
    type: 'file',
    ...overrides,
  };
};

describe('filters', () => {
  const items: SharedItem[] = [
    baseItem({ id: 'pdf-1', type: 'pdf', fileExtension: 'pdf', mimeType: 'application/pdf' }),
    baseItem({ id: 'img-1', type: 'image', mimeType: 'image/png' }),
    baseItem({ id: 'txt-1', type: 'text', fileExtension: 'txt', mimeType: 'text/plain' }),
  ];

  it('filters by type', () => {
    const pdfItems = filterItemsByType(items, 'pdf');
    expect(pdfItems.map((item: SharedItem) => item.id)).toEqual(['pdf-1']);
  });

  it('filters pdfs', () => {
    const pdfItems = filterPdfs(items);
    expect(pdfItems.map((item: SharedItem) => item.id)).toEqual(['pdf-1']);
  });

  it('filters images', () => {
    const imageItems = filterImages(items);
    expect(imageItems.map((item: SharedItem) => item.id)).toEqual(['img-1']);
  });
});
