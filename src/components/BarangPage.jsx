import { useState } from 'react';
import BarangList from './BarangList';
import BarangForm from './BarangForm';

function BarangPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshList, setRefreshList] = useState(false);

  const handleSave = () => {
    setSelectedItem(null);
    setShowForm(false);
    setRefreshList(prev => !prev);
  };

  const handleEdit = item => {
    setSelectedItem(item);
    setShowForm(true);
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setSelectedItem(null);
    setShowForm(false);
  };

  return (
    <div>
      <h1>Manajemen Barang</h1>
      {!showForm && <button onClick={handleAdd}>Tambah Barang Baru</button>}
      {showForm ? (
        <BarangForm item={selectedItem} onSave={handleSave} onCancel={handleCancel} />
      ) : (
        <BarangList onEdit={handleEdit} onRefresh={refreshList} />
      )}
    </div>
  );
}

export default BarangPage;
