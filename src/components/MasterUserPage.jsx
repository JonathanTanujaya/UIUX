import { useState } from 'react';
import MasterUserList from './MasterUserList';
import MasterUserForm from './MasterUserForm';

function MasterUserPage() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshList, setRefreshList] = useState(false);

  const handleSave = () => {
    setSelectedUser(null);
    setShowForm(false);
    setRefreshList(prev => !prev);
  };

  const handleEdit = user => {
    setSelectedUser(user);
    setShowForm(true);
  };

  const handleAdd = () => {
    setSelectedUser(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setSelectedUser(null);
    setShowForm(false);
  };

  return (
    <div>
      <h1>Manajemen Pengguna</h1>
      {!showForm && <button onClick={handleAdd}>Tambah Pengguna Baru</button>}
      {showForm ? (
        <MasterUserForm user={selectedUser} onSave={handleSave} onCancel={handleCancel} />
      ) : (
        <MasterUserList onEdit={handleEdit} onRefresh={refreshList} />
      )}
    </div>
  );
}

export default MasterUserPage;
