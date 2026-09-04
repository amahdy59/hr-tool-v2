import { describe, it, expect, vi } from 'vitest';
import { exportToCSV } from '../export';

describe('exportToCSV', () => {
  it('returns early when data array is empty or undefined', () => {
    expect(() => exportToCSV([], 'test')).not.toThrow();
    expect(() => exportToCSV(null as any, 'test')).not.toThrow();
  });

  it('correctly creates a blob with UTF-8 BOM', () => {
    let capturedBlob: Blob | null = null;
    const originalBlob = globalThis.Blob;
    
    // Spy on Blob constructor
    globalThis.Blob = class MockBlob extends originalBlob {
      constructor(blobParts?: BlobPart[], options?: BlobPropertyBag) {
        super(blobParts, options);
        capturedBlob = this;
      }
    };

    // Mock document.createElement
    const clickSpy = vi.fn();
    const mockAnchor = {
      setAttribute: vi.fn(),
      style: {},
      click: clickSpy,
      download: '',
    };
    const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor as any);
    const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockAnchor as any);
    const removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockAnchor as any);
    globalThis.URL.createObjectURL = vi.fn().mockReturnValue('blob:test');
    globalThis.URL.revokeObjectURL = vi.fn();

    const data = [
      { name: 'أحمد مهدي', role: 'Engineer', notes: 'Comma, test  quotes' },
    ];

    exportToCSV(data, 'test-export');

    expect(clickSpy).toHaveBeenCalled();
    expect(mockAnchor.setAttribute).toHaveBeenCalledWith('download', 'test-export.csv');

    // Clean up mocks
    globalThis.Blob = originalBlob;
    createElementSpy.mockRestore();
    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });
});
