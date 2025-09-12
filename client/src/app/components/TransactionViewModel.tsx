import React from 'react'

type Category = {
  id: number;
  name: string;
  description: string;
  image: string;
  status: boolean;
  type: string;
}
type Transaction = {
  id: number;
  amount: string;
  date: string;
  description: string;
  status: boolean;
  category: Category;
}
interface TransactionViewModelProps {
  isOpen: boolean;
  onClose: () => void;
  modelName: string;
  transactionData: Transaction | null;
}

const TransactionViewModel: React.FC<TransactionViewModelProps> = ({ isOpen, onClose, modelName, transactionData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-blue-200 bg-opacity-50 flex items-center justify-center z-9999">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl/30">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">{modelName}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>



        <div className='space-y-2 mb-4'>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Transaction Amount
          </label>
          <p className={`text-sm font-medium text-gray-500 ${transactionData?.category.type === "INCOME" ?
            "text-green-500" : "text-red-500"}`}> {transactionData?.amount} ({transactionData?.category.type === "INCOME" ? "INCOME" : "EXPENSE"})
          </p>
        </div>

        <div className='space-y-2 mb-4'>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Transaction Date
          </label>
          <p className='text-sm font-medium text-gray-500'>{transactionData?.date}</p>
        </div>

        <div className='space-y-2 mb-4'>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <p className='text-sm font-medium text-gray-500'>{transactionData?.description}</p>
        </div>

        <div className='space-y-2 mb-4'>
          <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <p className='text-sm font-medium text-gray-500'>{transactionData?.category.name}</p>
        </div>

      </div>
    </div>
  );
}

export default TransactionViewModel