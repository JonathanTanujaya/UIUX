import { useState } from 'react';
import KategoriList from './KategoriList';
import KategoriForm from './KategoriForm';

function KategoriPage() {
  const [selectedKategori, setSelectedKategori] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshList, setRefreshList] = useState(false);

  const handleSave = () => {
    setSelectedKategori(null);
    setShowForm(false);
    setRefreshList(prev => !prev);
  };

  const handleEdit = kategori => {
    setSelectedKategori(kategori);
    setShowForm(true);
  };

  const handleAdd = () => {
    setSelectedKategori(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setSelectedKategori(null);
    setShowForm(false);
  };

  return (
    <div>
      <h1>Manajemen Kategori</h1>
      {!showForm && <button onClick={handleAdd}>Tambah Kategori Baru</button>}
      {showForm ? (
        <KategoriForm kategori={selectedKategori} onSave={handleSave} onCancel={handleCancel} />
      ) : (
        <KategoriList onEdit={handleEdit} onRefresh={refreshList} />
      )}
    </div>
  );
}

export default KategoriPage;
