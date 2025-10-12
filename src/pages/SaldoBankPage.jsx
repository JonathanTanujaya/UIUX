import React from 'react';

// DEPRECATED: Halaman ini sudah digabung ke Master Bank & Rekening
// Redirect users to the new unified page
function SaldoBankPage() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <div style={{ 
        backgroundColor: '#fff3cd', 
        border: '1px solid #ffeaa7', 
        borderRadius: '8px', 
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h2>⚠️ Halaman Dipindahkan</h2>
        <p>Halaman Saldo Bank telah digabungkan dengan Master Bank & Rekening.</p>
        <p>Silahkan gunakan menu <strong>Master Data → Bank & Rekening</strong></p>
        <div style={{ marginTop: '15px' }}>
          <a 
            href="/master/bank" 
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              padding: '10px 20px',
              textDecoration: 'none',
              borderRadius: '5px',
              display: 'inline-block'
            }}
          >
            🏦 Ke Master Bank & Rekening
          </a>
        </div>
      </div>
    </div>
  );
}

export default SaldoBankPage;
