// Mock Data Service - No Backend Required
// This service provides dummy data for demo purposes

// Mock delay to simulate API calls
const mockDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Dummy data
const mockData = {
  categories: [
    {
      id: 1,
      kode_kategori: 'KAT001',
      nama_kategori: 'Elektronik',
      status: 'aktif',
      created_at: '2024-01-15',
    },
    {
      id: 2,
      kode_kategori: 'KAT002',
      nama_kategori: 'Furniture',
      status: 'aktif',
      created_at: '2024-01-16',
    },
    {
      id: 3,
      kode_kategori: 'KAT003',
      nama_kategori: 'Alat Tulis',
      status: 'aktif',
      created_at: '2024-01-17',
    },
    {
      id: 4,
      kode_kategori: 'KAT004',
      nama_kategori: 'Komputer',
      status: 'aktif',
      created_at: '2024-01-18',
    },
    {
      id: 5,
      kode_kategori: 'KAT005',
      nama_kategori: 'Peralatan',
      status: 'nonaktif',
      created_at: '2024-01-19',
    },
  ],

  customers: [
    {
      id: 1,
      kode_customer: 'CUST001',
      nama: 'PT. Maju Jaya',
      alamat: 'Jakarta Selatan',
      telepon: '021-12345678',
      email: 'info@majujaya.com',
      status: 'aktif',
    },
    {
      id: 2,
      kode_customer: 'CUST002',
      nama: 'CV. Berkah Sejahtera',
      alamat: 'Bandung',
      telepon: '022-87654321',
      email: 'admin@berkah.com',
      status: 'aktif',
    },
    {
      id: 3,
      kode_customer: 'CUST003',
      nama: 'Toko Sumber Rezeki',
      alamat: 'Surabaya',
      telepon: '031-11111111',
      email: 'sumberrezeki@gmail.com',
      status: 'aktif',
    },
    {
      id: 4,
      kode_customer: 'CUST004',
      nama: 'UD. Mitra Usaha',
      alamat: 'Medan',
      telepon: '061-22222222',
      email: 'mitra@usaha.co.id',
      status: 'aktif',
    },
    {
      id: 5,
      kode_customer: 'CUST005',
      nama: 'PT. Global Trading',
      alamat: 'Yogyakarta',
      telepon: '0274-333333',
      email: 'global@trading.com',
      status: 'nonaktif',
    },
  ],

  suppliers: [
    {
      id: 1,
      kode_supplier: 'SUP001',
      nama: 'PT. Supplier Utama',
      alamat: 'Jakarta Pusat',
      telepon: '021-99999999',
      email: 'supplier@utama.com',
      status: 'aktif',
    },
    {
      id: 2,
      kode_supplier: 'SUP002',
      nama: 'CV. Distributor Jaya',
      alamat: 'Tangerang',
      telepon: '021-88888888',
      email: 'distributor@jaya.com',
      status: 'aktif',
    },
    {
      id: 3,
      kode_supplier: 'SUP003',
      nama: 'Toko Grosir Murah',
      alamat: 'Bekasi',
      telepon: '021-77777777',
      email: 'grosir@murah.com',
      status: 'aktif',
    },
    {
      id: 4,
      kode_supplier: 'SUP004',
      nama: 'PT. Import Export',
      alamat: 'Jakarta Utara',
      telepon: '021-66666666',
      email: 'import@export.com',
      status: 'aktif',
    },
  ],

  barang: [
    {
      id: 1,
      kode_barang: 'BRG001',
      nama_barang: 'Laptop Dell Inspiron',
      kategori: 'Elektronik',
      harga: 8500000,
      stok: 25,
      unit: 'PCS',
      status: 'aktif',
    },
    {
      id: 2,
      kode_barang: 'BRG002',
      nama_barang: 'Meja Kantor Kayu',
      kategori: 'Furniture',
      harga: 1250000,
      stok: 15,
      unit: 'PCS',
      status: 'aktif',
    },
    {
      id: 3,
      kode_barang: 'BRG003',
      nama_barang: 'Printer HP LaserJet',
      kategori: 'Elektronik',
      harga: 3500000,
      stok: 10,
      unit: 'PCS',
      status: 'aktif',
    },
    {
      id: 4,
      kode_barang: 'BRG004',
      nama_barang: 'Kursi Ergonomis',
      kategori: 'Furniture',
      harga: 950000,
      stok: 20,
      unit: 'PCS',
      status: 'aktif',
    },
    {
      id: 5,
      kode_barang: 'BRG005',
      nama_barang: 'Monitor Samsung 24"',
      kategori: 'Elektronik',
      harga: 2750000,
      stok: 8,
      unit: 'PCS',
      status: 'aktif',
    },
    {
      id: 6,
      kode_barang: 'BRG006',
      nama_barang: 'Keyboard Mechanical',
      kategori: 'Komputer',
      harga: 850000,
      stok: 30,
      unit: 'PCS',
      status: 'aktif',
    },
    {
      id: 7,
      kode_barang: 'BRG007',
      nama_barang: 'Mouse Wireless',
      kategori: 'Komputer',
      harga: 250000,
      stok: 50,
      unit: 'PCS',
      status: 'aktif',
    },
  ],

  invoices: [
    {
      id: 1,
      no_invoice: 'INV-2024-001',
      customer: 'PT. Maju Jaya',
      tanggal: '2024-08-01',
      total: 15750000,
      status: 'lunas',
    },
    {
      id: 2,
      no_invoice: 'INV-2024-002',
      customer: 'CV. Berkah Sejahtera',
      tanggal: '2024-08-02',
      total: 8500000,
      status: 'pending',
    },
    {
      id: 3,
      no_invoice: 'INV-2024-003',
      customer: 'Toko Sumber Rezeki',
      tanggal: '2024-08-03',
      total: 5250000,
      status: 'lunas',
    },
    {
      id: 4,
      no_invoice: 'INV-2024-004',
      customer: 'UD. Mitra Usaha',
      tanggal: '2024-08-04',
      total: 12350000,
      status: 'pending',
    },
    {
      id: 5,
      no_invoice: 'INV-2024-005',
      customer: 'PT. Global Trading',
      tanggal: '2024-08-05',
      total: 3750000,
      status: 'lunas',
    },
  ],

  sales: [
    {
      id: 1,
      kode_sales: 'SLS001',
      nama: 'Ahmad Wijaya',
      alamat: 'Jakarta',
      telepon: '0812-1111-1111',
      email: 'ahmad@company.com',
      status: 'aktif',
    },
    {
      id: 2,
      kode_sales: 'SLS002',
      nama: 'Siti Nurhaliza',
      alamat: 'Bandung',
      telepon: '0813-2222-2222',
      email: 'siti@company.com',
      status: 'aktif',
    },
    {
      id: 3,
      kode_sales: 'SLS003',
      nama: 'Budi Santoso',
      alamat: 'Surabaya',
      telepon: '0814-3333-3333',
      email: 'budi@company.com',
      status: 'aktif',
    },
    {
      id: 4,
      kode_sales: 'SLS004',
      nama: 'Diana Putri',
      alamat: 'Medan',
      telepon: '0815-4444-4444',
      email: 'diana@company.com',
      status: 'nonaktif',
    },
  ],
};

// Mock API Service
class MockAPIService {
  constructor(endpoint) {
    this.endpoint = endpoint;
    this.dataKey = endpoint.replace('/test/', '').replace('/', '');
  }

  async getAll() {
    await mockDelay();
    const data = mockData[this.dataKey] || [];
    console.log(`✅ Mock API: GET ${this.endpoint} - ${data.length} items`);
    return {
      success: true,
      data: data,
      message: 'Data retrieved successfully',
    };
  }

  async getById(id) {
    await mockDelay();
    const data = mockData[this.dataKey] || [];
    const item = data.find(item => item.id === parseInt(id));
    console.log(`✅ Mock API: GET ${this.endpoint}/${id}`, item);
    return {
      success: true,
      data: item,
      message: item ? 'Item found' : 'Item not found',
    };
  }

  async create(newData) {
    await mockDelay();
    const data = mockData[this.dataKey] || [];
    const newItem = {
      id: Math.max(...data.map(item => item.id), 0) + 1,
      ...newData,
      created_at: new Date().toISOString(),
      status: 'aktif',
    };

    mockData[this.dataKey].push(newItem);
    console.log(`✅ Mock API: POST ${this.endpoint}`, newItem);
    return {
      success: true,
      data: newItem,
      message: 'Item created successfully',
    };
  }

  async update(id, updateData) {
    await mockDelay();
    const data = mockData[this.dataKey] || [];
    const index = data.findIndex(item => item.id === parseInt(id));

    if (index !== -1) {
      mockData[this.dataKey][index] = {
        ...mockData[this.dataKey][index],
        ...updateData,
        updated_at: new Date().toISOString(),
      };
      console.log(`✅ Mock API: PUT ${this.endpoint}/${id}`, mockData[this.dataKey][index]);
      return {
        success: true,
        data: mockData[this.dataKey][index],
        message: 'Item updated successfully',
      };
    }

    return {
      success: false,
      data: null,
      message: 'Item not found',
    };
  }

  async delete(id) {
    await mockDelay();
    const data = mockData[this.dataKey] || [];
    const index = data.findIndex(item => item.id === parseInt(id));

    if (index !== -1) {
      const deletedItem = mockData[this.dataKey].splice(index, 1)[0];
      console.log(`✅ Mock API: DELETE ${this.endpoint}/${id}`, deletedItem);
      return {
        success: true,
        data: deletedItem,
        message: 'Item deleted successfully',
      };
    }

    return {
      success: false,
      data: null,
      message: 'Item not found',
    };
  }
}

// Create mock API services
export const categoriesAPI = new MockAPIService('categories');
export const customersAPI = new MockAPIService('customers');
export const suppliersAPI = new MockAPIService('suppliers');
export const salesAPI = new MockAPIService('sales');
export const barangAPI = new MockAPIService('barang');
export const invoicesAPI = new MockAPIService('invoices');

// Mock auth API
export const authAPI = {
  login: async credentials => {
    await mockDelay(1000);
    console.log('✅ Mock Login:', credentials);

    if (credentials.email === 'admin@stockflow.com' && credentials.password === 'password123') {
      return {
        success: true,
        data: {
          token: 'mock-jwt-token-12345',
          user: {
            id: 1,
            name: 'Admin User',
            email: 'admin@stockflow.com',
            role: 'administrator',
          },
        },
        message: 'Login successful',
      };
    }

    return {
      success: false,
      message: 'Invalid credentials',
    };
  },

  logout: async () => {
    await mockDelay();
    console.log('✅ Mock Logout');
    return {
      success: true,
      message: 'Logout successful',
    };
  },

  me: async () => {
    await mockDelay();
    return {
      success: true,
      data: {
        id: 1,
        name: 'Admin User',
        email: 'admin@stockflow.com',
        role: 'administrator',
      },
      message: 'User data retrieved',
    };
  },
};

export default {
  categoriesAPI,
  customersAPI,
  suppliersAPI,
  salesAPI,
  barangAPI,
  invoicesAPI,
  authAPI,
};
