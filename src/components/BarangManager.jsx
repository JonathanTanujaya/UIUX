import React, { useState, useEffect } from 'react';

const BarangManager = ({ kodeDivisi }) => {
  const [barangs, setBarangs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBarang, setEditingBarang] = useState(null);
  const [formData, setFormData] = useState({
    kode_barang: ''
  });

  useEffect(() => {
    if (kodeDivisi) {
      fetchBarangs();
    }
  }, [kodeDivisi]);

  const fetchBarangs = async () => {
    try {
      const response = await fetch(`/api/divisi/${kodeDivisi}/barangs`);
      const data = await response.json();
      setBarangs(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching barangs:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingBarang 
        ? `/api/divisi/${kodeDivisi}/barangs/${editingBarang.kode_barang}`
        : `/api/divisi/${kodeDivisi}/barangs`;
      const method = editingBarang ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          kode_divisi: kodeDivisi
        }),
      });

      if (response.ok) {
        fetchBarangs();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving barang:', error);
    }
  };

  const handleEdit = (barang) => {
    setEditingBarang(barang);
    setFormData({
      kode_barang: barang.kode_barang
    });
    setShowForm(true);
  };

  const handleDelete = async (kodeBarang) => {
    if (window.confirm('Are you sure you want to delete this barang?')) {
      try {
        const response = await fetch(`/api/divisi/${kodeDivisi}/barangs/${kodeBarang}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchBarangs();
        }
      } catch (error) {
        console.error('Error deleting barang:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ kode_barang: '' });
    setEditingBarang(null);
    setShowForm(false);
  };

  if (!kodeDivisi) {
    return <div className="p-4 text-gray-500">Please select a divisi first</div>;
  }

  if (loading) return <div className="p-4">Loading barangs...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Barang Management - Divisi: {kodeDivisi}
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add New Barang
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingBarang ? 'Edit Barang' : 'Add New Barang'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Kode Barang
              </label>
              <input
                type="text"
                value={formData.kode_barang}
                onChange={(e) => setFormData({ ...formData, kode_barang: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
                disabled={editingBarang !== null}
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                {editingBarang ? 'Update' : 'Save'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kode Barang
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kode Divisi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {barangs.map((barang) => (
              <tr key={`${barang.kode_divisi}-${barang.kode_barang}`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {barang.kode_barang}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {barang.kode_divisi}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {barang.detail_barang?.stok || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(barang)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(barang.kode_barang)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BarangManager;
