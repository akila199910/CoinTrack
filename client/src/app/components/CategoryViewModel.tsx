import React from 'react'

type Category = {
  id: number | null;
  name: string;
  description: string | null;
  image: string;
  status: boolean;
  type: "INCOME" | "EXPENSE" | "SAVINGS";
}
interface CategoryViewModelProps {
  isOpen: boolean;
  onClose: () => void;
  modelName: string;
  categoryData: Category | null;
}

const CategoryViewModel: React.FC<CategoryViewModelProps> = ({ isOpen, onClose, modelName, categoryData }) => {
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
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Category Name
          </label>
          <p className={`text-sm font-medium  ${categoryData?.type === "INCOME" ?
            "text-green-500" : categoryData?.type === "EXPENSE" ?
            "text-red-500" :
            "text-purple-500"}`}> {categoryData?.name}
          </p>
        </div>

        <div className='space-y-2 mb-4'>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Category Type
          </label>
          <p className='text-sm font-medium text-gray-500'>{categoryData?.type}</p>
        </div>

        <div className='space-y-2 mb-4'>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Category Description
          </label>
          <p className='text-sm font-medium text-gray-500'>{categoryData?.description}</p>
        </div>

        <div className='space-y-2 mb-4'>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <p className='text-sm font-medium text-gray-500'>{categoryData?.status ? "Active" : "Inactive"}</p>
        </div>

      </div>
    </div>
  );
}

export default CategoryViewModel