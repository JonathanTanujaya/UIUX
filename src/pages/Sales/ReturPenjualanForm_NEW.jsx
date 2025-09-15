import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const ReturPenjualanForm = () => {
  // State for form data
  const [formData, setFormData] = useState({
    header: {
      returnDate: new Date().toISOString().split('T')[0],
      customer_id: '',
      originalInvoice: '',
      notes: '',
    },
    items: [],
  });

  // State for dropdowns
  const [customers, setCustomers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search states
  const [customerSearch, setCustomerSearch] = useState('');
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [showInvoiceDropdown, setShowInvoiceDropdown] = useState(false);

  // Initialize component
  useEffect(() => {
    fetchCustomers();
    fetchInvoices();
  }, []);

  // API calls
  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/return-sales/customers');
      const data = await response.json();
      if (data.status === 'success') {
        setCustomers(data.data);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to load customers');
    }
  };

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/return-sales/invoices');
      const data = await response.json();
      if (data.status === 'success') {
        setInvoices(data.data);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast.error('Failed to load invoices');
    }
  };

  const fetchInvoiceDetails = async invoiceNumber => {
    try {
      setLoading(true);
      const response = await fetch(`/api/return-sales/invoice-details/${invoiceNumber}`);
      const data = await response.json();
      if (data.status === 'success') {
        const items = data.data.map(detail => ({
          code: detail.code,
          name: detail.name,
          qty_sold: detail.qty_sold,
          price: detail.price,
          qty_return: 0,
          reason: '',
        }));
        setFormData(prev => ({
          ...prev,
          items: items,
        }));
      }
    } catch (error) {
      console.error('Error fetching invoice details:', error);
      toast.error('Failed to load invoice details');
    } finally {
      setLoading(false);
    }
  };

  // Handle selections
  const handleCustomerSelect = customer => {
    setCustomerSearch(`${customer.code} - ${customer.name}`);
    setShowCustomerDropdown(false);
    setFormData(prev => ({
      ...prev,
      header: {
        ...prev.header,
        customer_id: customer.code,
      },
    }));

    // Reset invoice selection
    setInvoiceSearch('');
    setFormData(prev => ({
      ...prev,
      header: {
        ...prev.header,
        originalInvoice: '',
      },
      items: [],
    }));
  };

  const handleInvoiceSelect = invoice => {
    setInvoiceSearch(invoice.display_text);
    setShowInvoiceDropdown(false);
    setFormData(prev => ({
      ...prev,
      header: {
        ...prev.header,
        originalInvoice: invoice.invoice_number,
      },
    }));

    // Fetch invoice details
    fetchInvoiceDetails(invoice.invoice_number);
  };

  // Handle item changes
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    setFormData(prev => ({
      ...prev,
      items: updatedItems,
    }));
  };

  // Calculate total
  const calculateTotal = () => {
    return formData.items.reduce((total, item) => {
      return total + item.qty_return * item.price;
    }, 0);
  };

  // Filter functions
  const getFilteredCustomers = () => {
    return customers.filter(
      customer =>
        customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
        customer.code.toLowerCase().includes(customerSearch.toLowerCase())
    );
  };

  const getFilteredInvoices = () => {
    if (!formData.header.customer_id) return [];

    return invoices.filter(
      invoice =>
        invoice.customer_code === formData.header.customer_id &&
        (invoice.display_text.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
          invoice.invoice_number.toLowerCase().includes(invoiceSearch.toLowerCase()))
    );
  };

  // Handle form submission
  const handleSubmit = async e => {
    e.preventDefault();

    if (!formData.header.customer_id) {
      toast.error('Please select a customer');
      return;
    }

    if (!formData.header.originalInvoice) {
      toast.error('Please select an invoice');
      return;
    }

    const itemsToReturn = formData.items.filter(item => item.qty_return > 0);
    if (itemsToReturn.length === 0) {
      toast.error('Please specify quantities to return');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/return-sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          header: formData.header,
          items: itemsToReturn,
        }),
      });

      const result = await response.json();
      if (result.status === 'success') {
        toast.success('Sales return created successfully');
        window.location.href = '/transactions/sales';
      } else {
        toast.error(result.message || 'Failed to create return');
      }
    } catch (error) {
      console.error('Error creating return:', error);
      toast.error('Failed to create return');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="return-form">
        {/* Header Section */}
        <div className="form-section">
          <h3>Informasi Return</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Tanggal Return*</label>
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

            {/* Customer Search */}
            <div className="form-group">
              <label>Customer*</label>
              <div className="autocomplete-container">
                <input
                  type="text"
                  value={customerSearch}
                  onChange={e => {
                    setCustomerSearch(e.target.value);
                    setShowCustomerDropdown(true);
                  }}
                  onFocus={() => setShowCustomerDropdown(true)}
                  placeholder="Cari customer..."
                  className="autocomplete-input"
                />
                {showCustomerDropdown && (
                  <div className="autocomplete-dropdown">
                    {getFilteredCustomers().map(customer => (
                      <div
                        key={customer.code}
                        className="autocomplete-item"
                        onClick={() => handleCustomerSelect(customer)}
                      >
                        <strong>{customer.code}</strong> - {customer.name}
                        <div className="item-detail">{customer.address}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Invoice Search */}
            <div className="form-group">
              <label>Invoice Asal*</label>
              <div className="autocomplete-container">
                <input
                  type="text"
                  value={invoiceSearch}
                  onChange={e => {
                    setInvoiceSearch(e.target.value);
                    setShowInvoiceDropdown(true);
                  }}
                  onFocus={() => setShowInvoiceDropdown(true)}
                  placeholder="Cari invoice..."
                  className="autocomplete-input"
                  disabled={!formData.header.customer_id}
                />
                {showInvoiceDropdown && formData.header.customer_id && (
                  <div className="autocomplete-dropdown">
                    {getFilteredInvoices().map(invoice => (
                      <div
                        key={invoice.id}
                        className="autocomplete-item"
                        onClick={() => handleInvoiceSelect(invoice)}
                      >
                        <strong>{invoice.invoice_number}</strong>
                        <div className="item-detail">
                          Tanggal: {invoice.invoice_date} | Total: Rp{' '}
                          {invoice.total.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Keterangan</label>
              <textarea
                value={formData.header.notes}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    header: { ...prev.header, notes: e.target.value },
                  }))
                }
                placeholder="Keterangan return..."
                rows="3"
              />
            </div>
          </div>
        </div>

        {/* Items Section */}
        {formData.items.length > 0 && (
          <div className="form-section">
            <h3>Detail Barang Return</h3>
            <div className="items-table">
              <table>
                <thead>
                  <tr>
                    <th>Kode Barang</th>
                    <th>Nama Barang</th>
                    <th>Qty Terjual</th>
                    <th>Harga</th>
                    <th>Qty Return</th>
                    <th>Alasan</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.code}</td>
                      <td>{item.name}</td>
                      <td>{item.qty_sold}</td>
                      <td>Rp {item.price.toLocaleString()}</td>
                      <td>
                        <input
                          type="number"
                          value={item.qty_return}
                          onChange={e =>
                            handleItemChange(index, 'qty_return', parseInt(e.target.value) || 0)
                          }
                          min="0"
                          max={item.qty_sold}
                          className="qty-input"
                        />
                      </td>
                      <td>
                        <select
                          value={item.reason}
                          onChange={e => handleItemChange(index, 'reason', e.target.value)}
                          className="reason-select"
                        >
                          <option value="">Pilih alasan</option>
                          <option value="Rusak">Rusak</option>
                          <option value="Tidak Sesuai">Tidak Sesuai</option>
                          <option value="Expired">Expired</option>
                          <option value="Komplain Customer">Komplain Customer</option>
                          <option value="Tukar Barang">Tukar Barang</option>
                          <option value="Lainnya">Lainnya</option>
                        </select>
                      </td>
                      <td>Rp {(item.qty_return * item.price).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="form-summary">
              <div className="summary-row">
                <span>Total Return:</span>
                <strong>Rp {calculateTotal().toLocaleString()}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="form-actions">
          <button type="button" onClick={() => window.history.back()} className="btn-secondary">
            Batal
          </button>
          <button
            type="submit"
            disabled={loading || formData.items.length === 0}
            className="btn-primary"
          >
            {loading ? 'Menyimpan...' : 'Simpan Return'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReturPenjualanForm;
