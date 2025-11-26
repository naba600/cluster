import React from 'react';
import { FormData } from '../types';
import { FileText, Calendar, Wallet, Phone, MapPin, Edit, Trash2, ExternalLink } from 'lucide-react';

interface SummaryReportProps {
  data: FormData[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const SummaryReport: React.FC<SummaryReportProps> = ({ data, onEdit, onDelete }) => {
  if (data.length === 0) return null;

  return (
    <div className="mt-12 mb-20 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-green-600 pl-3">Submission Summary</h2>
        <span className="text-sm text-gray-500">Total Entries: {data.length}</span>
      </div>

      <div className="space-y-8">
        {data.map((entry) => {
          const grandTotal = entry.transactions.reduce((acc, curr) => 
            acc + curr.principal + curr.interest + curr.monthlySavings + curr.overdue, 0
          );

          return (
            <div key={entry.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden relative group">
              {/* Card Header */}
              <div className="bg-gray-50 border-b border-gray-200 p-4 md:p-6 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="space-y-1">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                        <Wallet className="w-5 h-5 mr-2 text-green-600" />
                        {entry.voName}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                        VCDC: {entry.vcdcName || "Not selected"}
                    </div>
                </div>
                
                <div className="flex flex-col md:items-end space-y-1 text-sm text-gray-600">
                    <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        Repayment Date: <span className="font-medium text-gray-900 ml-1">{entry.repaymentDate}</span>
                    </div>
                    <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        Mobile: <span className="font-medium text-gray-900 ml-1">{entry.mobileNumber}</span>
                    </div>
                    <div className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium inline-block mt-1">
                        Source: {entry.fundSource}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex space-x-2">
                    <button 
                        onClick={() => onEdit(entry.id)}
                        className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors shadow-sm"
                        title="Edit Entry"
                    >
                        <Edit size={16} />
                    </button>
                    <button 
                        onClick={() => onDelete(entry.id)}
                        className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors shadow-sm"
                        title="Delete Entry"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3">Dose No</th>
                      <th className="px-6 py-3">Voucher</th>
                      <th className="px-6 py-3 text-right">Principal</th>
                      <th className="px-6 py-3 text-right">Interest</th>
                      <th className="px-6 py-3 text-right">Savings</th>
                      <th className="px-6 py-3 text-right">Total</th>
                      <th className="px-6 py-3 text-center">File</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entry.transactions.map((tx) => {
                        const rowTotal = tx.principal + tx.interest + tx.monthlySavings + tx.overdue;
                        return (
                            <tr key={tx.id} className="border-b last:border-0 hover:bg-gray-50/50">
                                <td className="px-6 py-3 font-medium text-gray-900">{tx.doseNo || "-"}</td>
                                <td className="px-6 py-3 text-gray-500">{tx.voucherNo || "-"}</td>
                                <td className="px-6 py-3 text-right font-mono">{tx.principal.toFixed(2)}</td>
                                <td className="px-6 py-3 text-right font-mono">{tx.interest.toFixed(2)}</td>
                                <td className="px-6 py-3 text-right font-mono">{tx.monthlySavings.toFixed(2)}</td>
                                <td className="px-6 py-3 text-right font-mono font-bold text-gray-900">{rowTotal.toFixed(2)}</td>
                                <td className="px-6 py-3 text-center">
                                    {tx.filePreview ? (
                                        <a 
                                            href={tx.filePreview} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200"
                                        >
                                            <FileText className="w-3 h-3 mr-1" />
                                            View File
                                            <ExternalLink className="w-3 h-3 ml-1 opacity-50" />
                                        </a>
                                    ) : tx.fileName ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                            <FileText className="w-3 h-3 mr-1" />
                                            {tx.fileName}
                                        </span>
                                    ) : (
                                        <span className="text-gray-300">-</span>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                  </tbody>
                  <tfoot className="bg-gray-50 font-bold text-gray-900">
                    <tr>
                        <td colSpan={5} className="px-6 py-3 text-right uppercase text-xs tracking-wider">Grand Total</td>
                        <td className="px-6 py-3 text-right text-base text-green-700">{grandTotal.toFixed(2)}</td>
                        <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <div className="bg-gray-50 px-4 py-2 border-t border-gray-200 text-xs text-gray-400 text-right">
                Entry ID: {entry.id} • Submitted: {new Date(entry.submissionDate).toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SummaryReport;
