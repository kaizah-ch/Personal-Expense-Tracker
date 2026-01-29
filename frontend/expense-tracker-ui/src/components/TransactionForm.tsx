import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDispatch } from 'react-redux';
import { createTransaction } from '../store/slices/transactionSlice';
import type { AppDispatch } from '../store/store';

const schema = z.object({
    amount: z.number().min(0.01, 'Amount must be greater than 0'),
    description: z.string().min(3, 'Description must be at least 3 characters'),
    date: z.string().refine((date) => new Date(date).toString() !== 'Invalid Date', {
        message: 'A valid date is required',
    }),
    type: z.enum(['INCOME', 'EXPENSE']),
    category: z.string().min(2, 'Category is required'),
});

type FormData = z.infer<typeof schema>;

interface TransactionFormProps {
    onClose: () => void;
}

const TransactionForm = ({ onClose }: TransactionFormProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            type: 'EXPENSE',
            date: new Date().toISOString().split('T')[0],
        }
    });

    const onSubmit = (data: FormData) => {
        dispatch(createTransaction(data));
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Add Transaction</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">X</button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium">Type</label>
                        <select {...register('type')} className="w-full border rounded px-3 py-2">
                            <option value="EXPENSE">Expense</option>
                            <option value="INCOME">Income</option>
                        </select>
                        {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Amount</label>
                        <input
                            type="number"
                            step="0.01"
                            {...register('amount', { valueAsNumber: true })}
                            className="w-full border rounded px-3 py-2"
                        />
                        {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Description</label>
                        <input
                            type="text"
                            {...register('description')}
                            className="w-full border rounded px-3 py-2"
                        />
                        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Category</label>
                        <input
                            type="text"
                            {...register('category')}
                            placeholder="e.g. Food, Salary"
                            className="w-full border rounded px-3 py-2"
                        />
                        {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Date</label>
                        <input
                            type="date"
                            {...register('date')}
                            className="w-full border rounded px-3 py-2"
                        />
                        {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        Add Transaction
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TransactionForm;
