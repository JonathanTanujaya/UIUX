import { useState } from 'react';
import ClaimPenjualanList from './ClaimPenjualanList';
import ClaimPenjualanForm from './ClaimPenjualanForm';

function ClaimPenjualanPage() {
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshList, setRefreshList] = useState(false);

  const handleSave = () => {
    setSelectedClaim(null);
    setShowForm(false);
    setRefreshList(prev => !prev);
  };

  const handleEdit = claim => {
    setSelectedClaim(claim);
    setShowForm(true);
  };

  const handleAdd = () => {
    setSelectedClaim(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setSelectedClaim(null);
    setShowForm(false);
  };

  return (
    <div>
      <h1>Manajemen Klaim Penjualan</h1>
      {!showForm && <button onClick={handleAdd}>Tambah Klaim Penjualan Baru</button>}
      {showForm ? (
        <ClaimPenjualanForm claim={selectedClaim} onSave={handleSave} onCancel={handleCancel} />
      ) : (
        <ClaimPenjualanList onEdit={handleEdit} onRefresh={refreshList} />
      )}
    </div>
  );
}

export default ClaimPenjualanPage;
