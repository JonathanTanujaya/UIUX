import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const ReturPembelianForm = () => {
  // State for form data based on backend structure
  const [formData, setFormData] = useState({
    header: {
      returnDate: new Date().toISOString().split('T')[0],
      supplier_id: '',
      originalPurchase: '',
      notes: '',
    },
    items: [],
  });

  // State for dropdowns and search
  const [suppliers, setSuppliers] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [purchaseDetails, setPurchaseDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search states
  const [supplierSearch, setSupplierSearch] = useState('');
  const [purchaseSearch, setPurchaseSearch] = useState('');
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [showPurchaseDropdown, setShowPurchaseDropdown] = useState(false);

  // Selected items for display
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  // Initialize component
  useEffect(() => {
    fetchSuppliers();
    fetchPurchases();
  }, []);

  // API calls
  const fetchSuppliers = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/suppliers');
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        setSuppliers(data.data);
      } else {
        setSuppliers([]);
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      toast.error('Failed to load suppliers');
      setSuppliers([]);
    }
  };

  const fetchPurchases = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/return-purchases/purchases');
      const data = await response.json();
      if (data.status === 'success' && Array.isArray(data.data)) {
        setPurchases(data.data);
      } else {
        setPurchases([]);
      }
    } catch (error) {
      console.error('Error fetching purchases:', error);
      toast.error('Failed to load purchases');
      setPurchases([]);
    }
  };

  const fetchPurchaseDetails = async purchaseId => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/return-purchases/purchase-details/${purchaseId}`
      );
      const data = await response.json();
      if (data.status === 'success') {
        setPurchaseDetails(data.data);
        // Auto-populate items with purchase details
        const items = data.data.map(detail => ({
          code: detail.code,
          name: detail.name,
          qty_purchased: detail.qty_purchased,
          price: detail.price,
          qty_return: 0,
          reason: '',
        }));
        setFormData(prev => ({ ...prev, items }));
      }
    } catch (error) {
      console.error('Error fetching purchase details:', error);
    }
  };

  const handleSupplierSelect = supplier => {
    setFormData(prev => ({
      ...prev,
      header: { ...prev.header, supplier_id: supplier.kodesupplier },
    }));
    setSupplierSearch(supplier.namasupplier + ' (' + supplier.kodesupplier + ')');
    // Fetch purchases for this supplier
    fetchPurchases();
  };

  const handlePurchaseSelect = purchase => {
    setFormData(prev => ({
      ...prev,
      header: { ...prev.header, originalPurchase: purchase.purchase_number },
    }));
    setPurchaseSearch(purchase.display_text);
    // Fetch purchase details
    fetchPurchaseDetails(purchase.purchase_number);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      // Filter only items with qty_return > 0
      const itemsToReturn = formData.items.filter(item => item.qty_return > 0 && item.reason);

      if (itemsToReturn.length === 0) {
        toast.error('Please select at least one item to return');
        return;
      }

      const submitData = {
        header: formData.header,
        items: itemsToReturn,
      };

      const response = await fetch('http://localhost:8000/api/return-purchases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (data.status === 'success') {
        toast.success('Return created successfully!');
        // Reset form
        setFormData({
          header: {
            returnDate: new Date().toISOString().split('T')[0],
            supplier_id: '',
            originalPurchase: '',
            notes: '',
          },
          items: [],
        });
        setSupplierSearch('');
        setPurchaseSearch('');
        setPurchaseDetails([]);
      } else {
        toast.error(data.message || 'Failed to create return');
      }
    } catch (error) {
      console.error('Error creating return:', error);
      toast.error('An error occurred while creating the return');
    } finally {
      setLoading(false);
    }
  };

  const filteredSuppliers = Array.isArray(suppliers) ? suppliers.filter(
    supplier => {
      if (!supplier) return false;
      const nama = supplier.namasupplier || supplier.nama || '';
      const kode = supplier.kodesupplier || supplier.kode || '';
      const searchTerm = (supplierSearch || '').toLowerCase();
      
      return nama.toLowerCase().includes(searchTerm) ||
             kode.toLowerCase().includes(searchTerm);
    }
  ) : [];

  const filteredPurchases = Array.isArray(purchases) ? purchases.filter(purchase => {
    if (!purchase) return false;
    const displayText = purchase.display_text || purchase.text || '';
    const searchTerm = (purchaseSearch || '').toLowerCase();
    
    return displayText.toLowerCase().includes(searchTerm);
  }) : [];

  return (
    <div className="container">
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          {/* Header Section */}
          <div className="form-section">
            <h3>Informasi Retur</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Tanggal Retur</label>
                <input
                  type="date"
                  value={formData.header.returnDate}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      header: { ...prev.header, returnDate: e.target.value },
                    }))
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Supplier</label>
                <div className="autocomplete-container">
                  <input
                    type="text"
                    value={supplierSearch}
                    onChange={e => setSupplierSearch(e.target.value)}
                    placeholder="Ketik nama atau kode supplier..."
                    className="autocomplete-input"
                  />
                  {supplierSearch && filteredSuppliers.length > 0 && (
                    <div className="autocomplete-dropdown">
                      {filteredSuppliers.slice(0, 10).map(supplier => (
                        <div
                          key={supplier.kodesupplier}
                          className="autocomplete-item"
                          onClick={() => handleSupplierSelect(supplier)}
                        >
                          <div className="autocomplete-item-main">{supplier.namasupplier}</div>
                          <div className="autocomplete-item-sub">
                            {supplier.kodesupplier} - {supplier.alamat}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Pembelian Asli</label>
                <div className="autocomplete-container">
                  <input
                    type="text"
                    value={purchaseSearch}
                    onChange={e => setPurchaseSearch(e.target.value)}
                    placeholder="Ketik nomor invoice atau pembelian..."
                    className="autocomplete-input"
                    disabled={!formData.header.supplier_id}
                  />
                  {purchaseSearch && filteredPurchases.length > 0 && (
                    <div className="autocomplete-dropdown">
                      {filteredPurchases.slice(0, 10).map(purchase => (
                        <div
                          key={purchase.id}
                          className="autocomplete-item"
                          onClick={() => handlePurchaseSelect(purchase)}
                        >
                          <div className="autocomplete-item-main">{purchase.invoice_number}</div>
                          <div className="autocomplete-item-sub">
                            {purchase.purchase_number} - {purchase.purchase_date}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group full-width">
                <label>Catatan</label>
                <textarea
                  value={formData.header.notes}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      header: { ...prev.header, notes: e.target.value },
                    }))
                  }
                  placeholder="Catatan retur..."
                  rows="3"
                />
              </div>
            </div>
          </div>

          {/* Items Section */}
          {purchaseDetails.length > 0 && (
            <div className="form-section">
              <h3>Item yang Diretur</h3>
              <div className="table-container">
                <table className="item-table">
                  <thead>
                    <tr>
                      <th>Kode Barang</th>
                      <th>Nama Barang</th>
                      <th>Qty Beli</th>
                      <th>Harga</th>
                      <th>Qty Retur</th>
                      <th>Alasan</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.code}</td>
                        <td>{item.name}</td>
                        <td>{item.qty_purchased}</td>
                        <td className="text-right">
                          {new Intl.NumberFormat('id-ID').format(item.price)}
                        </td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            max={item.qty_purchased}
                            value={item.qty_return}
                            onChange={e =>
                              handleItemChange(index, 'qty_return', parseFloat(e.target.value) || 0)
                            }
                            className="qty-input"
                          />
                        </td>
                        <td>
                          <select
                            value={item.reason}
                            onChange={e => handleItemChange(index, 'reason', e.target.value)}
                            className="reason-select"
                          >
                            <option value="">Pilih alasan...</option>
                            <option value="Barang Rusak">Barang Rusak</option>
                            <option value="Barang Salah">Barang Salah</option>
                            <option value="Tidak Sesuai Spesifikasi">
                              Tidak Sesuai Spesifikasi
                            </option>
                            <option value="Kelebihan Order">Kelebihan Order</option>
                            <option value="Lainnya">Lainnya</option>
                          </select>
                        </td>
                        <td className="text-right">
                          {new Intl.NumberFormat('id-ID').format(item.qty_return * item.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="submit"
              disabled={loading || formData.items.length === 0}
              className="btn-primary"
            >
              {loading ? 'Menyimpan...' : 'Simpan Retur'}
            </button>
            <button type="button" onClick={() => window.history.back()} className="btn-secondary">
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReturPembelianForm;
