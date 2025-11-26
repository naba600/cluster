import React from 'react';
import { TransactionRow } from '../types';
import { Trash2, Plus, Upload, Eye } from 'lucide-react';

interface TransactionTableProps {
  rows: TransactionRow[];
  setRows: React.Dispatch<React.SetStateAction<TransactionRow[]>>;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ rows, setRows }) => {

  const handleInputChange = (id: string, field: keyof TransactionRow, value: string | number) => {
    setRows(prev => prev.map(row => {
      if (row.id === id) {
        // Handle number conversions for financial fields
        if (['principal', 'interest', 'monthlySavings', 'overdue'].includes(field)) {
          return { ...row, [field]: Number(value) || 0 };
        }
        return { ...row, [field]: value };
      }
      return row;
    }));
  };

  const handleFileUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024) { // 100KB validation
        alert("File size exceeds 100KB limit.");
        e.target.value = ''; // Reset input
        return;
      }
      
      // Create a local preview URL
      const objectUrl = URL.createObjectURL(file);

      setRows(prev => prev.map(row => {
        if (row.id === id) {
           return { ...row, fileName: file.name, filePreview: objectUrl };
        }
        return row;
      }));
    }
  };

  const addRow = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newRow: TransactionRow = {
      id: newId,
      slNo: rows.length + 1,
      doseNo: '',
      voucherNo: '',
      principal: 0,
      interest: 0,
      monthlySavings: 0,
      overdue: 0,
      fileName: ''
    };
    setRows([...rows, newRow]);
  };

  const removeRow = () => {
    if (rows.length > 1) {
      setRows(rows.slice(0, -1));
    }
  };

  // Helper to calculate row total
  const calculateTotal = (row: TransactionRow) => {
    return (row.principal + row.interest + row.monthlySavings + row.overdue).toFixed(2);
  };

  return (
    <div className="mt-6">
      <div className="overflow-x-auto border border-gray-300 rounded-t-lg">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-300">
            <tr>
              <th className="px-2 py-3 border-r text-center w-16">Sl.no</th>
              <th className="px-2 py-3 border-r text-center">Dose no *</th>
              <th className="px-2 py-3 border-r text-center">Voucher No *</th>
              <th className="px-2 py-3 border-r text-center">Principal *</th>
              <th className="px-2 py-3 border-r text-center">Interest *</th>
              <th className="px-2 py-3 border-r text-center">Monthly Savings *</th>
              <th className="px-2 py-3 border-r text-center">Over due if any</th>
              <th className="px-2 py-3 border-r text-center bg-gray-100">Total</th>
              <th className="px-2 py-3 text-center w-48">
                File Upload *
                <div className="text-[10px] text-red-500 normal-case">(max 100kb jpg/png)</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-2 py-2 border-r text-center">
                  <input
                    type="text"
                    value={index + 1}
                    readOnly
                    className="w-full text-center bg-transparent outline-none cursor-default"
                  />
                </td>
                <td className="px-2 py-2 border-r">
                  <input
                    type="text"
                    value={row.doseNo}
                    onChange={(e) => handleInputChange(row.id, 'doseNo', e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-green-500 outline-none"
                    required
                  />
                </td>
                <td className="px-2 py-2 border-r">
                  <input
                    type="text"
                    value={row.voucherNo}
                    onChange={(e) => handleInputChange(row.id, 'voucherNo', e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-green-500 outline-none"
                    required
                  />
                </td>
                <td className="px-2 py-2 border-r">
                  <input
                    type="number"
                    min="0"
                    value={row.principal || ''}
                    onChange={(e) => handleInputChange(row.id, 'principal', e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-green-500 outline-none text-right"
                    required
                  />
                </td>
                <td className="px-2 py-2 border-r">
                  <input
                    type="number"
                    min="0"
                    value={row.interest || ''}
                    onChange={(e) => handleInputChange(row.id, 'interest', e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-green-500 outline-none text-right"
                    required
                  />
                </td>
                <td className="px-2 py-2 border-r">
                  <input
                    type="number"
                    min="0"
                    value={row.monthlySavings || ''}
                    onChange={(e) => handleInputChange(row.id, 'monthlySavings', e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-green-500 outline-none text-right"
                    required
                  />
                </td>
                <td className="px-2 py-2 border-r">
                  <input
                    type="number"
                    min="0"
                    value={row.overdue || ''}
                    onChange={(e) => handleInputChange(row.id, 'overdue', e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-green-500 outline-none text-right"
                  />
                </td>
                <td className="px-2 py-2 border-r bg-gray-50">
                  <div className="w-full text-right font-semibold text-gray-800 px-2">
                    {calculateTotal(row)}
                  </div>
                </td>
                <td className="px-2 py-2 text-center">
                   <div className="flex flex-col items-center justify-center space-y-1">
                    <div className="flex items-center space-x-2">
                      <label className={`cursor-pointer text-xs py-1 px-2 border rounded inline-flex items-center ${row.fileName ? 'bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-800' : 'bg-green-50 hover:bg-green-100 border-green-300 text-green-700'}`}>
                          <Upload size={12} className="mr-1" />
                          {row.fileName ? 'Change' : 'Upload'}
                          <input type='file' className="hidden" accept="image/png, image/jpeg" onChange={(e) => handleFileUpload(row.id, e)} />
                      </label>
                      {row.filePreview && (
                        <a 
                          href={row.filePreview} 
                          target="_blank" 
                          rel="noreferrer"
                          className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs py-1 px-2 border border-blue-300 rounded inline-flex items-center"
                          title="View Uploaded File"
                        >
                          <Eye size={12} />
                        </a>
                      )}
                    </div>
                    <span className={`text-[10px] truncate max-w-[100px] ${row.fileName ? 'text-gray-500' : 'text-red-400'}`} title={row.fileName}>
                        {row.fileName || "Required"}
                    </span>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex space-x-3 mt-4">
        <button
          onClick={addRow}
          type="button"
          className="flex items-center bg-green-600 hover:bg-green-700 text-white font-medium py-1.5 px-4 rounded text-sm transition-colors shadow-sm"
        >
          <Plus size={16} className="mr-1" /> Add Item
        </button>
        <button
          onClick={removeRow}
          type="button"
          className={`flex items-center font-medium py-1.5 px-4 rounded text-sm transition-colors shadow-sm ${rows.length <= 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'}`}
          disabled={rows.length <= 1}
        >
          <Trash2 size={16} className="mr-1" /> Remove Item
        </button>
      </div>

      <div className="mt-2 bg-yellow-100 border border-yellow-300 text-yellow-800 text-xs p-2 rounded">
        <strong>N.B.:-</strong> Upload your payment voucher as a JPG or PNG file. The maximum file size allowed is 100KB.
      </div>
    </div>
  );
};

export default TransactionTable;
