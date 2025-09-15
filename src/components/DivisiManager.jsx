import React, { useState, useEffect } from 'react';

const DivisiManager = () => {
  const [divisis, setDivisis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDivisi, setEditingDivisi] = useState(null);
  const [formData, setFormData] = useState({
    kode_divisi: '',
    nama_divisi: ''
  });

  useEffect(() => {
    fetchDivisis();
  }, []);

  const fetchDivisis = async () => {
    try {
      const response = await fetch('/api/divisi');
      const data = await response.json();
      setDivisis(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching divisis:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingDivisi 
        ? `/api/divisi/${editingDivisi.kode_divisi}`
        : '/api/divisi';
      const method = editingDivisi ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchDivisis();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving divisi:', error);
    }
  };

  const handleEdit = (divisi) => {
    setEditingDivisi(divisi);
    setFormData({
      kode_divisi: divisi.kode_divisi,
      nama_divisi: divisi.nama_divisi
    });
    setShowForm(true);
  };

  const handleDelete = async (kodeDivisi) => {
    if (window.confirm('Are you sure you want to delete this divisi?')) {
      try {
        const response = await fetch(`/api/divisi/${kodeDivisi}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchDivisis();
        }
      } catch (error) {
        console.error('Error deleting divisi:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ kode_divisi: '', nama_divisi: '' });
    setEditingDivisi(null);
    setShowForm(false);
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Divisi Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add New Divisi
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingDivisi ? 'Edit Divisi' : 'Add New Divisi'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Kode Divisi
              </label>
              <input
                type="text"
                value={formData.kode_divisi}
                onChange={(e) => setFormData({ ...formData, kode_divisi: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
                disabled={editingDivisi !== null}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nama Divisi
              </label>
              <input
                type="text"
                value={formData.nama_divisi}
                onChange={(e) => setFormData({ ...formData, nama_divisi: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                {editingDivisi ? 'Update' : 'Save'}
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
                Kode Divisi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama Divisi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {divisis.map((divisi) => (
              <tr key={divisi.kode_divisi}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {divisi.kode_divisi}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {divisi.nama_divisi}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(divisi)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(divisi.kode_divisi)}
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

export default DivisiManager;
