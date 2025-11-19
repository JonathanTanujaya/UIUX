import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';
import QueryProvider from './providers/QueryProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from './components/Layout/Layout';
import DashboardLayout from './components/Layout/DashboardLayout';
import DivisiManager from './components/DivisiManager';
import CustomerManager from './components/CustomerManager';
import CustomerListPage from './pages/MasterData/Customers/CustomerListPage';
import CustomerFormPage from './pages/MasterData/Customers/CustomerFormPage';
import BarangManager from './components/BarangManager';
import InvoiceManager from './components/InvoiceManager';
// Master Data pages
import AreaListPage from './pages/MasterData/Area/AreaListPage';
import AreaFormPage from './pages/MasterData/Area/AreaFormPage';
import SalesListPage from './pages/MasterData/Sales/SalesListPage';
import SalesFormPage from './pages/MasterData/Sales/SalesFormPage';
import SupplierListPage from './pages/MasterData/Suppliers/SupplierListPage';
import SupplierFormPage from './pages/MasterData/Suppliers/SupplierFormPage';
import MasterBank from './pages/MasterData/Bank/MasterBank';
import CategoriesPage from './pages/MasterData/Categories/CategoriesPage';
import SparepartListPage from './pages/MasterData/Sparepart/SparepartListPage';
import SparepartFormPage from './pages/MasterData/Sparepart/SparepartFormPage';
// Transactions pages
import SalesForm from './pages/Sales/SalesForm';
import ReturPenjualanForm from './pages/Sales/ReturPenjualanForm';
import PurchaseFormPage from './pages/Purchasing/PurchaseFormPage';
import ReturPembelianForm from './pages/Purchasing/ReturPembelianForm';
import StokOpnamePage from './components/StokOpnamePage';
import PembelianBonusForm from './pages/Transactions/PembelianBonusForm';
import PenjualanBonusForm from './pages/Transactions/PenjualanBonusForm';
import CustomerClaimForm from './pages/Transactions/CustomerClaimForm';
// Finance pages
import PenerimaanResi from './pages/Finance/PenerimaanResi';
import PiutangResi from './pages/Finance/PiutangResi';
import PiutangResiListPage from './pages/Finance/PiutangResiListPage';
import PiutangResiFormPage from './pages/Finance/PiutangResiFormPage';
import PiutangResiViewPage from './pages/Finance/PiutangResiViewPage';
import PiutangRetur from './pages/Finance/PiutangRetur';
import PiutangReturListPage from './pages/Finance/PiutangReturListPage';
import PiutangReturFormPage from './pages/Finance/PiutangReturFormPage';
import PiutangReturViewPage from './pages/Finance/PiutangReturViewPage';
import PenambahanSaldo from './pages/Finance/PenambahanSaldo';
import PenambahanSaldoListPage from './pages/Finance/PenambahanSaldoListPage';
import PenambahanSaldoFormPage from './pages/Finance/PenambahanSaldoFormPage';
import PenambahanSaldoViewPage from './pages/Finance/PenambahanSaldoViewPage';
import PenguranganSaldo from './pages/Finance/PenguranganSaldo';
// Reports pages
import StokBarangReport from './pages/Reports/StokBarangReport';
import PembelianReport from './pages/Reports/PembelianReport';
import PenjualanReport from './pages/Reports/PenjualanReport';
import Dashboard from './pages/Dashboard/Dashboard';

// Create MUI theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3B82F6',
      50: '#EFF6FF',
      100: '#DBEAFE',
      700: '#1D4ED8',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1F2937',
      secondary: '#6B7280',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 6,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
  },
});

function App() {
  // Simple gate to inject kodeDivisi from localStorage into components that need it
  const WithDivisi = ({ Component }) => {
    const [kodeDivisi] = useState(
      () => localStorage.getItem('kode_divisi') || import.meta.env.VITE_DEFAULT_KODE_DIVISI || '01'
    );
    // Persist for future navigations
    useEffect(() => {
      if (!localStorage.getItem('kode_divisi')) {
        localStorage.setItem('kode_divisi', kodeDivisi);
      }
    }, [kodeDivisi]);

    return <Component kodeDivisi={kodeDivisi} />;
  };

  return (
    <QueryProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            {/* Dashboard routes with special layout (no sidebar) */}
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            
            {/* All other routes with standard layout (with sidebar) */}
            <Route element={<Layout />}>
              {/* Master */}
              <Route path="/master/divisi" element={<DivisiManager />} />
              <Route path="/master/customer" element={<CustomerListPage />} />
              <Route path="/master/customer/create" element={<CustomerFormPage />} />
              <Route path="/master/customer/edit/:kodeCustomer" element={<CustomerFormPage />} />
              <Route path="/master/kategori" element={<CategoriesPage />} />
              <Route path="/master/sparepart" element={<SparepartListPage />} />
              <Route path="/master/sparepart/create" element={<SparepartFormPage />} />
              <Route path="/master/sparepart/:id/edit" element={<SparepartFormPage />} />
              <Route path="/master/barang" element={<WithDivisi Component={BarangManager} />} />
              <Route path="/master/area" element={<AreaListPage />} />
              <Route path="/master/area/create" element={<AreaFormPage />} />
              <Route path="/master/area/edit/:kodeArea" element={<AreaFormPage />} />
              <Route path="/master/sales" element={<SalesListPage />} />
              <Route path="/master/sales/create" element={<SalesFormPage />} />
              <Route path="/master/sales/edit/:kodeSales" element={<SalesFormPage />} />
              <Route path="/master/supplier" element={<SupplierListPage />} />
              <Route path="/master/supplier/create" element={<SupplierFormPage />} />
              <Route path="/master/supplier/edit/:kodeSupplier" element={<SupplierFormPage />} />
              <Route path="/master/bank" element={<MasterBank />} />
              <Route path="/master/rekening" element={<MasterBank />} />
              {/* Transactions */}
              <Route path="/transactions/invoices" element={<WithDivisi Component={InvoiceManager} />} />
              <Route path="/transactions/penjualan" element={<WithDivisi Component={SalesForm} />} />
              <Route path="/transactions/pembelian" element={<WithDivisi Component={PurchaseFormPage} />} />
              <Route path="/transactions/retur-pembelian" element={<WithDivisi Component={ReturPembelianForm} />} />
              <Route path="/transactions/retur-penjualan" element={<WithDivisi Component={ReturPenjualanForm} />} />
              <Route path="/transactions/stok-opname" element={<WithDivisi Component={StokOpnamePage} />} />
              <Route path="/transactions/pembelian-bonus" element={<WithDivisi Component={PembelianBonusForm} />} />
              <Route path="/transactions/penjualan-bonus" element={<WithDivisi Component={PenjualanBonusForm} />} />
              <Route path="/transactions/customer-claim" element={<WithDivisi Component={CustomerClaimForm} />} />
              {/* Finance */}
              <Route path="/finance/penerimaan-resi" element={<WithDivisi Component={PenerimaanResi} />} />
              <Route path="/finance/piutang-resi" element={<PiutangResiListPage />} />
              <Route path="/finance/piutang-resi/create" element={<PiutangResiFormPage />} />
              <Route path="/finance/piutang-resi/edit/:id" element={<PiutangResiFormPage />} />
              <Route path="/finance/piutang-resi/view/:id" element={<PiutangResiViewPage />} />
              <Route path="/finance/piutang-retur" element={<PiutangReturListPage />} />
              <Route path="/finance/piutang-retur/create" element={<PiutangReturFormPage />} />
              <Route path="/finance/piutang-retur/edit/:id" element={<PiutangReturFormPage />} />
              <Route path="/finance/piutang-retur/view/:id" element={<PiutangReturViewPage />} />
              <Route path="/finance/penambahan-saldo" element={<PenambahanSaldoListPage />} />
              <Route path="/finance/penambahan-saldo/create" element={<PenambahanSaldoFormPage />} />
              <Route path="/finance/penambahan-saldo/edit/:id" element={<PenambahanSaldoFormPage />} />
              <Route path="/finance/penambahan-saldo/view/:id" element={<PenambahanSaldoViewPage />} />
              <Route path="/finance/pengurangan-saldo" element={<WithDivisi Component={PenguranganSaldo} />} />
              {/* Reports */}
              <Route path="/reports/stok-barang" element={<WithDivisi Component={StokBarangReport} />} />
              <Route path="/reports/pembelian" element={<WithDivisi Component={PembelianReport} />} />
              <Route path="/reports/penjualan" element={<WithDivisi Component={PenjualanReport} />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="light" />
    </QueryProvider>
  );
}

export default App;
