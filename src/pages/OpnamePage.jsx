import React, { useState } from 'react';
import OpnameList from '../components/OpnameList';
import OpnameForm from '../components/OpnameForm';

function OpnamePage() {
  const [view, setView] = useState('list'); // 'list' or 'form'
  const [itemToEdit, setItemToEdit] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // State untuk memicu refresh

  const handleNew = () => {
    setItemToEdit(null);
    setView('form');
  };

  const handleEdit = item => {
    setItemToEdit(item);
    setView('form');
  };

  const handleFormSuccess = () => {
    setView('list');
    setRefreshKey(oldKey => oldKey + 1); // Update key untuk refresh list
  };

  return (
    <div style={{ padding: '20px' }}>
      {view === 'list' ? (
        <>
          <button onClick={handleNew} style={{ marginBottom: '10px' }}>
            Tambah Baru
          </button>
          <OpnameList onEdit={handleEdit} onRefresh={refreshKey} />
        </>
      ) : (
        <>
          <button onClick={() => setView('list')} style={{ marginBottom: '10px' }}>
            Kembali ke Daftar
          </button>
          <OpnameForm itemToEdit={itemToEdit} onFormSuccess={handleFormSuccess} />
        </>
      )}
    </div>
  );
}

export default OpnamePage;
