import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Upload, Camera, X, Save, Send, DollarSign, Calendar, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import Tesseract from 'tesseract.js';
import { getSupportedCurrencies } from '../utils/currency';
import { useAuth } from '../contexts/AuthContext';
import { useExpenses } from '../contexts/ExpensesContext';
import toast from 'react-hot-toast';

const NewExpense = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createExpense, submitExpense } = useExpenses();
  const mode = searchParams.get('mode'); // 'upload' or 'manual'
  
  const [formData, setFormData] = useState({
    description: '',
    category: '',
    amount: '',
    currency: 'USD',
    date: new Date().toISOString().split('T')[0],
    paidBy: '',
    remarks: ''
  });
  
  const [receiptImage, setReceiptImage] = useState(null);
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [currencies, setCurrencies] = useState([]);

  const categories = [
    'Meals',
    'Travel',
    'Office Supplies',
    'Software',
    'Marketing',
    'Training',
    'Other'
  ];

  useEffect(() => {
    const loadCurrencies = async () => {
      try {
        const currenciesData = await getSupportedCurrencies();
        setCurrencies(currenciesData);
      } catch (error) {
        console.error('Failed to load currencies:', error);
        // Fallback to basic currencies
        setCurrencies([
          { code: 'USD', name: 'US Dollar', symbol: '$' },
          { code: 'EUR', name: 'Euro', symbol: '€' },
          { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
          { code: 'GBP', name: 'British Pound', symbol: '£' },
          { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' }
        ]);
      }
    };
    loadCurrencies();
  }, []);

  const paymentMethods = [
    'Company Card',
    'Personal Card',
    'Cash',
    'Bank Transfer',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setReceiptImage(URL.createObjectURL(file));
      setIsProcessingOCR(true);
      
      try {
        toast.loading('Processing receipt with OCR...');
        
        const { data: { text } } = await Tesseract.recognize(
          file,
          'eng',
          {
            logger: m => {
              if (m.status === 'recognizing text') {
                toast.loading(`Processing... ${Math.round(m.progress * 100)}%`);
              }
            }
          }
        );
        
        toast.dismiss();
        toast.success('OCR processing complete!');
        
        // Parse OCR text to extract data
        parseOCRText(text);
        
      } catch (error) {
        toast.dismiss();
        toast.error('Failed to process receipt with OCR');
        console.error('OCR Error:', error);
      } finally {
        setIsProcessingOCR(false);
      }
    }
  };

  const parseOCRText = (text) => {
    // Simple regex patterns to extract data
    const amountMatch = text.match(/(?:total|amount|sum|price)\s*[:$€₹£]?\s*(\d+\.?\d*)/i);
    if (amountMatch && amountMatch[1]) {
      setFormData(prev => ({
        ...prev,
        amount: parseFloat(amountMatch[1]).toFixed(2)
      }));
      toast('Amount detected from receipt!', { icon: '💰' });
    }

    const dateMatch = text.match(/(\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4})/);
    if (dateMatch && dateMatch[1]) {
      const dateStr = dateMatch[1];
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        setFormData(prev => ({
          ...prev,
          date: date.toISOString().split('T')[0]
        }));
        toast('Date detected from receipt!', { icon: '📅' });
      }
    }

    // Extract description from first line or common patterns
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    if (lines.length > 0) {
      const description = lines[0].substring(0, 50);
      setFormData(prev => ({
        ...prev,
        description: description
      }));
      toast('Description extracted from receipt!', { icon: '📝' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Valid amount is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.paidBy) {
      newErrors.paidBy = 'Payment method is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors below');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create expense with proper data structure
      const expenseData = {
        ...formData,
        employeeId: user.id,
        employeeName: user.name,
        employeeEmail: user.email,
        currency: formData.currency || 'USD',
        status: 'draft'
      };

      createExpense(expenseData);
      toast.success('Expense created successfully!');
      navigate('/employee/dashboard');
      
    } catch (error) {
      console.error('Failed to create expense:', error);
      toast.error('Failed to create expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!formData.description.trim()) {
      toast.error('Please enter a description to save as draft');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create expense as draft
      const expenseData = {
        ...formData,
        employeeId: user.id,
        employeeName: user.name,
        employeeEmail: user.email,
        currency: formData.currency || 'USD',
        status: 'draft'
      };

      createExpense(expenseData);
      toast.success('Draft saved successfully!');
      navigate('/employee/dashboard');
    } catch (error) {
      console.error('Failed to save draft:', error);
      toast.error('Failed to save draft');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitForApproval = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors below');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create expense and immediately submit for approval
      const expenseData = {
        ...formData,
        employeeId: user.id,
        employeeName: user.name,
        employeeEmail: user.email,
        currency: formData.currency || 'USD',
        status: 'draft'
      };

      const expense = createExpense(expenseData);
      submitExpense(expense.id);
      toast.success('Expense submitted for approval!');
      navigate('/employee/dashboard');
    } catch (error) {
      console.error('Failed to submit expense:', error);
      toast.error('Failed to submit expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {mode === 'upload' ? 'Upload Receipt' : 'Create New Expense'}
          </h1>
          <p className="mt-2 text-gray-600">
            {mode === 'upload' 
              ? 'Upload a receipt and we\'ll extract the details automatically'
              : 'Fill in the details for your expense'
            }
          </p>
        </div>

        <div className="bg-white rounded-lg shadow">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Receipt Upload Section */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
              <label htmlFor="receipt-upload" className="cursor-pointer">
                {receiptImage ? (
                  <div className="space-y-4">
                    <div className="relative inline-block">
                      <img 
                        src={receiptImage} 
                        alt="Receipt" 
                        className="max-w-xs max-h-64 rounded-lg shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setReceiptImage(null)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">Receipt uploaded successfully</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <Upload className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900">Upload Receipt</p>
                      <p className="text-sm text-gray-500">
                        Drag and drop or click to upload (PNG, JPG, PDF)
                      </p>
                    </div>
                  </div>
                )}
              </label>
              <input
                id="receipt-upload"
                type="file"
                accept="image/png,image/jpeg,image/jpg,application/pdf"
                onChange={handleFileChange}
                className="hidden"
                disabled={isProcessingOCR}
              />
              
              {isProcessingOCR && (
                <div className="mt-4">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm text-gray-600">Processing receipt...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="e.g., Client dinner, Office supplies, Travel expenses"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.description ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.category ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                )}
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.amount ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                )}
              </div>

              {/* Currency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {currencies.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expense Date *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.date ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                )}
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paid By *
                </label>
                <select
                  name="paidBy"
                  value={formData.paidBy}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.paidBy ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Payment Method</option>
                  {paymentMethods.map(method => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
                {errors.paidBy && (
                  <p className="mt-1 text-sm text-red-600">{errors.paidBy}</p>
                )}
              </div>
            </div>

            {/* Remarks */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remarks
              </label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleInputChange}
                placeholder="Any additional notes about this expense..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/employee/dashboard')}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save Draft
                </button>
                
                <button
                  type="button"
                  onClick={handleSubmitForApproval}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit for Approval
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewExpense;