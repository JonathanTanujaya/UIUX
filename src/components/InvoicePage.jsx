import { useState } from 'react';
import InvoiceList from './InvoiceList';
import InvoiceForm from './InvoiceForm';

function InvoicePage() {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshList, setRefreshList] = useState(false);

  const handleSave = () => {
    setSelectedInvoice(null);
    setShowForm(false);
    setRefreshList(prev => !prev);
  };

  const handleEdit = invoice => {
    setSelectedInvoice(invoice);
    setShowForm(true);
  };

  const handleAdd = () => {
    setSelectedInvoice(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setSelectedInvoice(null);
    setShowForm(false);
  };

  return (
    <div>
      <h1>Manajemen Invoice</h1>
      {!showForm && <button onClick={handleAdd}>Tambah Invoice Baru</button>}
      {showForm ? (
        <InvoiceForm invoice={selectedInvoice} onSave={handleSave} onCancel={handleCancel} />
      ) : (
        <InvoiceList onEdit={handleEdit} onRefresh={refreshList} />
      )}
    </div>
  );
}

export default InvoicePage;
