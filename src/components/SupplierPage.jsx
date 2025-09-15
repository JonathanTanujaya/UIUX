import { useState } from 'react';
import SupplierList from './SupplierList';
import SupplierForm from './SupplierForm';

function SupplierPage() {
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshList, setRefreshList] = useState(false);

  const handleSave = () => {
    setSelectedSupplier(null);
    setShowForm(false);
    setRefreshList(prev => !prev);
  };

  const handleEdit = supplier => {
    setSelectedSupplier(supplier);
    setShowForm(true);
  };

  const handleAdd = () => {
    setSelectedSupplier(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setSelectedSupplier(null);
    setShowForm(false);
  };

  return (
    <div>
      <h1>Manajemen Supplier</h1>
      {!showForm && <button onClick={handleAdd}>Tambah Supplier Baru</button>}
      {showForm ? (
        <SupplierForm supplier={selectedSupplier} onSave={handleSave} onCancel={handleCancel} />
      ) : (
        <SupplierList onEdit={handleEdit} onRefresh={refreshList} />
      )}
    </div>
  );
}

export default SupplierPage;
