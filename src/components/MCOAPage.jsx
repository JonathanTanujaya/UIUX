import { useState } from 'react';
import MCOAList from './MCOAList';
import MCOAForm from './MCOAForm';

function MCOAPage() {
  const [selectedCOA, setSelectedCOA] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshList, setRefreshList] = useState(false);

  const handleSave = () => {
    setSelectedCOA(null);
    setShowForm(false);
    setRefreshList(prev => !prev);
  };

  const handleEdit = coa => {
    setSelectedCOA(coa);
    setShowForm(true);
  };

  const handleAdd = () => {
    setSelectedCOA(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setSelectedCOA(null);
    setShowForm(false);
  };

  return (
    <div>
      <h1>Manajemen COA</h1>
      {!showForm && <button onClick={handleAdd}>Tambah COA Baru</button>}
      {showForm ? (
        <MCOAForm coa={selectedCOA} onSave={handleSave} onCancel={handleCancel} />
      ) : (
        <MCOAList onEdit={handleEdit} onRefresh={refreshList} />
      )}
    </div>
  );
}

export default MCOAPage;
