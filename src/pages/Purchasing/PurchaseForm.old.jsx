import React from 'react';
import ModernInventoryForm from '../../components/ModernInventoryForm';

function PurchaseForm() {
  // For now, we'll use the modern inventory form
  // Later we can integrate the existing purchase form logic with the new design
  return <ModernInventoryForm />;
}

export default PurchaseForm;
  const {
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
  } = usePurchaseForm();

  return (
    <div className={`purchase-form ${printMode ? 'print-mode' : ''}`}>
      <div className="pf-header">
        <div className="pf-controls no-print">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={mergeSame}
              onChange={e => setMergeSame(e.target.checked)}
            />
            Gabung Item Sama
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={autoSaveDraft}
              onChange={e => setAutoSaveDraft(e.target.checked)}
            />
            Auto Save Draft
          </label>
          {lastSaved && <span className="text-xs text-gray-500">Tersimpan: {lastSaved}</span>}
          <button onClick={clearDraft} className="btn-secondary mini">
            Hapus Draft
          </button>
          <button onClick={() => setPrintMode(!printMode)} className="btn-secondary">
            {printMode ? 'Mode Normal' : 'Mode Print'}
          </button>
          <button
            onClick={() => setShowShortcuts(!showShortcuts)}
            className="btn-secondary mini"
            title="Keyboard Shortcuts"
          >
            ⌨️
          </button>
        </div>
      </div>

      <div className="pf-header-form">
        <div className="pf-field">
          <label>Tgl Terima</label>
          <input
            type="date"
            value={header.receiptDate}
            onChange={e => setHeader(h => ({ ...h, receiptDate: e.target.value }))}
          />
        </div>
        <div className="pf-field">
          <label>Tgl Jatuh Tempo</label>
          <input
            type="date"
            value={header.dueDate}
            onChange={e => setHeader(h => ({ ...h, dueDate: e.target.value }))}
          />
        </div>
        <div className="pf-field">
          <label>
            No Faktur
            {checkingInvoice && <span className="text-xs text-blue-500 ml-1">(checking...)</span>}
          </label>
          <div className="pf-invoice-field">
            <input
              value={header.invoiceNumber}
              onChange={e => setHeader(h => ({ ...h, invoiceNumber: e.target.value }))}
              className={invoiceExists ? 'error' : ''}
              placeholder="PO2024001"
            />
            {invoiceExists && <span className="error-indicator">⚠ Sudah ada</span>}
          </div>
        </div>
        <div className="pf-field span-2">
          <label>Supplier</label>
          <div className="pf-supplier-select">
            <input value={header.supplier?.name || ''} placeholder="(pilih)" readOnly />
            <button
              type="button"
              className="btn-secondary mini"
              onClick={() => setSupplierModalOpen(true)}
            >
              Cari
            </button>
          </div>
        </div>
        <div className="pf-field">
          <label>PPN %</label>
          <input
            type="number"
            value={header.taxPercent}
            onChange={e => setHeader(h => ({ ...h, taxPercent: e.target.value }))}
          />
        </div>
        <div className="pf-field">
          <label>Diskon Global</label>
          <input
            type="text"
            value={formatCurrency(header.globalDiscount)}
            onChange={e =>
              setHeader(h => ({ ...h, globalDiscount: e.target.value.replace(/[^\d]/g, '') }))
            }
          />
        </div>
        <div className="pf-field span-2">
          <label>Catatan</label>
          <input
            value={header.note}
            onChange={e => setHeader(h => ({ ...h, note: e.target.value }))}
            placeholder="Optional"
          />
        </div>
      </div>

      <div className="pf-entry-bar no-print" onKeyDown={handleKeyPress}>
        <input
          className="pf-code"
          placeholder="Kode"
          value={entry.code}
          onChange={e => setEntry(v => ({ ...v, code: e.target.value }))}
        />
        <input
          className="pf-name"
          placeholder="Nama Barang"
          value={entry.name}
          onChange={e => setEntry(v => ({ ...v, name: e.target.value }))}
        />
        <input
          className="pf-qty"
          type="number"
          placeholder="Qty"
          value={entry.qty}
          onChange={e => setEntry(v => ({ ...v, qty: e.target.value }))}
        />
        <input
          className="pf-unit"
          placeholder="Satuan"
          value={entry.unit}
          onChange={e => setEntry(v => ({ ...v, unit: e.target.value }))}
        />
        <input
          className="pf-price"
          type="text"
          placeholder="Harga"
          value={formatCurrency(entry.price)}
          onChange={e => handleCurrencyInput('price', e.target.value)}
        />
        <input
          className="pf-disc"
          type="number"
          placeholder="D1%"
          value={entry.disc1}
          onChange={e => setEntry(v => ({ ...v, disc1: e.target.value }))}
        />
        <input
          className="pf-disc"
          type="number"
          placeholder="D2%"
          value={entry.disc2}
          onChange={e => setEntry(v => ({ ...v, disc2: e.target.value }))}
        />
        {editingRow ? (
          <div className="pf-edit-actions">
            <button type="button" className="btn-primary pf-add" onClick={applyEdit}>
              Simpan
            </button>
            <button type="button" className="btn-secondary pf-add" onClick={cancelEdit}>
              Batal
            </button>
          </div>
        ) : (
          <>
            <button type="button" className="btn-primary pf-add" onClick={addItem}>
              Tambah
            </button>
            <button
              type="button"
              className="btn-secondary pf-add"
              onClick={() => setProductModalOpen(true)}
            >
              Cari
            </button>
          </>
        )}
      </div>

      <div className="pf-items">
        <table>
          <thead>
            <tr>
              <th className="w-12">No</th>
              <th className="w-20">Kode</th>
              <th className="w-40">Nama Barang</th>
              <th className="w-12">Qty</th>
              <th className="w-12">Satuan</th>
              <th className="w-20">Harga</th>
              <th className="w-12">D1%</th>
              <th className="w-12">D2%</th>
              <th className="w-20">Harga Net</th>
              <th className="w-20">Subtotal</th>
              <th className="w-16 no-print">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map((r, i) => (
              <tr key={r.idTemp}>
                <td className="num">{i + 1}</td>
                <td className="mono">{r.code}</td>
                <td>{r.name}</td>
                <td className="num">{r.qty}</td>
                <td>{r.unit}</td>
                <td className="num">{formatNumber(r.price)}</td>
                <td className="num">{r.disc1}%</td>
                <td className="num">{r.disc2}%</td>
                <td className="num">{formatNumber(r.netPrice)}</td>
                <td className="num">{formatNumber(r.subTotal)}</td>
                <td className="no-print">
                  <div className="pf-row-actions">
                    <button className="btn-icon-sm" onClick={() => startEditRow(r)} title="Edit">
                      ✎
                    </button>
                    <button
                      className="btn-icon-sm"
                      onClick={() => removeItem(r.idTemp)}
                      title="Hapus"
                    >
                      ✕
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan="11" className="text-center text-gray-400 py-4">
                  Belum ada item
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pf-totals">
        <div className="pf-tot-line">
          <span>Total</span>
          <span>{formatNumber(totals.total)}</span>
        </div>
        <div className="pf-tot-line">
          <span>Diskon Global</span>
          <span>{formatNumber(header.globalDiscount)}</span>
        </div>
        <div className="pf-tot-line">
          <span>DPP</span>
          <span>{formatNumber(totals.afterDisc)}</span>
        </div>
        <div className="pf-tot-line">
          <span>PPN ({header.taxPercent}%)</span>
          <span>{formatNumber(totals.tax)}</span>
        </div>
        <div className="pf-tot-grand pf-tot-line">
          <span>Grand Total</span>
          <span>{formatNumber(totals.grand)}</span>
        </div>
        <div className="pf-actions no-print">
          <button
            type="button"
            className="btn-primary"
            disabled={saving || checkingInvoice || invoiceExists}
            onClick={submit}
          >
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>

      <div className="pf-print-footer">
        <div className="sign-col">
          Dibuat Oleh
          <br />
          <br />
          <br />
          ________________
        </div>
        <div className="sign-col">
          Diperiksa
          <br />
          <br />
          <br />
          ________________
        </div>
        <div className="sign-col">
          Disetujui
          <br />
          <br />
          <br />
          ________________
        </div>
      </div>

      {/* Supplier Modal */}
      {supplierModalOpen && (
        <div className="modal-overlay no-print">
          <div className="modal-content pf-modal">
            <div className="modal-header">
              <h3>Pilih Supplier</h3>
              <button onClick={() => setSupplierModalOpen(false)} className="modal-close">
                ×
              </button>
            </div>
            <div className="modal-body pf-modal-body">
              <input
                placeholder="Cari supplier..."
                value={supplierLookup}
                onChange={e => setSupplierLookup(e.target.value)}
                className="form-input w-full mb-2"
              />
              <div className="pf-modal-list">
                {supplierResults.map(s => (
                  <button key={s.id} className="pf-modal-row" onClick={() => pickSupplier(s)}>
                    <span className="mono w-24 text-left">{s.kodecust || s.kode || s.code}</span>
                    <span className="flex-1 text-left">{s.nama || s.namacust || s.name}</span>
                  </button>
                ))}
                {supplierLookup && supplierResults.length === 0 && (
                  <div className="pf-modal-empty">Tidak ada hasil</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {productModalOpen && (
        <div className="modal-overlay no-print">
          <div className="modal-content pf-modal">
            <div className="modal-header">
              <h3>Pilih Barang</h3>
              <button onClick={() => setProductModalOpen(false)} className="modal-close">
                ×
              </button>
            </div>
            <div className="modal-body pf-modal-body">
              <input
                placeholder="Cari barang..."
                value={productLookup}
                onChange={e => setProductLookup(e.target.value)}
                className="form-input w-full mb-2"
              />
              <div className="pf-modal-list">
                {productResults.map(p => (
                  <button key={p.id} className="pf-modal-row" onClick={() => pickProduct(p)}>
                    <span className="mono w-24 text-left">{p.kode_barang || p.kode || p.code}</span>
                    <span className="flex-1 text-left">
                      {p.nama_barang || p.namaBarang || p.name}
                    </span>
                    <span className="num w-24">{p.modal || p.harga || p.price}</span>
                  </button>
                ))}
                {productLookup && productResults.length === 0 && (
                  <div className="pf-modal-empty">Tidak ada hasil</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shortcuts Help */}
      {showShortcuts && (
        <div className="modal-overlay no-print">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3>Keyboard Shortcuts</h3>
              <button onClick={() => setShowShortcuts(false)} className="modal-close">
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="shortcuts-grid">
                <div>
                  <kbd>Ctrl+S</kbd> Simpan
                </div>
                <div>
                  <kbd>Ctrl+D</kbd> Hapus Draft
                </div>
                <div>
                  <kbd>Ctrl+P</kbd> Toggle Print Mode
                </div>
                <div>
                  <kbd>Ctrl+F</kbd> Cari Supplier
                </div>
                <div>
                  <kbd>Ctrl+G</kbd> Cari Barang
                </div>
                <div>
                  <kbd>Enter</kbd> Tambah/Simpan Item
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PurchaseForm;
