import React, { useState } from 'react';
import Card from '../features/dashboard/Card';
import axios from 'axios';

// Get API base URL from environment variable
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

interface LoginPageProps {
    onNavigate: (path: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoggingIn(true);
        
        try {
            // Use environment variable for API URL
            const response = await axios.post(`${API_BASE_URL}/p/Signin`, {
                email,
                password
            });
            if(response.status===500){
                setIsLoggingIn(false);
                alert(`Login failed: ${response?.data?.error || 'Invalid credentials'}`);
                return;
            }
            console.log('Login successful:', response.data);
            setIsLoggingIn(false);
            onNavigate('dashboard');
            
        } catch (error) {
            setIsLoggingIn(false);
            if (axios.isAxiosError(error)) {
                console.error('Login failed:', error.response?.data || error.message);
                alert(`Login failed: ${error.response?.data?.message || 'Invalid credentials'}`);
            } else {
                console.error('Unexpected error:', error);
                alert('An unexpected error occurred during login');
            }
        }
    };

    return (
        <div className="min-h-screen font-sans flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                 <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">Welcome Back</h1>
                    <p className="text-gray-500 mt-2">Log in to your GreenCredits account.</p>
                </div>
                <Card className="p-8">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="text-sm font-medium text-gray-600" htmlFor="email">
                                Email Address
                            </label>
                            <input 
                                type="email" 
                                id="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition"
                                required
                            />
                        </div>
                        <div>
                           <label className="text-sm font-medium text-gray-600" htmlFor="password">
                                Password
                            </label>
                            <input 
                                type="password" 
                                id="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition"
                                required
                            />
                        </div>
                        <div className="mt-8">
                            <button 
                                type="submit"
                                disabled={isLoggingIn}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition"
                            >
                                {isLoggingIn ? 'Logging in...' : 'Log In'}
                            </button>
                        </div>
                    </form>
                    <p className="mt-6 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <button onClick={() => onNavigate('signup')} className="font-medium text-emerald-600 hover:text-emerald-500">
                            Sign up
                        </button>
                    </p>
                </Card>
            </div>
        </div>
    );
};

export default LoginPage;