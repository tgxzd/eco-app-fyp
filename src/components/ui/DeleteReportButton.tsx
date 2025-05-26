'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteReport } from '@/app/your-report/actions';

interface DeleteReportButtonProps {
  reportId: string;
}

export default function DeleteReportButton({ reportId }: DeleteReportButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const result = await deleteReport(reportId);
      
      if (result.success) {
        router.push('/your-report');
        router.refresh();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An error occurred while deleting the report.');
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-900/90 border border-red-700 text-red-100 p-4 rounded-md text-center font-serif max-w-md">
          {error}
        </div>
      )}
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="px-6 py-2 bg-red-900/30 text-red-100 font-serif border border-red-700 hover:bg-red-900/50 transition-colors duration-300 uppercase tracking-widest text-sm shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isDeleting ? 'Deleting...' : 'Delete Report'}
      </button>
    </>
  );
} 