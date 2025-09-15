import { useState } from 'react';
import PartPenerimaanList from './PartPenerimaanList';
import PartPenerimaanForm from './PartPenerimaanForm';

function PartPenerimaanPage() {
  const [selectedPenerimaan, setSelectedPenerimaan] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshList, setRefreshList] = useState(false);

  const handleSave = () => {
    setSelectedPenerimaan(null);
    setShowForm(false);
    setRefreshList(prev => !prev);
  };

  const handleEdit = penerimaan => {
    setSelectedPenerimaan(penerimaan);
    setShowForm(true);
  };

  const handleAdd = () => {
    setSelectedPenerimaan(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setSelectedPenerimaan(null);
    setShowForm(false);
  };

  return (
    <div>
      <h1>Manajemen Penerimaan Barang</h1>
      {!showForm && <button onClick={handleAdd}>Tambah Penerimaan Baru</button>}
      {showForm ? (
        <PartPenerimaanForm
          penerimaan={selectedPenerimaan}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <PartPenerimaanList onEdit={handleEdit} onRefresh={refreshList} />
      )}
    </div>
  );
}

export default PartPenerimaanPage;
