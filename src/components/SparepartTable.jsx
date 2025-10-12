import React, { useEffect, useState } from 'react';
import Button from './ui/Button';
import api from '../services/api';

function SparepartTable({ onEdit }) {
  const [data, setData] = useState([]);
  useEffect(() => {
    api.get('/spareparts').then(res => setData(res.data || []));
  }, []);

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ background: '#f5f5f5' }}>
          <th style={{ padding: 8 }}>No</th>
          <th style={{ padding: 8 }}>Kode</th>
          <th style={{ padding: 8 }}>Nama</th>
          <th style={{ padding: 8 }}>Kategori</th>
          <th style={{ padding: 8 }}>Stok</th>
          <th style={{ padding: 8 }}>Harga Beli</th>
          <th style={{ padding: 8 }}>Harga Jual</th>
          <th style={{ padding: 8 }}>Aksi</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, idx) => (
          <tr key={item.kode_barang}>
            <td style={{ padding: 8 }}>{idx + 1}</td>
            <td style={{ padding: 8 }}>{item.kode_barang}</td>
            <td style={{ padding: 8 }}>{item.nama_barang}</td>
            <td style={{ padding: 8 }}>{item.kode_kategori}</td>
            <td style={{ padding: 8 }}>{item.stok}</td>
            <td style={{ padding: 8 }}>{item.harga_beli}</td>
            <td style={{ padding: 8 }}>{item.harga_jual}</td>
            <td style={{ padding: 8 }}>
              <Button size="sm" variant="primary" onClick={() => onEdit(item.kode_barang)}>
                Edit
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default SparepartTable;
