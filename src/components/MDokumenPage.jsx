import { useState } from 'react';
import MDokumenList from './MDokumenList';
import MDokumenForm from './MDokumenForm';

function MDokumenPage() {
  const [selectedDokumen, setSelectedDokumen] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshList, setRefreshList] = useState(false);

  const handleSave = () => {
    setSelectedDokumen(null);
    setShowForm(false);
    setRefreshList(prev => !prev);
  };

  const handleEdit = dokumen => {
    setSelectedDokumen(dokumen);
    setShowForm(true);
  };

  const handleAdd = () => {
    setSelectedDokumen(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setSelectedDokumen(null);
    setShowForm(false);
  };

  return (
    <div>
      <h1>Manajemen Dokumen</h1>
      {!showForm && <button onClick={handleAdd}>Tambah Dokumen Baru</button>}
      {showForm ? (
        <MDokumenForm dokumen={selectedDokumen} onSave={handleSave} onCancel={handleCancel} />
      ) : (
        <MDokumenList onEdit={handleEdit} onRefresh={refreshList} />
      )}
    </div>
  );
}

export default MDokumenPage;
