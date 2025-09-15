import { useState } from 'react';
import MModuleList from './MModuleList';
import MModuleForm from './MModuleForm';

function MModulePage() {
  const [selectedModule, setSelectedModule] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshList, setRefreshList] = useState(false);

  const handleSave = () => {
    setSelectedModule(null);
    setShowForm(false);
    setRefreshList(prev => !prev);
  };

  const handleEdit = module => {
    setSelectedModule(module);
    setShowForm(true);
  };

  const handleAdd = () => {
    setSelectedModule(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setSelectedModule(null);
    setShowForm(false);
  };

  return (
    <div>
      <h1>Manajemen Modul</h1>
      {!showForm && <button onClick={handleAdd}>Tambah Modul Baru</button>}
      {showForm ? (
        <MModuleForm module={selectedModule} onSave={handleSave} onCancel={handleCancel} />
      ) : (
        <MModuleList onEdit={handleEdit} onRefresh={refreshList} />
      )}
    </div>
  );
}

export default MModulePage;
