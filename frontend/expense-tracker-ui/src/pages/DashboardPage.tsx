import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSummary, getTransactions, deleteTransaction } from '../store/slices/transactionSlice';
import SpendingChart from '../components/SpendingChart';
import TransactionForm from '../components/TransactionForm';
import { Trash2, TrendingUp, TrendingDown, DollarSign, Plus } from 'lucide-react';
import type { AppDispatch, RootState } from '../store/store';
import Navbar from '../components/Navbar';

const DashboardPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { summary, transactions, isLoading } = useSelector((state: RootState) => state.transaction);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        if (user) {
            dispatch(getSummary());
            dispatch(getTransactions());
        }
        return () => {
            // Optional: reset on unmount if needed, but usually we want to keep state cache
            // dispatch(reset());
        }
    }, [dispatch, user, showForm]); // refetch when form closes (simple way to update)

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            dispatch(deleteTransaction(id))
                .then(() => {
                    dispatch(getSummary()); // Update summary after delete
                });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="container mx-auto px-4 py-8 flex-grow">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-lg"
                    >
                        <Plus size={20} /> Add Transaction
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Total Balance</p>
                            <h3 className="text-2xl font-bold text-gray-800">${summary?.balance?.toFixed(2) ?? '0.00'}</h3>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                            <DollarSign size={24} />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Income</p>
                            <h3 className="text-2xl font-bold text-green-600">+${summary?.totalIncome?.toFixed(2) ?? '0.00'}</h3>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full text-green-600">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Expenses</p>
                            <h3 className="text-2xl font-bold text-red-600">-${summary?.totalExpense?.toFixed(2) ?? '0.00'}</h3>
                        </div>
                        <div className="bg-red-100 p-3 rounded-full text-red-600">
                            <TrendingDown size={24} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Transactions */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Transactions</h3>
                        {isLoading && transactions.length === 0 ? (
                            <p>Loading...</p>
                        ) : transactions.length > 0 ? (
                            <div className="space-y-4">
                                {transactions.map((t) => (
                                    <div key={t.id} className="flex justify-between items-center p-4 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100 transition">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-full ${t.type === 'INCOME' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                {t.type === 'INCOME' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">{t.description}</p>
                                                <p className="text-sm text-gray-500">{t.date} • {t.category}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`font-bold ${t.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                                                {t.type === 'INCOME' ? '+' : '-'}${t.amount.toFixed(2)}
                                            </span>
                                            <button onClick={() => handleDelete(t.id)} className="text-gray-400 hover:text-red-500 transition">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">No transactions yet.</p>
                        )}
                    </div>

                    {/* Chart */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Expense Breakdown</h3>
                        <SpendingChart data={summary?.expenseByCategory} />
                    </div>
                </div>
            </div>

            {showForm && (
                <TransactionForm onClose={() => { setShowForm(false); dispatch(getSummary()); dispatch(getTransactions()); }} />
            )}
        </div>
    );
};

export default DashboardPage;
