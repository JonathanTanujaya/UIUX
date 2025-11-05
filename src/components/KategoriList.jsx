import { useState } from 'react';
import DataTable from './common/DataTable';
import { useDataFetch } from '../hooks/useDataFetch';
import { kategoriService } from '../config/apiService';
import { useConfirmDialog } from './common/LoadingComponents';

function KategoriList({ onEdit, onRefresh }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKategori, setEditingKategori] = useState(null);
  const [formData, setFormData] = useState({
    kodekategori: '',
    namakategori: '',
    keterangan: ''
  });

  const {
    data: kategori,
    loading,
    refresh,
  } = useDataFetch(() => kategoriService.getAll(), [onRefresh], {
    errorMessage: 'Gagal memuat data kategori',
  });

  const confirm = useConfirmDialog();

  // Open modal for adding new kategori
  const handleAdd = () => {
    setEditingKategori(null);
    setFormData({
      kodekategori: '',
      namakategori: '',
      keterangan: ''
    });
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleEdit = (item) => {
    setEditingKategori(item);
    setFormData({
      kodekategori: item.kodekategori || '',
      namakategori: item.namakategori || '',
      keterangan: item.keterangan || ''
    });
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingKategori(null);
    setFormData({
      kodekategori: '',
      namakategori: '',
      keterangan: ''
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingKategori) {
        // Update existing kategori
        await kategoriService.update(editingKategori.id, formData);
      } else {
        // Create new kategori
        await kategoriService.create(formData);
      }
      
      handleCloseModal();
      refresh();
      
      // Show success message (you can add a toast notification here)
      alert(editingKategori ? 'Kategori berhasil diupdate!' : 'Kategori berhasil ditambahkan!');
    } catch (error) {
      console.error('Error saving kategori:', error);
      alert('Gagal menyimpan kategori: ' + (error.message || 'Unknown error'));
    }
  };

  const handleDelete = async item => {
    const confirmed = await confirm({
      title: 'Hapus Kategori',
      message: `Apakah Anda yakin ingin menghapus kategori "${item.namakategori}"?`,
      confirmText: 'Hapus',
      confirmButtonClass: 'btn btn-danger',
    });

    if (confirmed) {
      // Implementasi delete jika diperlukan
      // await deleteOperation(item.kodedivisi, item.kodekategori);
    }
  };

  const columns = [
    {
      header: 'Kode Divisi',
      accessor: 'kodedivisi',
      className: 'text-center',
    },
    {
      header: 'Kode Kategori',
      accessor: 'kodekategori',
      className: 'font-monospace',
    },
    {
      header: 'Nama Kategori',
      accessor: 'namakategori',
      className: 'text-start',
    },
    {
      header: 'Keterangan',
      accessor: 'keterangan',
      render: value => value || '-',
      className: 'text-start',
    },
  ];

  const actions = [
    {
      icon: '✏️',
      onClick: handleEdit,
      className: 'p-1 hover:bg-blue-100 rounded transition-colors',
      show: true,
    },
    {
      icon: '🗑️',
      onClick: handleDelete,
      className: 'p-1 hover:bg-red-100 rounded transition-colors',
      show: true,
    },
  ];

  return (
    <div>
      {/* Add Button */}
      <div className="mb-4">
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          ➕ Tambah Kategori
        </button>
      </div>

      {/* Data Table */}
      <DataTable
        title="Daftar Kategori"
        data={kategori || []}
        columns={columns}
        actions={actions}
        loading={loading}
        onRefresh={refresh}
        searchable={true}
        searchFields={['kodekategori', 'namakategori', 'keterangan']}
        keyField="id"
      />

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            {/* Modal Header */}
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingKategori ? '✏️ Edit Kategori' : '➕ Tambah Kategori Baru'}
              </h2>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit}>
              <div className="px-6 py-4 space-y-4">
                {/* Kode Kategori */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kode Kategori <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="kodekategori"
                    value={formData.kodekategori}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: KT001"
                    required
                    disabled={!!editingKategori}
                  />
                </div>

                {/* Nama Kategori */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Kategori <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="namakategori"
                    value={formData.namakategori}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: Elektronik"
                    required
                  />
                </div>

                {/* Keterangan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Keterangan
                  </label>
                  <textarea
                    name="keterangan"
                    value={formData.keterangan}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Keterangan opsional..."
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  {editingKategori ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default KategoriList;
