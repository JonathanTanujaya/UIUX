import { useState } from 'react';
import ReturnSalesList from './ReturnSalesList';
import ReturnSalesForm from './ReturnSalesForm';

function ReturnSalesPage() {
  const [selectedReturnSales, setSelectedReturnSales] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshList, setRefreshList] = useState(false);

  const handleSave = () => {
    setSelectedReturnSales(null);
    setShowForm(false);
    setRefreshList(prev => !prev);
  };

  const handleEdit = returnSales => {
    setSelectedReturnSales(returnSales);
    setShowForm(true);
  };

  const handleAdd = () => {
    setSelectedReturnSales(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setSelectedReturnSales(null);
    setShowForm(false);
  };

  return (
    <div>
      <h1>Manajemen Retur Penjualan</h1>
      {!showForm && <button onClick={handleAdd}>Tambah Retur Penjualan Baru</button>}
      {showForm ? (
        <ReturnSalesForm
          returnSales={selectedReturnSales}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <ReturnSalesList onEdit={handleEdit} onRefresh={refreshList} />
      )}
    </div>
  );
}

export default ReturnSalesPage;
