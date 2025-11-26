import React, { useState, useRef } from 'react';
import { TransactionRow, FormData, VO_OPTIONS, FUND_SOURCES, VCDC_OPTIONS } from './types';
import TransactionTable from './components/TransactionTable';
import SummaryReport from './components/SummaryReport';
import { Save, CheckCircle2, Edit3, XCircle } from 'lucide-react';

const INITIAL_ROW: TransactionRow = {
  id: 'init-1',
  slNo: 1,
  doseNo: '',
  voucherNo: '',
  principal: 0,
  interest: 0,
  monthlySavings: 0,
  overdue: 0,
  fileName: ''
};

function App() {
  // Master Form State
  const [voName, setVoName] = useState('');
  const [vcdcName, setVcdcName] = useState('');
  const [fundSource, setFundSource] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [repaymentDate, setRepaymentDate] = useState('');
  
  // Transaction Table State
  const [rows, setRows] = useState<TransactionRow[]>([INITIAL_ROW]);
  
  // App State
  const [submittedData, setSubmittedData] = useState<FormData[]>([]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Refs for scrolling
  const topRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  const resetForm = () => {
    setVoName('');
    setVcdcName('');
    setFundSource('');
    setMobileNumber('');
    setRepaymentDate('');
    setRows([{ ...INITIAL_ROW, id: Math.random().toString(36).substr(2, 9) }]);
    setEditingId(null);
  };

  const handleEdit = (id: string) => {
    const entryToEdit = submittedData.find(item => item.id === id);
    if (entryToEdit) {
      setVoName(entryToEdit.voName);
      setVcdcName(entryToEdit.vcdcName);
      setFundSource(entryToEdit.fundSource);
      setMobileNumber(entryToEdit.mobileNumber);
      setRepaymentDate(entryToEdit.repaymentDate);
      setRows(entryToEdit.transactions.map(r => ({ ...r }))); // Deep copy rows
      setEditingId(id);
      
      // Scroll to top to show form
      topRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      setSubmittedData(prev => prev.filter(item => item.id !== id));
      // If we are currently editing the deleted item, reset the form
      if (editingId === id) {
        resetForm();
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Strict Validation
    if (!voName || !fundSource || !repaymentDate || !vcdcName || !mobileNumber) {
      alert("Please fill in all master fields including VCDC Name and Mobile Number.");
      return;
    }

    // Validate Rows
    const invalidRows = rows.some(row => 
        !row.doseNo || 
        !row.voucherNo || 
        row.principal === undefined || 
        row.interest === undefined || 
        row.monthlySavings === undefined ||
        !row.fileName // File is now required
    );

    if (invalidRows) {
        alert("Please ensure all transaction row fields are filled and a file is uploaded for each row.");
        return;
    }

    const entryData: FormData = {
      id: editingId || Math.random().toString(36).substr(2, 9),
      voName,
      vcdcName,
      fundSource,
      mobileNumber,
      repaymentDate,
      transactions: [...rows],
      submissionDate: new Date().toISOString()
    };

    if (editingId) {
      // Update existing
      setSubmittedData(prev => prev.map(item => item.id === editingId ? entryData : item));
      setEditingId(null);
    } else {
      // Create new
      setSubmittedData([entryData, ...submittedData]);
    }
    
    // UI Feedback
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
    
    // Reset
    resetForm();

    // Scroll to summary if creating, stay if updating? Let's scroll to summary
    setTimeout(() => {
      summaryRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const cancelEdit = () => {
      resetForm();
  };

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8" ref={topRef}>
      {/* Main Container */}
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            Loan Repayment for the month of <span className="text-green-600">{currentMonth} {currentYear}</span>
          </h1>
          <p className="mt-2 text-sm text-gray-600">
             {editingId ? <span className="text-blue-600 font-bold">Editing Mode: Update the details below.</span> : "Enter the repayment details below. All fields are required."}
          </p>
        </div>

        {/* Form Card */}
        <div className={`bg-white rounded-xl shadow-xl border overflow-hidden transition-colors ${editingId ? 'border-blue-300 ring-2 ring-blue-100' : 'border-gray-200'}`}>
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            
            {/* Master Data Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">VO Name *</label>
                  <div className="relative">
                    <select
                      value={voName}
                      onChange={(e) => setVoName(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2.5 border bg-white"
                      required
                    >
                      <option value="">Select VO Name</option>
                      {VO_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">VCDC Name *</label>
                  <select
                      value={vcdcName}
                      onChange={(e) => setVcdcName(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2.5 border bg-white"
                      required
                    >
                      <option value="">Select VCDC Name</option>
                      {VCDC_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fund Source *</label>
                  <select
                    value={fundSource}
                    onChange={(e) => setFundSource(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2.5 border bg-white"
                    required
                  >
                    <option value="">Select Fund Source</option>
                    {FUND_SOURCES.map(src => <option key={src} value={src}>{src}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2.5 border"
                    placeholder="+91 XXXXX XXXXX"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Repayment Date *</label>
                  <input
                    type="date"
                    value={repaymentDate}
                    onChange={(e) => setRepaymentDate(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2.5 border"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Dynamic Table Section */}
            <div className="mt-8 border-t border-gray-100 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Transaction Details</h3>
              <TransactionTable rows={rows} setRows={setRows} />
            </div>

            {/* Footer Submit Action */}
            <div className="mt-8 flex justify-center border-t border-gray-100 pt-6 space-x-4">
               {editingId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 shadow-sm"
                  >
                    <XCircle className="w-5 h-5 mr-2" />
                    CANCEL
                  </button>
               )}
              <button
                type="submit"
                className={`inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white shadow-lg transform transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 
                    ${editingId ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' : 'bg-green-700 hover:bg-green-800 focus:ring-green-500'}`}
              >
                {editingId ? <><Edit3 className="w-5 h-5 mr-2" /> UPDATE RECORD</> : <><Save className="w-5 h-5 mr-2" /> SUBMIT REPORT</>}
              </button>
            </div>

          </form>
        </div>

        {/* Scroll Target */}
        <div ref={summaryRef}>
           <SummaryReport data={submittedData} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
      </div>

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-4 right-4 bg-green-800 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center space-x-3 animate-bounce z-50">
          <CheckCircle2 className="w-6 h-6" />
          <span className="font-medium">{editingId ? "Record updated successfully!" : "Data saved successfully!"}</span>
        </div>
      )}
    </div>
  );
}

export default App;
