import { useState } from 'react';
import MDivisiList from './MDivisiList';
import MDivisiForm from './MDivisiForm';

function MDivisiPage() {
  const [selectedDivisi, setSelectedDivisi] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshList, setRefreshList] = useState(false);

  const handleSave = () => {
    setSelectedDivisi(null);
    setShowForm(false);
    setRefreshList(prev => !prev);
  };

  const handleEdit = divisi => {
    setSelectedDivisi(divisi);
    setShowForm(true);
  };

  const handleAdd = () => {
    setSelectedDivisi(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setSelectedDivisi(null);
    setShowForm(false);
  };

  return (
    <div>
      <h1>Manajemen Divisi</h1>
      {!showForm && <button onClick={handleAdd}>Tambah Divisi Baru</button>}
      {showForm ? (
        <MDivisiForm divisi={selectedDivisi} onSave={handleSave} onCancel={handleCancel} />
      ) : (
        <MDivisiList onEdit={handleEdit} onRefresh={refreshList} />
      )}
    </div>
  );
}

export default MDivisiPage;
