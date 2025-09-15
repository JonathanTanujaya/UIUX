import { useState } from 'react';
import SalesList from './SalesList';
import SalesForm from './SalesForm';

function SalesPage() {
  const [selectedSale, setSelectedSale] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshList, setRefreshList] = useState(false);

  const handleSave = () => {
    setSelectedSale(null);
    setShowForm(false);
    setRefreshList(prev => !prev); // Toggle to trigger refresh
  };

  const handleEdit = sale => {
    setSelectedSale(sale);
    setShowForm(true);
  };

  const handleAdd = () => {
    setSelectedSale(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setSelectedSale(null);
    setShowForm(false);
  };

  return (
    <div>
      <h1>Manajemen Sales</h1>
      {!showForm && <button onClick={handleAdd}>Tambah Sales Baru</button>}
      {showForm ? (
        <SalesForm sale={selectedSale} onSave={handleSave} onCancel={handleCancel} />
      ) : (
        <SalesList onEdit={handleEdit} onRefresh={refreshList} />
      )}
    </div>
  );
}

export default SalesPage;
