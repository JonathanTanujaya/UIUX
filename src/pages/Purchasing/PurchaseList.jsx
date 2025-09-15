import React, { useState, useEffect } from 'react';
import { purchasesAPI, handleAPIResponse, handleAPIError } from '../../services/unifiedAPI';
import { toast } from 'react-toastify';

function PurchaseList() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('receiptDate');
  const [sortDir, setSortDir] = useState('desc');

  useEffect(() => {
    loadPurchases();
  }, []);

  const loadPurchases = async () => {
    setLoading(true);
    try {
      const response = await purchasesAPI.getAll();
      setPurchases(response.data?.data || []);
    } catch (error) {
      console.error('Failed to load purchases:', error);
      toast.error('Gagal memuat data pembelian');
    } finally {
      setLoading(false);
    }
  };

  const deletePurchase = async id => {
    if (!confirm('Yakin hapus pembelian ini?')) return;
    try {
      await purchasesAPI.delete(id);
      toast.success('Pembelian dihapus');
      loadPurchases();
    } catch (error) {
      toast.error('Gagal menghapus pembelian');
    }
  };

  const filteredPurchases = purchases
    .filter(
      p =>
        (p.invoice_number || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.supplier?.name || '').toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortField] || '';
      const bVal = b[sortField] || '';
      const comparison = aVal.toString().localeCompare(bVal.toString());
      return sortDir === 'asc' ? comparison : -comparison;
    });

  const format = val => new Intl.NumberFormat('id-ID').format(Number(val) || 0);

  if (loading) {
    return (
      <div className="page-content">
        <div className="loading-skeleton">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton-row" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="flex gap-3 items-center mb-6">
        <div className="search-container">
          <input
            type="text"
            placeholder="Cari invoice atau supplier..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
        <button
          onClick={() => (window.location.href = '/transactions/purchasing/form')}
          className="btn-primary"
        >
          Buat Pembelian
        </button>
      </div>

      <div className="content-body">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th className="w-32">
                  <button
                    onClick={() => {
                      setSortField('invoice_number');
                      setSortDir(
                        sortField === 'invoice_number' && sortDir === 'asc' ? 'desc' : 'asc'
                      );
                    }}
                    className="sort-header"
                  >
                    No Invoice {sortField === 'invoice_number' && (sortDir === 'asc' ? '↑' : '↓')}
                  </button>
                </th>
                <th className="w-24">
                  <button
                    onClick={() => {
                      setSortField('receiptDate');
                      setSortDir(sortField === 'receiptDate' && sortDir === 'asc' ? 'desc' : 'asc');
                    }}
                    className="sort-header"
                  >
                    Tgl Terima {sortField === 'receiptDate' && (sortDir === 'asc' ? '↑' : '↓')}
                  </button>
                </th>
                <th className="w-48">Supplier</th>
                <th className="w-24 text-right">Total</th>
                <th className="w-24 text-right">PPN</th>
                <th className="w-24 text-right">Grand Total</th>
                <th className="w-20">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredPurchases.map(purchase => (
                <tr key={purchase.id}>
                  <td className="mono">{purchase.invoice_number}</td>
                  <td>{new Date(purchase.receiptDate).toLocaleDateString('id-ID')}</td>
                  <td>
                    <div>
                      <div className="font-medium">{purchase.supplier?.name}</div>
                      <div className="text-xs text-gray-500">{purchase.supplier?.code}</div>
                    </div>
                  </td>
                  <td className="text-right">{format(purchase.total)}</td>
                  <td className="text-right">{format(purchase.tax)}</td>
                  <td className="text-right font-semibold">{format(purchase.grand_total)}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() =>
                          window.open(
                            `/transactions/purchasing/pembelian/print/${purchase.id}`,
                            '_blank'
                          )
                        }
                        className="btn-icon-sm"
                        title="Print"
                      >
                        🖨️
                      </button>
                      <button
                        onClick={() => deletePurchase(purchase.id)}
                        className="btn-icon-sm text-red-600"
                        title="Hapus"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPurchases.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-gray-400 py-8">
                    {search ? 'Tidak ada hasil pencarian' : 'Belum ada data pembelian'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <div className="table-info">
            Menampilkan {filteredPurchases.length} dari {purchases.length} pembelian
          </div>
        </div>
      </div>
    </div>
  );
}

export default PurchaseList;
