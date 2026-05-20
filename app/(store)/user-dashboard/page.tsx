import Link from 'next/link';

export default function UserDashboard() {
  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-gray-100 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">User Dashboard</h1>
        <p className="text-gray-600 mb-8">
          Welcome to your account! Here you can view your orders, update your profile, and manage your settings.
        </p>
        <Link 
          href="/" 
          className="inline-flex justify-center items-center py-2.5 px-6 border border-transparent text-sm font-medium rounded-lg text-white bg-[#2db34a] hover:bg-[#24943c] transition-colors"
        >
          Return to Store
        </Link>
      </div>
    </div>
  );
}
