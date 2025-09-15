import React, { useState, useEffect } from 'react';
import '../../design-system.css';

const PembelianReport = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    supplier: '',
    dateFrom: '',
    dateTo: '',
  });

  useEffect(() => {
    fetchPembelian();
  }, []);

  const fetchPembelian = async () => {
    try {
      setLoading(true);
      // Sample data
      const sampleData = [
        {
          id: 1,
          tanggal: '2025-01-15',
          no_po: 'PO-001',
          supplier: 'PT Supplier Motor',
          total: 5500000,
          status: 'Completed',
        },
        {
          id: 2,
          tanggal: '2025-01-10',
          no_po: 'PO-002',
          supplier: 'CV Parts Indonesia',
          total: 3200000,
          status: 'Pending',
        },
      ];
      setData(sampleData);
    } catch (error) {
      console.error('Error fetching pembelian:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = e => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
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
      <div className="card mb-4">
        <div className="card-header">
          <h3 className="card-title">Filter</h3>
        </div>
        <div className="card-body">
          <div className="form-grid grid-cols-3">
            <div className="form-group">
              <label className="form-label">Supplier</label>
              <select
                name="supplier"
                value={filters.supplier}
                onChange={handleFilterChange}
                className="form-control"
              >
                <option value="">Semua Supplier</option>
                <option value="PT Supplier Motor">PT Supplier Motor</option>
                <option value="CV Parts Indonesia">CV Parts Indonesia</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Tanggal Dari</label>
              <input
                type="date"
                name="dateFrom"
                value={filters.dateFrom}
                onChange={handleFilterChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Tanggal Sampai</label>
              <input
                type="date"
                name="dateTo"
                value={filters.dateTo}
                onChange={handleFilterChange}
                className="form-control"
              />
            </div>
          </div>
          <div className="form-actions">
            <button className="btn btn-primary" onClick={fetchPembelian}>
              Apply Filter
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setFilters({ supplier: '', dateFrom: '', dateTo: '' })}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>No. PO</th>
                  <th>Supplier</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map(item => (
                  <tr key={item.id}>
                    <td>{new Date(item.tanggal).toLocaleDateString('id-ID')}</td>
                    <td>{item.no_po}</td>
                    <td>{item.supplier}</td>
                    <td className="text-right">Rp {item.total.toLocaleString()}</td>
                    <td>
                      <span
                        className={`badge ${item.status === 'Completed' ? 'badge-success' : 'badge-warning'}`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PembelianReport;
