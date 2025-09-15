import React, { useState } from 'react';
import SparepartList from '../../../components/SparepartList.jsx';
import { sparepartService } from '../../../config/apiService.js';

const MasterSparepart = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [formData, setFormData] = useState({
    kodeDivisi: '',
    kodeBarang: '',
    tglMasuk: '',
    modal: '',
    stok: '',
  });

  const resetForm = () => {
    setFormData({
      kodeDivisi: '',
      kodeBarang: '',
      tglMasuk: '',
      modal: '',
      stok: '',
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = item => {
    setFormData({
      kodeDivisi: item.kodeDivisi,
      kodeBarang: item.kodeBarang,
      tglMasuk: item.tglMasuk ? item.tglMasuk.split(' ')[0] : '', // Extract date part
      modal: item.modal,
      stok: item.stok,
    });
    setEditingItem(item);
    setShowForm(true);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingItem) {
        // Update existing sparepart
        await sparepartService.update(
          editingItem.kodeDivisi,
          editingItem.kodeBarang,
          editingItem.id,
          {
            tglMasuk: formData.tglMasuk,
            modal: parseFloat(formData.modal),
            stok: parseInt(formData.stok),
          }
        );
      } else {
        // Create new sparepart
        await sparepartService.create({
          kodeDivisi: formData.kodeDivisi,
          kodeBarang: formData.kodeBarang,
          tglMasuk: formData.tglMasuk,
          modal: parseFloat(formData.modal),
          stok: parseInt(formData.stok),
        });
      }

      alert(editingItem ? 'Sparepart berhasil diperbarui' : 'Sparepart berhasil ditambahkan');
      resetForm();
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Error saving sparepart:', error);
      alert('Gagal menyimpan sparepart: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Master Sparepart</h2>
            <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Tutup Form' : 'Tambah Sparepart'}
            </button>
          </div>

          {showForm && (
            <div className="card mb-4">
              <div className="card-body">
                <h3 className="card-title">
                  {editingItem ? 'Edit Sparepart' : 'Tambah Sparepart'}
                </h3>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="kodeDivisi" className="form-label">
                          Kode Divisi
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="kodeDivisi"
                          name="kodeDivisi"
                          value={formData.kodeDivisi}
                          onChange={handleInputChange}
                          required
                          disabled={editingItem} // Can't change divisi when editing
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="kodeBarang" className="form-label">
                          Kode Barang
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="kodeBarang"
                          name="kodeBarang"
                          value={formData.kodeBarang}
                          onChange={handleInputChange}
                          required
                          disabled={editingItem} // Can't change barang when editing
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label htmlFor="tglMasuk" className="form-label">
                          Tanggal Masuk
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          id="tglMasuk"
                          name="tglMasuk"
                          value={formData.tglMasuk}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label htmlFor="modal" className="form-label">
                          Modal
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          className="form-control"
                          id="modal"
                          name="modal"
                          value={formData.modal}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="mb-3">
                        <label htmlFor="stok" className="form-label">
                          Stok
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="stok"
                          name="stok"
                          value={formData.stok}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-success">
                      {editingItem ? 'Update' : 'Simpan'}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={resetForm}>
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Data Sparepart</h3>
              <SparepartList onEdit={handleEdit} onRefresh={refreshKey} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterSparepart;
