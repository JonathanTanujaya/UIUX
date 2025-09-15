import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

function PenerimaanFinanceForm({ penerimaan, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    KodeDivisi: '',
    NoPenerimaan: '',
    TglPenerimaan: '',
    Tipe: '',
    NoRef: '',
    TglRef: '',
    TglPencairan: '',
    BankRef: '',
    NoRekTujuan: '',
    KodeCust: '',
    Jumlah: '',
    Status: '',
    NoVoucher: '',
    // For PenerimaanFinanceDetail
    Noinvoice: '',
    JumlahInvoice: '',
    SisaInvoice: '',
    JumlahBayar: '',
    JumlahDispensasi: '',
    StatusDetail: '',
  });

  useEffect(() => {
    if (penerimaan) {
      setFormData(penerimaan);
    }
  }, [penerimaan]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (penerimaan) {
        // Update existing penerimaan finance
        await axios.put(
          `${API_URL}/penerimaan-finance/${penerimaan.KodeDivisi}/${penerimaan.NoPenerimaan}`,
          formData
        );
      } else {
        // Create new penerimaan finance
        await axios.post(`${API_URL}/penerimaan-finance`, formData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving penerimaan finance:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{penerimaan ? 'Edit' : 'Tambah'} Penerimaan Finance</h2>
      <div>
        <label>Kode Divisi:</label>
        <input
          type="text"
          name="KodeDivisi"
          value={formData.KodeDivisi}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>No Penerimaan:</label>
        <input
          type="text"
          name="NoPenerimaan"
          value={formData.NoPenerimaan}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Tgl Penerimaan:</label>
        <input
          type="date"
          name="TglPenerimaan"
          value={formData.TglPenerimaan}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Tipe:</label>
        <input type="text" name="Tipe" value={formData.Tipe} onChange={handleChange} />
      </div>
      <div>
        <label>No Ref:</label>
        <input type="text" name="NoRef" value={formData.NoRef} onChange={handleChange} />
      </div>
      <div>
        <label>Tgl Ref:</label>
        <input type="date" name="TglRef" value={formData.TglRef} onChange={handleChange} />
      </div>
      <div>
        <label>Tgl Pencairan:</label>
        <input
          type="date"
          name="TglPencairan"
          value={formData.TglPencairan}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Bank Ref:</label>
        <input type="text" name="BankRef" value={formData.BankRef} onChange={handleChange} />
      </div>
      <div>
        <label>No Rek Tujuan:</label>
        <input
          type="text"
          name="NoRekTujuan"
          value={formData.NoRekTujuan}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Kode Customer:</label>
        <input type="text" name="KodeCust" value={formData.KodeCust} onChange={handleChange} />
      </div>
      <div>
        <label>Jumlah:</label>
        <input type="number" name="Jumlah" value={formData.Jumlah} onChange={handleChange} />
      </div>
      <div>
        <label>Status:</label>
        <input type="text" name="Status" value={formData.Status} onChange={handleChange} />
      </div>
      <div>
        <label>No Voucher:</label>
        <input type="text" name="NoVoucher" value={formData.NoVoucher} onChange={handleChange} />
      </div>

      <h3>Detail Penerimaan Finance</h3>
      <div>
        <label>No Invoice:</label>
        <input type="text" name="Noinvoice" value={formData.Noinvoice} onChange={handleChange} />
      </div>
      <div>
        <label>Jumlah Invoice:</label>
        <input
          type="number"
          name="JumlahInvoice"
          value={formData.JumlahInvoice}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Sisa Invoice:</label>
        <input
          type="number"
          name="SisaInvoice"
          value={formData.SisaInvoice}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Jumlah Bayar:</label>
        <input
          type="number"
          name="JumlahBayar"
          value={formData.JumlahBayar}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Jumlah Dispensasi:</label>
        <input
          type="number"
          name="JumlahDispensasi"
          value={formData.JumlahDispensasi}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Status Detail:</label>
        <input
          type="text"
          name="StatusDetail"
          value={formData.StatusDetail}
          onChange={handleChange}
        />
      </div>

      <button type="submit">Simpan</button>
      <button type="button" onClick={onCancel}>
        Batal
      </button>
    </form>
  );
}

export default PenerimaanFinanceForm;
