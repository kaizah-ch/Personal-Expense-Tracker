import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, reset } from '../store/slices/authSlice';
import type { AppDispatch, RootState } from '../store/store';

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="text-xl font-bold text-blue-600">
                    ExpenseTracker
                </Link>
                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            <span className="text-gray-700">Hello, {user.username}</span>
                            <button
                                onClick={onLogout}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
                            <Link to="/register" className="text-gray-700 hover:text-blue-600">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
