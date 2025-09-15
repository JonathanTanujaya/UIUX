import { useState } from 'react';
import MBankList from './MBankList';
import MBankForm from './MBankForm';

function MBankPage() {
  const [selectedBank, setSelectedBank] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshList, setRefreshList] = useState(false);

  const handleSave = () => {
    setSelectedBank(null);
    setShowForm(false);
    setRefreshList(prev => !prev);
  };

  const handleEdit = bank => {
    setSelectedBank(bank);
    setShowForm(true);
  };

  const handleAdd = () => {
    setSelectedBank(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setSelectedBank(null);
    setShowForm(false);
  };

  return (
    <div>
      <h1>Manajemen Bank</h1>
      {!showForm && <button onClick={handleAdd}>Tambah Bank Baru</button>}
      {showForm ? (
        <MBankForm bank={selectedBank} onSave={handleSave} onCancel={handleCancel} />
      ) : (
        <MBankList onEdit={handleEdit} onRefresh={refreshList} />
      )}
    </div>
  );
}

export default MBankPage;
