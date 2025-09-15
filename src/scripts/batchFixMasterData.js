/**
 * Batch Fix Script untuk semua MasterData components
 * Menerapkan perbaikan standar ke semua komponen sekaligus
 */

import fs from 'fs';
import path from 'path';

const MASTERDATA_PATH = 'd:/Program/Document/GitHub/Stoir/frontend/src/pages/MasterData';

// Template imports yang harus ditambahkan
const REQUIRED_IMPORTS = `import {
  ensureArray,
  generateUniqueKey,
  safeGet,
  standardizeApiResponse,
  handleApiError,
  createLoadingState,
  safeFilter
} from '../../../utils/apiResponseHandler';
import { withErrorBoundary } from '../../../components/ErrorBoundary/MasterDataErrorBoundary';`;

// Mapping komponen ke field mapping yang sesuai
const FIELD_MAPPING_IMPORTS = {
  'MasterCustomers.jsx': `import { standardizeCustomer } from '../../../utils/fieldMapping';`,
  'MasterBarang.jsx': `import { standardizeBarang } from '../../../utils/fieldMapping';`,
  'MasterSparepart.jsx': `import { standardizeSparepart } from '../../../utils/fieldMapping';`,
  'MasterBank.jsx': `import { standardizeBank } from '../../../utils/fieldMapping';`,
};

// Komponen yang perlu diperbaiki
const COMPONENTS_TO_FIX = [
  'Bank/MasterBank.jsx',
  'Checklist/MasterChecklist.jsx',
  'Sales/MasterSales.jsx',
  'Suppliers/MasterSuppliers.jsx',
  'Categories/MasterCategories.jsx',
  'Area/MasterArea.jsx',
];

// Fungsi untuk mendeteksi apakah file menggunakan loading state lama
function hasOldLoadingState(content) {
  return (
    content.includes('const [loading, setLoading]') ||
    content.includes('setLoading(true)') ||
    content.includes('setLoading(false)')
  );
}

// Fungsi untuk mendeteksi apakah file menggunakan array state lama
function hasOldArrayState(content) {
  return (
    content.includes('const [data, setData]') ||
    content.includes('const [customers, setCustomers]') ||
    content.includes('const [barangs, setBarangs]') ||
    content.includes('const [spareparts, setSpareparts]')
  );
}

// Fungsi untuk memperbaiki state management
function fixStateManagement(content, componentName) {
  let fixed = content;

  // Replace old loading state
  if (hasOldLoadingState(content)) {
    fixed = fixed.replace(/const \[loading, setLoading\] = useState\(.*?\);/g, '');
    fixed = fixed.replace(
      /setLoading\(true\)/g,
      'setAppState(prev => ({ ...prev, loading: true, error: null }))'
    );
    fixed = fixed.replace(
      /setLoading\(false\)/g,
      'setAppState(prev => ({ ...prev, loading: false }))'
    );
  }

  // Replace old array state
  if (hasOldArrayState(content)) {
    const arrayStateRegex =
      /const \[(data|customers|barangs|spareparts|items), set[A-Z]\w*\] = useState\(\[\]\);/g;
    fixed = fixed.replace(arrayStateRegex, '');

    // Add new appState
    const stateImportIndex = fixed.indexOf('import React');
    if (stateImportIndex !== -1) {
      const lineEnd = fixed.indexOf('\n', stateImportIndex);
      fixed =
        fixed.substring(0, lineEnd + 1) +
        'const [appState, setAppState] = useState(createLoadingState());\n' +
        fixed.substring(lineEnd + 1);
    }
  }

  return fixed;
}

// Fungsi untuk menambahkan error handling di table
function addErrorHandling(content) {
  let fixed = content;

  // Add error state dalam table body
  const tbodyRegex = /<tbody>[\s\S]*?{loading \? \(/g;
  fixed = fixed.replace(tbodyRegex, match => {
    return match.replace('{loading ? (', '{appState.loading ? (');
  });

  // Add error state setelah loading
  const loadingEndRegex = /\) : currentItems\.length === 0 \? \(/g;
  fixed = fixed.replace(loadingEndRegex, match => {
    return (
      ') : appState.error ? (\n' +
      '                  <tr>\n' +
      '                    <td colSpan="7" className="text-center py-8">\n' +
      '                      <div className="bg-red-50 border border-red-200 rounded-xl p-4">\n' +
      '                        <div className="text-red-600 font-semibold mb-2">⚠️ {appState.error}</div>\n' +
      '                        <button\n' +
      '                          onClick={fetchData}\n' +
      '                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"\n' +
      '                        >\n' +
      '                          🔄 Coba Lagi\n' +
      '                        </button>\n' +
      '                      </div>\n' +
      '                    </td>\n' +
      '                  </tr>\n' +
      '                ' +
      match
    );
  });

  return fixed;
}

// Fungsi untuk menambahkan unique keys
function addUniqueKeys(content) {
  let fixed = content;

  // Replace key={item.id} dengan generateUniqueKey
  const keyRegex = /key={(\w+)\.id}/g;
  fixed = fixed.replace(keyRegex, (match, itemName) => {
    return `key={generateUniqueKey(${itemName}, index, '${itemName}')}`;
  });

  return fixed;
}

// Fungsi untuk menambahkan ErrorBoundary wrapper
function addErrorBoundaryWrapper(content, componentName) {
  let fixed = content;

  // Replace export default
  const exportRegex = /export default (\w+);$/gm;
  fixed = fixed.replace(exportRegex, (match, name) => {
    return `export default withErrorBoundary(${name});`;
  });

  return fixed;
}

// Main function untuk memperbaiki satu file
async function fixComponent(componentPath) {
  const fullPath = path.join(MASTERDATA_PATH, componentPath);
  const componentName = path.basename(componentPath, '.jsx');

  console.log(`🔧 Fixing ${componentName}...`);

  try {
    // Backup original file
    const backupPath = fullPath + '.backup';
    const content = fs.readFileSync(fullPath, 'utf8');
    fs.writeFileSync(backupPath, content);

    let fixed = content;

    // 1. Add required imports
    const importIndex = fixed.indexOf('import React');
    if (importIndex !== -1) {
      const lastImportIndex = fixed.lastIndexOf('import');
      const lineEnd = fixed.indexOf('\n', lastImportIndex);

      fixed =
        fixed.substring(0, lineEnd + 1) +
        REQUIRED_IMPORTS +
        '\n' +
        (FIELD_MAPPING_IMPORTS[path.basename(componentPath)] || '') +
        '\n' +
        fixed.substring(lineEnd + 1);
    }

    // 2. Fix state management
    fixed = fixStateManagement(fixed, componentName);

    // 3. Add error handling
    fixed = addErrorHandling(fixed);

    // 4. Add unique keys
    fixed = addUniqueKeys(fixed);

    // 5. Add ErrorBoundary wrapper
    fixed = addErrorBoundaryWrapper(fixed, componentName);

    // Write fixed file
    fs.writeFileSync(fullPath, fixed);

    console.log(`  ✅ ${componentName} fixed successfully`);
    console.log(`  💾 Backup saved: ${backupPath}`);
  } catch (error) {
    console.error(`  ❌ Error fixing ${componentName}:`, error.message);
  }
}

// Batch fix all components
async function batchFixComponents() {
  console.log('🚀 Starting batch fix for MasterData components...\n');

  for (const componentPath of COMPONENTS_TO_FIX) {
    await fixComponent(componentPath);
  }

  console.log('\n🎉 Batch fix completed!');
  console.log('📝 All original files backed up with .backup extension');
  console.log('🔄 Please restart development server to see changes');
}

// Export untuk digunakan sebagai script
export { batchFixComponents, fixComponent };

// Run jika dipanggil langsung
if (import.meta.url === `file://${process.argv[1]}`) {
  batchFixComponents().catch(console.error);
}
