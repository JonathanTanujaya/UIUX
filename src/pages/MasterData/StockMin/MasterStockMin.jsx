import React, { useState, useEffect } from 'react';
import { stockMinAPI } from '../../../services/api';
import '../../../design-system.css';

const MasterStockMin = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    kategori: '',
    status: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await stockMinAPI.getAll();
      const dataArray = Array.isArray(response.data) ? response.data : [];
      setData(dataArray);
    } catch (error) {
      console.error('Error fetching stock min data:', error);
      // Fallback to sample data if API fails
      const sampleData = [
        {
          id: 1,
          kode_barang: 'BRG001',
          nama_barang: 'Motor Oil 10W-40',
          kategori: 'Oli & Pelumas',
          stok_saat_ini: 120,
          stok_minimum: 10,
          status: 'Aman',
          selisih: 110,
        },
        {
          id: 2,
          kode_barang: 'BRG002',
          nama_barang: 'Spark Plug NGK',
          kategori: 'Kelistrikan',
          stok_saat_ini: 5,
          stok_minimum: 20,
          status: 'Kurang',
          selisih: -15,
        },
        {
          id: 3,
          kode_barang: 'BRG003',
          nama_barang: 'Air Filter',
          kategori: 'Mesin',
          stok_saat_ini: 15,
          stok_minimum: 15,
          status: 'Minimum',
          selisih: 0,
        },
      ];
      setData(sampleData);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = e => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredData = Array.isArray(data)
    ? data.filter(item => {
        return (
          (!filters.kategori || item.kategori === filters.kategori) &&
          (!filters.status || item.status === filters.status)
        );
      })
    : [];

  const updateStockMin = async (id, newStockMin) => {
    try {
      // Update via API
      const item = Array.isArray(data) ? data.find(d => d.id === id) : null;
      if (item) {
        await stockMinAPI.update(id, {
          ...item,
          stok_minimum: newStockMin,
        });
      }

      // Update local state
      setData(prev =>
        prev.map(item => {
          if (item.id === id) {
            const updatedItem = { ...item, stok_minimum: newStockMin };
            updatedItem.selisih = updatedItem.stok_saat_ini - newStockMin;
            if (updatedItem.selisih < 0) {
              updatedItem.status = 'Kurang';
            } else if (updatedItem.selisih === 0) {
              updatedItem.status = 'Minimum';
            } else {
              updatedItem.status = 'Aman';
            }
            return updatedItem;
          }
          return item;
        })
      );

      alert('Stock minimum berhasil diupdate!');
    } catch (error) {
      console.error('Error updating stock min:', error);
      alert('Error updating stock minimum');
    }
  };

  const getStatusBadge = status => {
    switch (status) {
      case 'Aman':
        return <span className="badge badge-success">Aman</span>;
      case 'Minimum':
        return <span className="badge badge-warning">Minimum</span>;
      case 'Kurang':
        return <span className="badge badge-danger">Kurang</span>;
      default:
        return <span className="badge badge-secondary">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Summary Cards */}
      <div className="form-grid grid-cols-4 mb-4">
        <div className="summary-box">
          <div className="summary-label">Total Barang</div>
          <div className="summary-value">{data.length}</div>
        </div>
        <div className="summary-box">
          <div className="summary-label">Status Aman</div>
          <div className="summary-value text-success">
            {data.filter(item => item.status === 'Aman').length}
          </div>
        </div>
        <div className="summary-box">
          <div className="summary-label">Status Minimum</div>
          <div className="summary-value text-warning">
            {data.filter(item => item.status === 'Minimum').length}
          </div>
        </div>
        <div className="summary-box">
          <div className="summary-label">Status Kurang</div>
          <div className="summary-value text-danger">
            {data.filter(item => item.status === 'Kurang').length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-header">
          <h3 className="card-title">Filter</h3>
        </div>
        <div className="card-body">
          <div className="form-grid grid-cols-2">
            <div className="form-group">
              <label className="form-label">Kategori</label>
              <select
                name="kategori"
                value={filters.kategori}
                onChange={handleFilterChange}
                className="form-control"
              >
                <option value="">Semua Kategori</option>
                <option value="Oli & Pelumas">Oli & Pelumas</option>
                <option value="Kelistrikan">Kelistrikan</option>
                <option value="Mesin">Mesin</option>
                <option value="Body">Body</option>
                <option value="Aksesoris">Aksesoris</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="form-control"
              >
                <option value="">Semua Status</option>
                <option value="Aman">Aman</option>
                <option value="Minimum">Minimum</option>
                <option value="Kurang">Kurang</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Data Stock Minimum</h3>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Kode Barang</th>
                  <th>Nama Barang</th>
                  <th>Kategori</th>
                  <th>Stok Saat Ini</th>
                  <th>Stok Minimum</th>
                  <th>Selisih</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map(item => (
                  <tr key={item.id}>
                    <td>{item.kode_barang}</td>
                    <td>{item.nama_barang}</td>
                    <td>{item.kategori}</td>
                    <td className="text-right">{item.stok_saat_ini.toLocaleString()}</td>
                    <td>
                      <input
                        type="number"
                        value={item.stok_minimum}
                        onChange={e => {
                          const newValue = parseInt(e.target.value) || 0;
                          updateStockMin(item.id, newValue);
                        }}
                        className="form-control form-control-sm"
                        style={{ width: '80px' }}
                        min="0"
                      />
                    </td>
                    <td
                      className={`text-right ${item.selisih < 0 ? 'text-danger' : item.selisih === 0 ? 'text-warning' : 'text-success'}`}
                    >
                      {item.selisih > 0 ? '+' : ''}
                      {item.selisih}
                    </td>
                    <td>{getStatusBadge(item.status)}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => {
                          // TODO: Open reorder form
                          alert('Fitur reorder akan segera tersedia');
                        }}
                        disabled={item.status === 'Aman'}
                      >
                        Reorder
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Alert for critical items */}
      {data.filter(item => item.status === 'Kurang').length > 0 && (
        <div className="alert alert-warning mt-4">
          <strong>Perhatian!</strong> Ada {data.filter(item => item.status === 'Kurang').length}{' '}
          barang dengan stok di bawah minimum. Segera lakukan pemesanan untuk menghindari kehabisan
          stok.
        </div>
      )}
    </div>
  );
};

export default MasterStockMin;
