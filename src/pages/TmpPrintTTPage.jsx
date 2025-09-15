import React, { useState } from 'react';
import TmpPrintTTList from '../components/TmpPrintTTList';
import TmpPrintTTForm from '../components/TmpPrintTTForm';

function TmpPrintTTPage() {
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
          <TmpPrintTTList onEdit={handleEdit} onRefresh={refreshKey} />
        </>
      ) : (
        <>
          <button onClick={() => setView('list')} style={{ marginBottom: '10px' }}>
            Kembali ke Daftar
          </button>
          <TmpPrintTTForm itemToEdit={itemToEdit} onFormSuccess={handleFormSuccess} />
        </>
      )}
    </div>
  );
}

export default TmpPrintTTPage;
