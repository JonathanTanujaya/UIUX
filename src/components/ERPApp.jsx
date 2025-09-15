import React, { useState } from 'react';
import DivisiManager from './DivisiManager';
import CustomerManager from './CustomerManager';
import BarangManager from './BarangManager';
import InvoiceManager from './InvoiceManager';
import ReportsManager from './ReportsManager';
import ProcedureManager from './ProcedureManager';

const ERPApp = () => {
  const [activeTab, setActiveTab] = useState('divisi');
  const [selectedDivisi, setSelectedDivisi] = useState('');

  const tabs = [
    { id: 'divisi', label: 'Divisi', component: DivisiManager },
    { id: 'customer', label: 'Customer', component: CustomerManager },
    { id: 'barang', label: 'Barang', component: BarangManager },
    { id: 'invoice', label: 'Invoice', component: InvoiceManager },
    { id: 'reports', label: 'Reports', component: ReportsManager },
    { id: 'procedures', label: 'Procedures', component: ProcedureManager },
  ];

  const renderActiveComponent = () => {
    const activeTabData = tabs.find(tab => tab.id === activeTab);
    if (!activeTabData) return null;

    const Component = activeTabData.component;
    
    if (activeTab === 'divisi') {
      return <Component onDivisiSelect={setSelectedDivisi} />;
    }
    
    if (activeTab === 'reports' || activeTab === 'procedures') {
      return <Component />;
    }
    
    return <Component kodeDivisi={selectedDivisi} />;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">ERP System</h1>
            </div>
            {selectedDivisi && (
              <div className="text-sm text-gray-500">
                Active Divisi: <span className="font-medium">{selectedDivisi}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Divisi Selection Alert for non-divisi tabs */}
        {activeTab !== 'divisi' && activeTab !== 'reports' && activeTab !== 'procedures' && !selectedDivisi && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Divisi Required
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Please select a divisi first by going to the Divisi tab, or select one here:
                  </p>
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Enter Kode Divisi"
                      value={selectedDivisi}
                      onChange={(e) => setSelectedDivisi(e.target.value)}
                      className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Component Rendering */}
        <div className="px-4 py-6 sm:px-0">
          {renderActiveComponent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            ERP System - Built with Laravel & React
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ERPApp;
