import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Import utilities yang sudah diperbaiki
import {
  ensureArray,
  generateUniqueKey,
  safeGet,
  standardizeApiResponse,
  handleApiError,
  safeFilter,
} from '../utils/apiResponseHandler';

import {
  standardizeCustomer,
  standardizeBarang,
  mapField,
  customerFieldMap,
  barangFieldMap,
} from '../utils/fieldMapping';

describe('API Response Handler', () => {
  describe('ensureArray', () => {
    it('should return array if input is already array', () => {
      const input = [1, 2, 3];
      expect(ensureArray(input)).toEqual([1, 2, 3]);
    });

    it('should extract data property if object has data array', () => {
      const input = { data: [1, 2, 3], message: 'success' };
      expect(ensureArray(input)).toEqual([1, 2, 3]);
    });

    it('should return single item array if input is object without data', () => {
      const input = { id: 1, name: 'test' };
      expect(ensureArray(input)).toEqual([{ id: 1, name: 'test' }]);
    });

    it('should return empty array for null/undefined', () => {
      expect(ensureArray(null)).toEqual([]);
      expect(ensureArray(undefined)).toEqual([]);
    });
  });

  describe('generateUniqueKey', () => {
    it('should use id if available', () => {
      const item = { id: 123, name: 'test' };
      expect(generateUniqueKey(item, 0)).toBe('item-123');
    });

    it('should use ID if id not available', () => {
      const item = { ID: 456, name: 'test' };
      expect(generateUniqueKey(item, 0)).toBe('item-456');
    });

    it('should use index with timestamp if no id/ID', () => {
      const item = { name: 'test' };
      const result = generateUniqueKey(item, 5);
      expect(result).toMatch(/^item-5-\d+$/);
    });

    it('should use custom prefix', () => {
      const item = { id: 123 };
      expect(generateUniqueKey(item, 0, 'customer')).toBe('customer-123');
    });
  });

  describe('safeGet', () => {
    const testObj = {
      level1: {
        level2: {
          value: 'found',
        },
        nullValue: null,
        undefinedValue: undefined,
      },
    };

    it('should get nested property', () => {
      expect(safeGet(testObj, 'level1.level2.value')).toBe('found');
    });

    it('should return default for non-existent path', () => {
      expect(safeGet(testObj, 'level1.nonexistent', 'default')).toBe('default');
    });

    it('should return default for null values', () => {
      expect(safeGet(testObj, 'level1.nullValue', 'default')).toBe('default');
    });

    it('should handle null object', () => {
      expect(safeGet(null, 'any.path', 'default')).toBe('default');
    });
  });

  describe('standardizeApiResponse', () => {
    it('should handle Laravel format response', () => {
      const response = {
        data: [{ id: 1 }, { id: 2 }],
        message: 'success',
      };
      const result = standardizeApiResponse(response);
      expect(result).toEqual({
        success: true,
        data: [{ id: 1 }, { id: 2 }],
        message: 'success',
        total: 2,
      });
    });

    it('should handle direct array response', () => {
      const response = [{ id: 1 }, { id: 2 }];
      const result = standardizeApiResponse(response);
      expect(result.success).toBe(true);
      expect(result.data).toEqual([{ id: 1 }, { id: 2 }]);
      expect(result.total).toBe(2);
    });

    it('should handle empty/null response', () => {
      const result = standardizeApiResponse(null);
      expect(result.success).toBe(false);
      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  describe('handleApiError', () => {
    it('should handle network errors', () => {
      const error = new Error('Network Error');
      const result = handleApiError(error);
      expect(result.success).toBe(false);
      expect(result.error).toBe('NETWORK_ERROR');
    });

    it('should handle 404 errors', () => {
      const error = {
        response: {
          status: 404,
          data: { message: 'Not found' },
        },
      };
      const result = handleApiError(error);
      expect(result.error).toBe('NOT_FOUND');
    });

    it('should handle 500 errors', () => {
      const error = {
        response: {
          status: 500,
          data: { message: 'Server error' },
        },
      };
      const result = handleApiError(error);
      expect(result.error).toBe('SERVER_ERROR');
    });
  });

  describe('safeFilter', () => {
    const testData = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
    ];

    it('should filter by search term in specified fields', () => {
      const result = safeFilter(testData, 'john', ['name', 'email']);
      expect(result).toHaveLength(2); // John Doe dan Bob Johnson
    });

    it('should return original data for empty search', () => {
      expect(safeFilter(testData, '', ['name'])).toEqual(testData);
      expect(safeFilter(testData, null, ['name'])).toEqual(testData);
    });

    it('should handle non-array input', () => {
      expect(safeFilter(null, 'test', ['name'])).toEqual(null);
      expect(safeFilter({}, 'test', ['name'])).toEqual({});
    });
  });
});

describe('Field Mapping', () => {
  describe('standardizeCustomer', () => {
    it('should map Laravel customer fields to standard format', () => {
      const laravelCustomer = {
        id: 1,
        kodecust: 'CUST001',
        namacust: 'John Doe',
        alamat: 'Jl. Test No. 123',
        telepon: '08123456789',
        email: 'john@test.com',
        status: 'aktif',
      };

      const result = standardizeCustomer(laravelCustomer);
      expect(result).toEqual({
        id: 1,
        kode: 'CUST001',
        nama: 'John Doe',
        alamat: 'Jl. Test No. 123',
        telepon: '08123456789',
        email: 'john@test.com',
        status: 'aktif',
      });
    });

    it('should handle alternative field names', () => {
      const altCustomer = {
        ID: 2,
        customer_code: 'CUST002',
        customer_name: 'Jane Smith',
        address: 'Jl. Alternative',
        phone: '08987654321',
        e_mail: 'jane@alt.com',
        is_active: 'aktif',
      };

      const result = standardizeCustomer(altCustomer);
      expect(result.kode).toBe('CUST002');
      expect(result.nama).toBe('Jane Smith');
    });

    it('should provide defaults for missing fields', () => {
      const incompleteCustomer = { id: 3 };
      const result = standardizeCustomer(incompleteCustomer);

      expect(result.id).toBe(3);
      expect(result.kode).toBe('');
      expect(result.nama).toBe('');
      expect(result.status).toBe('aktif');
    });
  });

  describe('standardizeBarang', () => {
    it('should map Laravel barang fields to standard format', () => {
      const laravelBarang = {
        id: 1,
        kode_barang: 'BRG001',
        nama_barang: 'Product Test',
        kategori: 'Electronics',
        modal: 100000,
        stok: 50,
        stokmin: 5, // Field yang sering missing
        satuan: 'PCS',
      };

      const result = standardizeBarang(laravelBarang);
      expect(result.stok_min).toBe(5);
      expect(result.kode_barang).toBe('BRG001');
    });

    it('should handle missing stok_min field', () => {
      const barangWithoutStokMin = {
        id: 2,
        kode_barang: 'BRG002',
        nama_barang: 'Test Product 2',
      };

      const result = standardizeBarang(barangWithoutStokMin);
      expect(result.stok_min).toBe(0); // Default value
    });
  });

  describe('mapField', () => {
    it('should find field from multiple possible names', () => {
      const data = {
        namacust: 'John Doe',
        other_field: 'other',
      };

      const result = mapField(data, customerFieldMap, 'nama');
      expect(result).toBe('John Doe');
    });

    it('should return default for non-existent field', () => {
      const data = { other_field: 'other' };
      const result = mapField(data, customerFieldMap, 'nama', 'Default Name');
      expect(result).toBe('Default Name');
    });
  });
});

describe('Integration Tests', () => {
  it('should handle complete MasterData workflow', async () => {
    // Mock API response
    const mockApiResponse = {
      data: [
        {
          id: 1,
          kodecust: 'CUST001',
          namacust: 'Test Customer',
          status: 'aktif',
        },
      ],
    };

    // Process through our pipeline
    const standardResponse = standardizeApiResponse(mockApiResponse);
    expect(standardResponse.success).toBe(true);

    const standardizedData = standardResponse.data.map(standardizeCustomer);
    expect(standardizedData[0].kode).toBe('CUST001');
    expect(standardizedData[0].nama).toBe('Test Customer');

    // Test filtering
    const filtered = safeFilter(standardizedData, 'test', ['nama']);
    expect(filtered).toHaveLength(1);

    // Test unique key generation
    const uniqueKey = generateUniqueKey(standardizedData[0], 0, 'customer');
    expect(uniqueKey).toBe('customer-1');
  });

  it('should handle error scenarios gracefully', () => {
    // Test error handling
    const networkError = new Error('Network failed');
    const errorResponse = handleApiError(networkError);
    expect(errorResponse.success).toBe(false);
    expect(errorResponse.data).toEqual([]);

    // Test invalid data standardization
    const invalidData = null;
    const standardized = standardizeCustomer(invalidData);
    expect(standardized).toBeNull();

    // Test safe array with invalid input
    const safeArray = ensureArray(invalidData);
    expect(safeArray).toEqual([]);
  });
});

// Performance Tests
describe('Performance Tests', () => {
  it('should handle large datasets efficiently', () => {
    const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      namacust: `Customer ${i}`,
      kodecust: `CUST${i.toString().padStart(3, '0')}`,
    }));

    const start = performance.now();

    // Test standardization performance
    const standardized = largeDataset.map(standardizeCustomer);

    // Test filtering performance
    const filtered = safeFilter(standardized, 'Customer 5', ['nama']);

    const end = performance.now();
    const duration = end - start;

    expect(duration).toBeLessThan(200); // Should complete within 200ms
    expect(standardized).toHaveLength(1000);
    expect(filtered.length).toBeGreaterThan(0);
  });
});
