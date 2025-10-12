# Frontend Redesign - Simple, Minimalist, Efficient (Desktop)

## 📁 Struktur Baru

```
frontend/src/
├── styles/
│   └── designTokens.js          # Design system (colors, spacing, typography)
├── components/
│   └── ui/
│       ├── Card.jsx             # Card container component
│       ├── Button.jsx           # Button dengan variants (primary, secondary, success, danger, ghost)
│       └── Input.jsx            # Input, Select, Textarea components
├── services/
│   ├── stubNetwork.js           # Network stub dengan dummy data generator
│   └── apiClient.js             # Stubbed axios-like client
└── pages/
    ├── Dashboard/
    │   └── SimpleDashboardNew.jsx  # Dashboard baru dengan stats & recent data
    └── MasterData/
        └── Customers/
            └── MasterCustomersNew.jsx  # Customer list template (minimalist)
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6) - Trust, professional
- **Success**: Green (#22C55E)
- **Warning**: Amber (#F59E0B)
- **Error**: Red (#EF4444)
- **Neutral**: Gray scale (50-900)

### Typography
- **Font**: System fonts (-apple-system, Segoe UI, Roboto)
- **Sizes**: xs(12px) → 4xl(36px)
- **Weights**: normal(400), medium(500), semibold(600), bold(700)

### Spacing Scale
- 1 = 4px, 2 = 8px, 3 = 12px, 4 = 16px, 6 = 24px, 8 = 32px

### Components
- **Card**: Container dengan shadow & border radius
- **Button**: 3 sizes (sm/md/lg), 5 variants, dengan icon support
- **Input**: Label, error state, helper text, icon support
- **Table**: Clean, hover states, responsive

## 📊 Dummy Data

Data dummy otomatis tergenerate di `stubNetwork.js` berdasarkan endpoint:

### Available Dummy Data:
- **Customers** (25 records): nama, alamat, kota, telp, sales, TOP, limit piutang
- **Suppliers** (20 records): nama, alamat, kota, telp, TOP
- **Sales** (15 records): nama, alamat, telp, komisi, target
- **Barang** (50 records): nama, kategori, satuan, harga, stok
- **Categories** (15 records): nama kategori
- **Areas** (10 records): nama area
- **Invoices** (30 records): no invoice, customer, total, status
- **Banks** (8 records): nama bank, rekening, saldo

### Cara Menambah Dummy Data Baru:
Edit `frontend/src/services/stubNetwork.js`, tambah di function `generateDummyData()`:

```javascript
if (path.includes('nama-endpoint')) {
  return Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    field1: `Value ${i}`,
    field2: Math.random() * 1000,
    // ... dst
  }));
}
```

## 🔧 Cara Menggunakan Template

### 1. Copy Template untuk Halaman Baru
```bash
# Untuk halaman list
cp MasterCustomersNew.jsx MasterSuppliersNew.jsx

# Edit konten:
# - Ganti endpoint di generateDummyData
# - Sesuaikan kolom tabel
# - Sesuaikan form fields
```

### 2. Template Structure:
```jsx
import { Card, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { colors, spacing, typography } from '../../../styles/designTokens';

const YourPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  // Data dari stub (otomatis terisi)
  const [data] = useState([]);
  
  return (
    <div style={{ padding: spacing[6], backgroundColor: colors.gray[50] }}>
      {/* Header */}
      <h1>Page Title</h1>
      
      {/* Action Bar: Search + Buttons */}
      <Card>
        <Input placeholder="Search..." />
        <Button>Add New</Button>
      </Card>
      
      {/* Data Table */}
      <Card padding="0">
        <table>{/* Your table */}</table>
      </Card>
      
      {/* Form Modal (jika showForm=true) */}
      {showForm && <div>{/* Form content */}</div>}
    </div>
  );
};
```

## 🎯 Design Principles

### 1. **Simplicity**
- Minimal UI elements
- Clear hierarchy
- White space untuk breathability

### 2. **Efficiency** (Desktop-optimized)
- Multi-column forms (2 kolom untuk input efisien)
- Keyboard shortcuts ready
- Quick actions (inline edit/delete)
- Search + filter di action bar

### 3. **Consistency**
- Semua halaman pakai design tokens yang sama
- Spacing, colors, typography konsisten
- Reusable components (Card, Button, Input)

## 📝 Checklist Halaman yang Sudah Selesai

### ✅ Completed
- [x] Design System (designTokens.js)
- [x] Shared Components (Card, Button, Input)
- [x] Dummy Data Generator (stubNetwork.js)
- [x] Dashboard (SimpleDashboardNew.jsx)
- [x] Master Customers (MasterCustomersNew.jsx)

### 🚧 TODO (Ikuti template Customer)
- [ ] Master Suppliers
- [ ] Master Sales
- [ ] Master Barang/Products
- [ ] Master Categories
- [ ] Master Areas
- [ ] Master Banks
- [ ] Invoices List
- [ ] Purchase Orders
- [ ] Reports (Sales, Stock, etc.)

## 🚀 Cara Menghidupkan Backend Lagi

Ketika backend sudah siap:

1. **Hapus stub**: Comment/hapus line ini di `main.jsx`:
```javascript
// import './services/stubNetwork';  // <-- Comment line ini
```

2. **Update apiClient.js**: Replace dengan axios instance asli
3. **Test**: Pastikan endpoint backend match dengan yang di code

## 💡 Tips

- **Warna status**: Gunakan badge dengan bg-50 dan text-700 (contoh: success[50] & success[700])
- **Format currency**: Pakai `Intl.NumberFormat('id-ID')`
- **Hover states**: Table rows hover → gray[50]
- **Focus states**: Input focus → primary[600] border + primary[100] shadow
- **Empty states**: Tampilkan pesan friendly saat data kosong

## 📱 Responsive (Future)

Template ini desktop-first. Untuk mobile:
- Grid → Stack vertical
- 2-column form → 1 column
- Table → Card list
- Hide beberapa kolom di mobile

## 🐛 Troubleshooting

**Q: Data tidak muncul?**
A: Check console untuk warning [STUB]. Pastikan endpoint di generateDummyData() match.

**Q: Form tidak rapi?**
A: Pastikan pakai `display: grid; gridTemplateColumns: '1fr 1fr'; gap: spacing[4]`

**Q: Button tidak responsive?**
A: Tambah `fullWidth={true}` untuk button block-level

---

**Author**: AI Assistant
**Last Updated**: {{ current_date }}
**Version**: 1.0.0
