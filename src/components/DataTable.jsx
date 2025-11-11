import React, { useMemo } from 'react';
import { Edit, Trash2, Eye, Plus } from 'lucide-react';

const DataTable = ({ 
  title,
  subtitle,
  columns,
  data = [],
  onAdd,
  onEdit,
  onDelete,
  onView,
  emptyStateText = "Belum ada data",
  emptyStateSubtext = "Klik tombol tambah untuk memulai",
  borderColor = "border-blue-500",
  addButtonText = "Tambah Data",
  isLoading = false,
  sortBy = null, // Field to sort by (e.g., 'createdAt', 'date', 'tanggal')
  sortOrder = 'desc' // 'asc' or 'desc' - default to newest first
}) => {
  
  // Sort data automatically
  const sortedData = useMemo(() => {
    if (!sortBy || !data.length) return data;
    
    return [...data].sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      // Handle different data types
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        // Try to parse as dates first
        const aDate = new Date(aValue);
        const bDate = new Date(bValue);
        
        if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
          // Both are valid dates
          aValue = aDate.getTime();
          bValue = bDate.getTime();
        } else {
          // String comparison
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
      }
      
      // Sort logic
      if (sortOrder === 'desc') {
        return bValue > aValue ? 1 : bValue < aValue ? -1 : 0;
      } else {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      }
    });
  }, [data, sortBy, sortOrder]);
  
  const renderCell = (item, column) => {
    if (column.render) {
      return column.render(item[column.key], item);
    }
    
    if (column.type === 'currency') {
      const value = parseFloat(item[column.key]) || 0;
      return new Intl.NumberFormat('id-ID', { 
        style: 'currency', 
        currency: 'IDR' 
      }).format(value);
    }
    
    if (column.type === 'number') {
      return new Intl.NumberFormat('id-ID').format(item[column.key] || 0);
    }
    
    if (column.type === 'date') {
      return item[column.key] ? new Date(item[column.key]).toLocaleDateString('id-ID') : '-';
    }
    
    return item[column.key] || '-';
  };

  return (
    <div className={`bg-white rounded-xl border-l-4 ${borderColor} shadow-sm border border-gray-100`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          {onAdd && (
            <button 
              onClick={onAdd}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{addButtonText}</span>
            </button>
          )}
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th 
                    key={column.key}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.title}
                  </th>
                ))}
                {(onEdit || onDelete || onView) && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-3"></div>
                      <p className="text-sm font-medium">Memuat data...</p>
                    </div>
                  </td>
                </tr>
              ) : sortedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                        <Plus className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium">{emptyStateText}</p>
                      <p className="text-xs mt-1">{emptyStateSubtext}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedData.map((item, index) => (
                  <tr 
                    key={item.id || index} 
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-150`}
                  >
                    {columns.map((column) => (
                      <td key={column.key} className="px-4 py-3 text-sm text-gray-900">
                        {renderCell(item, column)}
                      </td>
                    ))}
                    {(onEdit || onDelete || onView) && (
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center space-x-2">
                          {onView && (
                            <button
                              onClick={() => onView(item)}
                              className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded transition-colors duration-150"
                              title="Lihat Detail"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          {onEdit && (
                            <button
                              onClick={() => onEdit(item)}
                              className="p-1 text-gray-500 hover:text-green-600 hover:bg-green-100 rounded transition-colors duration-150"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(item)}
                              className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded transition-colors duration-150"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        {sortedData.length > 0 && (
          <div className="mt-4 text-sm text-gray-500">
            Menampilkan {sortedData.length} data
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable;
