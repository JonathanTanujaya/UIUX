import { useState } from 'react';
import MResiList from './MResiList';
import MResiForm from './MResiForm';

function MResiPage() {
  const [selectedResi, setSelectedResi] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshList, setRefreshList] = useState(false);

  const handleSave = () => {
    setSelectedResi(null);
    setShowForm(false);
    setRefreshList(prev => !prev);
  };

  const handleEdit = resi => {
    setSelectedResi(resi);
    setShowForm(true);
  };

  const handleAdd = () => {
    setSelectedResi(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setSelectedResi(null);
    setShowForm(false);
  };

  return (
    <div>
      <h1>Manajemen Resi</h1>
      {!showForm && <button onClick={handleAdd}>Tambah Resi Baru</button>}
      {showForm ? (
        <MResiForm resi={selectedResi} onSave={handleSave} onCancel={handleCancel} />
      ) : (
        <MResiList onEdit={handleEdit} onRefresh={refreshList} />
      )}
    </div>
  );
}

export default MResiPage;
