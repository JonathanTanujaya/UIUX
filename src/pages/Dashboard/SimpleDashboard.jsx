import React from 'react';

const SimpleDashboard = () => {
  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Dashboard Test</h2>
        <p className="text-gray-600">
          Jika Anda melihat halaman ini, berarti routing sudah berfungsi dengan baik!
        </p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800">Categories</h3>
            <p className="text-blue-600">Kelola kategori barang</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800">Suppliers</h3>
            <p className="text-green-600">Kelola data supplier</p>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-800">Barang</h3>
            <p className="text-purple-600">Kelola inventori barang</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleDashboard;
