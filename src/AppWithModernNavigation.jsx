import React, { useMemo, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ModernLayout from './components/Layout/ModernLayout';
import DivisiManager from './components/DivisiManager';
import CustomerManager from './components/CustomerManager';
import BarangManager from './components/BarangManager';
import InvoiceManager from './components/InvoiceManager';
// Master Data pages
import MasterArea from './pages/MasterData/Area/MasterArea';
import MasterSales from './pages/MasterData/Sales/MasterSales';
import MasterSuppliers from './pages/MasterData/Suppliers/MasterSuppliers';
import MasterBank from './pages/MasterData/Bank/MasterBank';
import ModernMasterCategories from './pages/MasterData/Categories/ModernMasterCategories';
import MasterSparepartOptimized from './pages/MasterData/Sparepart/MasterSparepartOptimized';
import MasterChecklistOptimized from './pages/MasterData/Checklist/MasterChecklistOptimized';
// Transactions pages
import SalesForm from './pages/Sales/SalesForm';
import ReturPenjualanForm from './pages/Sales/ReturPenjualanForm';
import PurchaseFormModern from './pages/Purchasing/PurchaseFormModern';
import ReturPembelianForm from './pages/Purchasing/ReturPembelianForm';
import StokOpnameForm from './pages/Transactions/StokOpnameForm';
import PembelianBonusForm from './pages/Transactions/PembelianBonusForm';
import PenjualanBonusForm from './pages/Transactions/PenjualanBonusForm';
import CustomerClaimForm from './pages/Transactions/CustomerClaimForm';
// Finance pages
import PenerimaanResi from './pages/Finance/PenerimaanResi';
import PiutangResi from './pages/Finance/PiutangResi';
import PiutangRetur from './pages/Finance/PiutangRetur';
import PenambahanSaldo from './pages/Finance/PenambahanSaldo';
import PenguranganSaldo from './pages/Finance/PenguranganSaldo';
// Reports pages
import StokBarangReport from './pages/Reports/StokBarangReport';
import PembelianReport from './pages/Reports/PembelianReport';
import PenjualanReport from './pages/Reports/PenjualanReport';

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

// Demo page components
const DashboardPage = () => (
  <div>
    <h1>Dashboard</h1>
    <p>Welcome to the new navigation system!</p>
  </div>
);

// Simple placeholders removed in favor of real pages

function AppWithModernNavigation() {
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route element={<ModernLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            {/* Master */}
            <Route path="/master/divisi" element={<DivisiManager />} />
            <Route path="/master/customer" element={<WithDivisi Component={CustomerManager} />} />
            <Route path="/master/kategori" element={<ModernMasterCategories />} />
            <Route path="/master/sparepart" element={<MasterSparepartOptimized />} />
            <Route path="/master/checklist" element={<MasterChecklistOptimized />} />
            <Route path="/master/barang" element={<WithDivisi Component={BarangManager} />} />
            <Route path="/master/area" element={<MasterArea />} />
            <Route path="/master/sales" element={<MasterSales />} />
            <Route path="/master/supplier" element={<MasterSuppliers />} />
            <Route path="/master/bank" element={<MasterBank />} />
            <Route path="/master/rekening" element={<MasterBank />} />
            {/* Transactions */}
            <Route path="/transactions/invoices" element={<WithDivisi Component={InvoiceManager} />} />
            <Route path="/transactions/penjualan" element={<WithDivisi Component={SalesForm} />} />
            <Route path="/transactions/pembelian" element={<WithDivisi Component={PurchaseFormModern} />} />
            <Route path="/transactions/retur-pembelian" element={<WithDivisi Component={ReturPembelianForm} />} />
            <Route path="/transactions/retur-penjualan" element={<WithDivisi Component={ReturPenjualanForm} />} />
            <Route path="/transactions/stok-opname" element={<WithDivisi Component={StokOpnameForm} />} />
            <Route path="/transactions/pembelian-bonus" element={<WithDivisi Component={PembelianBonusForm} />} />
            <Route path="/transactions/penjualan-bonus" element={<WithDivisi Component={PenjualanBonusForm} />} />
            <Route path="/transactions/customer-claim" element={<WithDivisi Component={CustomerClaimForm} />} />
            {/* Finance */}
            <Route path="/finance/penerimaan-resi" element={<WithDivisi Component={PenerimaanResi} />} />
            <Route path="/finance/piutang-resi" element={<WithDivisi Component={PiutangResi} />} />
            <Route path="/finance/piutang-retur" element={<WithDivisi Component={PiutangRetur} />} />
            <Route path="/finance/penambahan-saldo" element={<WithDivisi Component={PenambahanSaldo} />} />
            <Route path="/finance/pengurangan-saldo" element={<WithDivisi Component={PenguranganSaldo} />} />
            {/* Reports */}
            <Route path="/reports/stok-barang" element={<WithDivisi Component={StokBarangReport} />} />
            <Route path="/reports/pembelian" element={<WithDivisi Component={PembelianReport} />} />
            <Route path="/reports/penjualan" element={<WithDivisi Component={PenjualanReport} />} />
            {/* Add all your existing routes here */}
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default AppWithModernNavigation;
