import { requireAuth } from '@/lib/session';
import { logout } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  // Ensure user is authenticated
  const user = await requireAuth();
  
  // You can implement any server-side form handling here
  async function handleLogoutAction() {
    'use server';
    await logout();
    redirect('/login');
  }

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p className="mb-2">
          Welcome, <span className="font-semibold">{user.name || user.email}</span>!
        </p>
        <div className="border-t border-gray-200 pt-4 mt-4">
          <h2 className="text-lg font-semibold mb-2">Your Account</h2>
          <p><span className="font-medium">Email:</span> {user.email}</p>
          <p><span className="font-medium">User ID:</span> {user.id}</p>
        </div>
      </div>
      
      <form action={handleLogoutAction}>
        <button 
          type="submit"
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          Sign Out
        </button>
      </form>
    </div>
  );
} 