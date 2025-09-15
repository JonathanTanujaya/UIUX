import { useState } from 'react';
import MTTList from './MTTList';
import MTTForm from './MTTForm';

function MTTPage() {
  const [selectedMTT, setSelectedMTT] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshList, setRefreshList] = useState(false);

  const handleSave = () => {
    setSelectedMTT(null);
    setShowForm(false);
    setRefreshList(prev => !prev);
  };

  const handleEdit = mtt => {
    setSelectedMTT(mtt);
    setShowForm(true);
  };

  const handleAdd = () => {
    setSelectedMTT(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setSelectedMTT(null);
    setShowForm(false);
  };

  return (
    <div>
      <h1>Manajemen MTT</h1>
      {!showForm && <button onClick={handleAdd}>Tambah MTT Baru</button>}
      {showForm ? (
        <MTTForm mtt={selectedMTT} onSave={handleSave} onCancel={handleCancel} />
      ) : (
        <MTTList onEdit={handleEdit} onRefresh={refreshList} />
      )}
    </div>
  );
}

export default MTTPage;
