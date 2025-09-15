import React from 'react';
import QueryProvider from '../providers/QueryProvider';
import CustomerTable from '../components/Tables/CustomerTable';
import BarangTable from '../components/Tables/BarangTable';
import InvoiceTable from '../components/Tables/InvoiceTable';
import { useCustomers, useBarang, useInvoices } from '../hooks/useApi';

// Example page showing React Query integration
const DataExamplePage = () => {
  const handleCustomerSelect = customer => {
    console.log('Selected customer:', customer);
  };

  const handleBarangSelect = barang => {
    console.log('Selected product:', barang);
  };

  const handleInvoiceSelect = invoice => {
    console.log('Selected invoice:', invoice);
  };

  return (
    <div className="data-example-page">
      <div className="page-header">
        <h1>React Query Data Integration Examples</h1>
        <p>Demonstrating all database table endpoints with React Query</p>
      </div>

      <div className="example-sections">
        {/* Customers Section */}
        <section className="data-section">
          <h2>Customer Management</h2>
          <p>Customer master data with search and pagination</p>
          <CustomerTable onCustomerSelect={handleCustomerSelect} pageSize={10} />
        </section>

        {/* Products Section */}
        <section className="data-section">
          <h2>Product Catalog</h2>
          <p>Product/barang data with stock levels and pricing</p>
          <BarangTable onBarangSelect={handleBarangSelect} showDivision={true} pageSize={15} />
        </section>

        {/* Invoices Section */}
        <section className="data-section">
          <h2>Sales Invoices</h2>
          <p>Invoice transactions with status tracking</p>
          <InvoiceTable onInvoiceSelect={handleInvoiceSelect} showDivision={true} pageSize={10} />
        </section>

        {/* API Hook Examples */}
        <section className="data-section">
          <h2>Direct Hook Usage Examples</h2>
          <div className="hook-examples">
            <HookExample />
          </div>
        </section>
      </div>
    </div>
  );
};

// Component demonstrating direct hook usage
const HookExample = () => {
  const { data: customers, isLoading: customersLoading } = useCustomers();
  const { data: products, isLoading: productsLoading } = useBarang();
  const { data: invoices, isLoading: invoicesLoading } = useInvoices();

  return (
    <div className="hook-example-grid">
      <div className="hook-example-card">
        <h3>Customers Hook</h3>
        <p>Loading: {customersLoading ? 'Yes' : 'No'}</p>
        <p>Count: {customers?.data?.length || 0}</p>
        <pre className="code-example">{`const { data, isLoading, error } = useCustomers();`}</pre>
      </div>

      <div className="hook-example-card">
        <h3>Products Hook</h3>
        <p>Loading: {productsLoading ? 'Yes' : 'No'}</p>
        <p>Count: {products?.data?.length || 0}</p>
        <pre className="code-example">{`const { data, isLoading, error } = useBarang();`}</pre>
      </div>

      <div className="hook-example-card">
        <h3>Invoices Hook</h3>
        <p>Loading: {invoicesLoading ? 'Yes' : 'No'}</p>
        <p>Count: {invoices?.data?.length || 0}</p>
        <pre className="code-example">{`const { data, isLoading, error } = useInvoices();`}</pre>
      </div>
    </div>
  );
};

// Main App component with QueryProvider
const App = () => {
  return (
    <QueryProvider>
      <div className="App">
        <DataExamplePage />
      </div>
    </QueryProvider>
  );
};

export default App;
