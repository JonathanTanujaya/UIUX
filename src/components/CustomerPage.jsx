import { useState } from 'react';
import CustomerList from './CustomerList';
import CustomerForm from './CustomerForm';

function CustomerPage() {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshList, setRefreshList] = useState(false);

  const handleSave = () => {
    setSelectedCustomer(null);
    setShowForm(false);
    setRefreshList(prev => !prev);
  };

  const handleEdit = customer => {
    setSelectedCustomer(customer);
    setShowForm(true);
  };

  const handleAdd = () => {
    setSelectedCustomer(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setSelectedCustomer(null);
    setShowForm(false);
  };

  return (
    <div>
      <h1>Manajemen Pelanggan</h1>
      {!showForm && <button onClick={handleAdd}>Tambah Pelanggan Baru</button>}
      {showForm ? (
        <CustomerForm customer={selectedCustomer} onSave={handleSave} onCancel={handleCancel} />
      ) : (
        <CustomerList onEdit={handleEdit} onRefresh={refreshList} />
      )}
    </div>
  );
}

export default CustomerPage;
