import { useState } from 'react';
import PenerimaanFinanceList from './PenerimaanFinanceList';
import PenerimaanFinanceForm from './PenerimaanFinanceForm';

function PenerimaanFinancePage() {
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
      <h1>Manajemen Penerimaan Finance</h1>
      {!showForm && <button onClick={handleAdd}>Tambah Penerimaan Finance Baru</button>}
      {showForm ? (
        <PenerimaanFinanceForm
          penerimaan={selectedPenerimaan}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <PenerimaanFinanceList onEdit={handleEdit} onRefresh={refreshList} />
      )}
    </div>
  );
}

export default PenerimaanFinancePage;
