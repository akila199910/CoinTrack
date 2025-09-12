"use client"

import { useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { createTransactionApi, getTransactionsApi } from "../api/transactionApi";
import TransactionModal from "../components/TransactionModal";
import { TransactionSubmitData } from "../validation/transaction";

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
const page = () => {

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState<[{id: number;name: string;}]>([{id: 0, name: ''}]);

  const transactionsColumns: ColumnDef<Transaction>[] = [
    {
      id: "index",
      header: "#",
      cell: ({ row }) => (
        <span className="text-sm font-medium text-gray-500">
          {row.index + 1}
        </span>
      ),
      size: 60
    },
    {
      id: 'category',
      accessorFn: (row) => row.category.name,
      header: ({ column }) => (
        <div className="flex items-center gap-2">
          <select
            className="border rounded px-2 py-1 text-xs"
            value={(column.getFilterValue() as string) ?? 'ALL'}
            onChange={(e) =>
              column.setFilterValue(e.target.value === 'ALL' ? undefined : e.target.value)
            }
          >
            <option value="ALL" className="text-xs font-medium ">All Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name} className="text-xs" title={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      ),
      filterFn: 'equalsString',
      cell: ({ row }) => (
        <span className="text-sm font-medium text-gray-500">
          {row.original.category.name}
        </span>
      ),
      size: 160,
    },
  
    {
      id: "type",
      header: "Type",
      accessorKey: "type",
      cell: ({ row }) => (
        <span className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium border 
          ${row.original.category.type == "INCOME" ?
            "bg-blue-100 text-blue-700 border-green-200" :
            "bg-yellow-100 text-yellow-700 border-red-200"}`}>
          {row.original.category.type}
        </span>
      ),
      size: 100
    },
  
    {
      id: "amount",
      header: "Amount",
      accessorKey: "amount",
      cell: ({ row }) => (
        <span className="text-sm font-medium text-gray-500">
          {row.original.amount}
        </span>
      ),
      size: 100
    },
    {
      id: "date",
      header: "Date",
      accessorKey: "date",
      cell: ({ row }) => (
        <span className="text-sm font-medium text-gray-500">
          {row.original.date}
        </span>
      ),
      size: 100
    },
    {
      id: "description",
      header: "Description",
      accessorKey: "description",
      cell: ({ row }) => (
        <span className="text-sm font-medium text-gray-500">
          {row.original.description}
        </span>
      ),
      size: 100
    },
  
  ]
  const getTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getTransactionsApi();
      setTransactions(response.data.data.transactions);
      setCategories(response.data.data.categories);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  useEffect(() => {
    getTransactions();
  }, []);
  const handleAddTransaction = () => {
    setIsModalOpen(true);
  };
  const handleEditTransaction = (transaction: Transaction) => {
    setIsModalOpen(true);
  };
  const handleDeleteTransaction = (transaction: Transaction) => {
    setIsModalOpen(true);
  };

  const handleCreateTransaction = async (transactionData: TransactionSubmitData) => {
    setLoading(true);
    try {
      await createTransactionApi(transactionData);

      await getTransactions();
      setIsModalOpen(false);
    } catch (err) {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
      throw err;
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading transactions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading transactions</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2">
      <DataTable<Transaction>
        data={transactions}
        columns={transactionsColumns}
        title="Transactions"
        searchPlaceholder="Search transactions..."
        addButtonText="Add Transaction"
        onAdd={handleAddTransaction}
        onEdit={handleEditTransaction}
        onDelete={handleDeleteTransaction}
        emptyStateTitle="No transactions found"
        emptyStateDescription="Try adjusting your search criteria"
      />

      <TransactionModal
        categories={categories}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTransaction}
      />
    </div>
  )
}

export default page;