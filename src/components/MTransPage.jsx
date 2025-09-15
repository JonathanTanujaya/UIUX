import { useState } from 'react';
import MTransList from './MTransList';
import MTransForm from './MTransForm';

function MTransPage() {
  const [selectedMTrans, setSelectedMTrans] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshList, setRefreshList] = useState(false);

  const handleSave = () => {
    setSelectedMTrans(null);
    setShowForm(false);
    setRefreshList(prev => !prev);
  };

  const handleEdit = mtrans => {
    setSelectedMTrans(mtrans);
    setShowForm(true);
  };

  const handleAdd = () => {
    setSelectedMTrans(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setSelectedMTrans(null);
    setShowForm(false);
  };

  return (
    <div>
      <h1>Manajemen Transaksi</h1>
      {!showForm && <button onClick={handleAdd}>Tambah Transaksi Baru</button>}
      {showForm ? (
        <MTransForm mtrans={selectedMTrans} onSave={handleSave} onCancel={handleCancel} />
      ) : (
        <MTransList onEdit={handleEdit} onRefresh={refreshList} />
      )}
    </div>
  );
}

export default MTransPage;
