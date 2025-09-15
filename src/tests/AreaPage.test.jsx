import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { toast } from 'react-toastify';
import AreaPage from '../components/AreaPage';
import { areaService } from '../config/apiService';

// Mock react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock apiService
vi.mock('../config/apiService', () => ({
  areaService: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('AreaPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock successful API responses
    areaService.getAll.mockResolvedValue({
      success: true,
      data: [
        {
          kodedivisi: 'DIV001',
          kodearea: 'AREA001',
          area: 'Jakarta Pusat',
          status: true,
        },
        {
          kodedivisi: 'DIV001',
          kodearea: 'AREA002',
          area: 'Jakarta Selatan',
          status: false,
        },
      ],
      message: 'Data berhasil dimuat',
    });
  });

  it('should render AreaPage with title and add button', async () => {
    render(<AreaPage />);

    expect(screen.getByText('Manajemen Area')).toBeInTheDocument();
    expect(screen.getByText('Tambah Area Baru')).toBeInTheDocument();

    // Wait for areas to load
    await waitFor(() => {
      expect(screen.getByText('Jakarta Pusat')).toBeInTheDocument();
    });
  });

  it('should show form when add button is clicked', async () => {
    render(<AreaPage />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Tambah Area Baru')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Tambah Area Baru'));

    expect(screen.getByText('Kode Divisi:')).toBeInTheDocument();
    expect(screen.getByText('Kode Area:')).toBeInTheDocument();
    expect(screen.getByText('Area:')).toBeInTheDocument();
  });

  it('should handle successful area creation', async () => {
    areaService.create.mockResolvedValue({
      success: true,
      message: 'Area berhasil ditambahkan',
    });

    render(<AreaPage />);

    // Wait for initial load and click add
    await waitFor(() => {
      expect(screen.getByText('Tambah Area Baru')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Tambah Area Baru'));

    // Fill form
    fireEvent.change(screen.getByDisplayValue(''), { target: { value: 'DIV003' } });
    fireEvent.change(screen.getAllByDisplayValue('')[1], { target: { value: 'AREA003' } });
    fireEvent.change(screen.getAllByDisplayValue('')[2], { target: { value: 'Bandung' } });

    // Submit form
    fireEvent.click(screen.getByText('Simpan'));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Area berhasil ditambahkan');
    });
  });

  it('should handle API errors gracefully', async () => {
    areaService.getAll.mockRejectedValue(new Error('Network error'));

    render(<AreaPage />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Gagal memuat data area');
    });
  });

  it('should show retry button when there is an error', async () => {
    areaService.getAll.mockRejectedValue(new Error('Network error'));

    render(<AreaPage />);

    await waitFor(() => {
      expect(screen.getByText('Coba Lagi')).toBeInTheDocument();
    });
  });

  it('should validate required fields', async () => {
    render(<AreaPage />);

    // Wait for initial load and click add
    await waitFor(() => {
      expect(screen.getByText('Tambah Area Baru')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Tambah Area Baru'));

    // Try to submit without filling required fields
    fireEvent.click(screen.getByText('Simpan'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Mohon lengkapi semua field yang diperlukan');
    });
  });

  it('should show loading state during operations', async () => {
    // Mock slow API response
    areaService.delete.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000))
    );

    render(<AreaPage />);

    await waitFor(() => {
      expect(screen.getByText('Jakarta Pusat')).toBeInTheDocument();
    });

    // Mock confirm dialog
    window.confirm = vi.fn(() => true);

    fireEvent.click(screen.getAllByText('Hapus')[0]);

    await waitFor(() => {
      expect(screen.getByText('Menghapus...')).toBeInTheDocument();
    });
  });
});
