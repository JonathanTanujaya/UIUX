import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  purchasesAPI,
  suppliersAPI,
  barangAPI,
} from '../services/unifiedAPI';
import { toast } from 'react-toastify';

// Helpers
const todayStr = () => new Date().toISOString().slice(0, 10);
const addDays = (base, days) => {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};
const calcNet = (price, d1, d2) => {
  const p = Number(price) || 0,
    a = Number(d1) || 0,
    b = Number(d2) || 0;
  return p * (1 - a / 100) * (1 - b / 100);
};

const emptyHeader = {
  receiptDate: todayStr(),
  dueDate: addDays(todayStr(), 14),
  supplier: null,
  invoiceNumber: '',
  taxPercent: 11,
  globalDiscount: 0,
  note: '',
};

const emptyEntry = { 
  code: '', 
  name: '', 
  qty: 1, 
  unit: 'PCS', 
  price: '', 
  disc1: '0', 
  disc2: '0' 
};

export const usePurchaseForm = () => {
  // State Management
  const [header, setHeader] = useState(emptyHeader);
  const [items, setItems] = useState([]);
  const [entry, setEntry] = useState(emptyEntry);
  const [mergeSame, setMergeSame] = useState(true);
  const [printMode, setPrintMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  
  // Modal States
  const [supplierModalOpen, setSupplierModalOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  
  // Search States
  const [supplierLookup, setSupplierLookup] = useState('');
  const [supplierResults, setSupplierResults] = useState([]);
  const [productLookup, setProductLookup] = useState('');
  const [productResults, setProductResults] = useState([]);
  
  // Validation States
  const [checkingInvoice, setCheckingInvoice] = useState(false);
  const [invoiceExists, setInvoiceExists] = useState(false);
  
  // Draft States
  const [autoSaveDraft, setAutoSaveDraft] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Auto-save draft functionality
  useEffect(() => {
    if (!autoSaveDraft) return;
    const timer = setTimeout(() => {
      const draft = { header, items, timestamp: Date.now() };
      localStorage.setItem('purchase-draft', JSON.stringify(draft));
      setLastSaved(new Date().toLocaleTimeString());
    }, 2000);
    return () => clearTimeout(timer);
  }, [header, items, autoSaveDraft]);

  // Load draft on mount
  useEffect(() => {
    const saved = localStorage.getItem('purchase-draft');
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        if (draft.header && draft.items) {
          setHeader(draft.header);
          setItems(draft.items);
          toast.info('Draft dimuat dari penyimpanan');
        }
      } catch (e) {
        console.warn('Invalid draft data');
      }
    }
  }, []);

  // Invoice uniqueness check with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (header.invoiceNumber && header.invoiceNumber.length > 2) {
        setCheckingInvoice(true);
        purchasesAPI
          .getAll()
          .then(res => {
            const data = res.data?.data || [];
            const exists = data.some(
              p =>
                (p.invoice_number || p.invoiceNumber || '').toLowerCase() ===
                header.invoiceNumber.toLowerCase()
            );
            setInvoiceExists(exists);
          })
          .catch(() => setInvoiceExists(false))
          .finally(() => setCheckingInvoice(false));
      } else {
        setInvoiceExists(false);
        setCheckingInvoice(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [header.invoiceNumber]);

  // Supplier search debounce
  useEffect(() => {
    const t = setTimeout(() => {
      if (supplierModalOpen && supplierLookup) {
        suppliersAPI
          .getAll()
          .then(res => {
            const data = res.data?.data || [];
            setSupplierResults(
              data.filter(s => (s.nama || '').toLowerCase().includes(supplierLookup.toLowerCase()))
            );
          })
          .catch(() => setSupplierResults([]));
      }
    }, 300);
    return () => clearTimeout(t);
  }, [supplierLookup, supplierModalOpen]);

  // Product search debounce
  useEffect(() => {
    const t = setTimeout(() => {
      if (productModalOpen && productLookup) {
        barangAPI
          .getAll()
          .then(res => {
            const data = res.data?.data || [];
            setProductResults(
              data.filter(p =>
                (p.nama_barang || p.namaBarang || p.kode_barang || '')
                  .toLowerCase()
                  .includes(productLookup.toLowerCase())
              )
            );
          })
          .catch(() => setProductResults([]));
      }
    }, 300);
    return () => clearTimeout(t);
  }, [productLookup, productModalOpen]);

  // Calculate totals
  const totals = useMemo(() => {
    const total = items.reduce((acc, r) => acc + r.subTotal, 0);
    const globalDisc = Number(header.globalDiscount) || 0;
    const afterDisc = total - globalDisc;
    const taxPercent = Number(header.taxPercent) || 0;
    const tax = afterDisc * (taxPercent / 100);
    const grand = afterDisc + tax;
    return { total, afterDisc, tax, grand };
  }, [items, header.globalDiscount, header.taxPercent]);

  // Item Management Functions
  const addItem = useCallback(() => {
    if (!entry.code || !entry.name) return;
    const qty = Number(entry.qty) || 0;
    const price = Number(entry.price) || 0;
    if (qty <= 0 || price <= 0) return;
    const disc1 = Number(entry.disc1) || 0;
    const disc2 = Number(entry.disc2) || 0;
    const netPrice = calcNet(price, disc1, disc2);
    const subTotal = netPrice * qty;
    const newItem = {
      idTemp: Date.now(),
      code: entry.code,
      name: entry.name,
      qty,
      unit: entry.unit,
      price,
      disc1,
      disc2,
      netPrice,
      subTotal,
    };

    setItems(prev => {
      if (mergeSame) {
        const existing = prev.find(r => r.code === entry.code);
        if (existing) {
          return prev.map(r =>
            r.code === entry.code
              ? { ...r, qty: r.qty + qty, subTotal: r.netPrice * (r.qty + qty) }
              : r
          );
        }
      }
      return [...prev, newItem];
    });
    setEntry(emptyEntry);
  }, [entry, mergeSame]);

  const removeItem = useCallback((idTemp) => {
    setItems(prev => prev.filter(r => r.idTemp !== idTemp));
  }, []);

  const startEditRow = useCallback((row) => {
    setEditingRow(row.idTemp);
    setEntry({
      code: row.code,
      name: row.name,
      qty: row.qty,
      unit: row.unit,
      price: row.price,
      disc1: row.disc1,
      disc2: row.disc2,
    });
  }, []);

  const applyEdit = useCallback(() => {
    if (!editingRow) return;
    const qty = Number(entry.qty) || 0;
    const price = Number(entry.price) || 0;
    const disc1 = Number(entry.disc1) || 0;
    const disc2 = Number(entry.disc2) || 0;
    if (qty <= 0 || price <= 0) {
      toast.warn('Qty & Harga harus > 0');
      return;
    }
    const netPrice = calcNet(price, disc1, disc2);
    const subTotal = netPrice * qty;
    setItems(prev =>
      prev.map(r =>
        r.idTemp === editingRow
          ? {
              ...r,
              code: entry.code,
              name: entry.name,
              qty,
              price,
              disc1,
              disc2,
              netPrice,
              subTotal,
            }
          : r
      )
    );
    setEditingRow(null);
    setEntry(emptyEntry);
  }, [editingRow, entry]);

  const cancelEdit = useCallback(() => {
    setEditingRow(null);
    setEntry(emptyEntry);
  }, []);

  // Draft Management
  const clearDraft = useCallback(() => {
    localStorage.removeItem('purchase-draft');
    setHeader(emptyHeader);
    setItems([]);
    setLastSaved(null);
    toast.success('Draft dihapus');
  }, []);

  // Validation
  const validate = useCallback(() => {
    if (!header.invoiceNumber) return 'No Faktur wajib';
    if (invoiceExists) return 'No Faktur sudah ada';
    if (!header.supplier) return 'Supplier belum dipilih';
    if (items.length === 0) return 'Minimal 1 item';
    if (checkingInvoice) return 'Sedang validasi invoice...';
    return null;
  }, [header, items, invoiceExists, checkingInvoice]);

  // Submit Form
  const submit = useCallback(async () => {
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }
    setSaving(true);
    try {
      const payload = {
        header: {
          receiptDate: header.receiptDate,
          dueDate: header.dueDate,
          supplier_id: header.supplier.id,
          invoiceNumber: header.invoiceNumber,
          taxPercent: Number(header.taxPercent) || 0,
          globalDiscount: Number(header.globalDiscount) || 0,
          note: header.note,
        },
        items: items.map(r => ({
          code: r.code,
          name: r.name,
          qty: r.qty,
          unit: r.unit,
          price: r.price,
          disc1: r.disc1,
          disc2: r.disc2,
        })),
      };
      await purchasesAPI.create(payload);
      toast.success('Pembelian tersimpan');
      localStorage.removeItem('purchase-draft');
      setHeader(emptyHeader);
      setItems([]);
      setLastSaved(null);
    } catch (e) {
      console.error(e);
      toast.error('Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  }, [header, items, validate]);

  // Modal Functions
  const pickSupplier = useCallback((s) => {
    setHeader(h => ({
      ...h,
      supplier: {
        id: s.id,
        code: s.kodecust || s.kode || s.code,
        name: s.nama || s.namacust || s.name,
      },
    }));
    setSupplierModalOpen(false);
  }, []);

  const pickProduct = useCallback((p) => {
    setEntry(en => ({
      ...en,
      code: p.kode_barang || p.kode || p.code,
      name: p.nama_barang || p.namaBarang || p.name,
      price: p.modal || p.harga || p.price || '',
      unit: p.satuan || p.unit || 'PCS',
    }));
    setProductModalOpen(false);
  }, []);

  // Utility Functions
  const formatNumber = useCallback((val) => {
    return new Intl.NumberFormat('id-ID').format(Number(val) || 0);
  }, []);

  const formatCurrency = useCallback((value) => {
    const num = value.toString().replace(/[^\d]/g, '');
    return new Intl.NumberFormat('id-ID').format(num);
  }, []);

  const handleCurrencyInput = useCallback((field, value) => {
    const cleaned = value.replace(/[^\d]/g, '');
    setEntry(v => ({ ...v, [field]: cleaned }));
  }, []);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      editingRow ? applyEdit() : addItem();
    }
  }, [editingRow, applyEdit, addItem]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            submit();
            break;
          case 'd':
            e.preventDefault();
            clearDraft();
            break;
          case 'p':
            e.preventDefault();
            setPrintMode(!printMode);
            break;
          case 'f':
            e.preventDefault();
            setSupplierModalOpen(true);
            break;
          case 'g':
            e.preventDefault();
            setProductModalOpen(true);
            break;
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [printMode, submit, clearDraft]);

  return {
    // State
    header,
    setHeader,
    items,
    entry,
    setEntry,
    mergeSame,
    setMergeSame,
    printMode,
    setPrintMode,
    saving,
    editingRow,
    
    // Modal States
    supplierModalOpen,
    setSupplierModalOpen,
    productModalOpen,
    setProductModalOpen,
    
    // Search States
    supplierLookup,
    setSupplierLookup,
    supplierResults,
    productLookup,
    setProductLookup,
    productResults,
    
    // Validation States
    checkingInvoice,
    invoiceExists,
    
    // Draft States
    autoSaveDraft,
    setAutoSaveDraft,
    lastSaved,
    showShortcuts,
    setShowShortcuts,
    
    // Computed Values
    totals,
    
    // Functions
    addItem,
    removeItem,
    startEditRow,
    applyEdit,
    cancelEdit,
    clearDraft,
    submit,
    pickSupplier,
    pickProduct,
    formatNumber,
    formatCurrency,
    handleCurrencyInput,
    handleKeyPress,
    validate,
  };
};
