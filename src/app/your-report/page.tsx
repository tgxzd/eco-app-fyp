'use client';

import Image from 'next/image';
import NavHeader from '@/components/ui/nav-header';
import artwork from '../../../public/images/gambar.jpg';
import { useEffect, useState } from 'react';
import Link from 'next/link';

// Define the Report type based on your prisma schema and data structure
interface Report {
  id: string;
  description: string;
  category: string;
  status: string;
  imagePath?: string | null;
  createdAt: string; // Or Date, adjust as per your API response
  location?: {
    address?: string | null;
    latitude?: number;
    longitude?: number;
  } | null;
}

export default function YourReportPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReports() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/user-reports');
        const data = await response.json();
        if (data.success) {
          setReports(data.data);
        } else {
          setError(data.message || 'Failed to fetch reports');
        }
      } catch (err) {
        setError('An error occurred while fetching reports.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchReports();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#121212]">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src={artwork}
          alt="Background artwork"
          fill
          className="object-cover opacity-60"
          quality={100}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="w-full py-4 md:py-8 bg-black/50 border-b border-amber-700/30">
          <NavHeader />
        </header>

        <main className="flex-grow flex flex-col items-center p-4 md:p-8">
          <div className="w-full max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <div className="mb-2 w-24 h-1 bg-amber-700 mx-auto"></div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-wider uppercase text-amber-100">
                Your Reports
              </h1>
              <div className="mt-2 w-24 h-1 bg-amber-700 mx-auto"></div>
            </div>

            {isLoading && (
              <div className="text-center text-amber-100 font-serif">
                Loading your reports...
              </div>
            )}

            {error && (
              <div className="bg-red-900/30 border border-red-700 text-red-100 p-4 rounded-md mb-6 text-center font-serif">
                <p>{error}</p>
              </div>
            )}

            {!isLoading && !error && reports.length === 0 && (
              <div className="text-center text-amber-100/70 font-serif">
                You haven&apos;t created any reports yet.
              </div>
            )}

            {!isLoading && !error && reports.length > 0 && (
              <div className="space-y-6">
                {reports.map((report) => (
                  <Link href={`/your-report/${report.id}`} key={report.id} className="block group">
                    <div className="bg-black/50 border border-amber-700/30 p-6 rounded-lg hover:bg-black/70 hover:border-amber-600 transition-all duration-300 shadow-lg hover:shadow-amber-700/20">
                      <div className="flex flex-col md:flex-row justify-between md:items-center mb-2">
                        <h2 className="text-xl font-serif text-amber-100 group-hover:text-amber-300 transition-colors duration-300 truncate">
                          Report ID: {report.id}
                        </h2>
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-amber-100/80 font-serif text-sm capitalize">
                          Category: {report.category.replace('-', ' ')}
                        </p>
                        {report.status === 'resolved' ? (
                          <span className="inline-flex items-center px-2 py-1 bg-green-600 text-white rounded text-xs font-serif">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Resolved
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-1 bg-yellow-600 text-white rounded text-xs font-serif">
                            Pending
                          </span>
                        )}
                      </div>
                      <p className="text-amber-100/80 font-serif text-sm mb-3 line-clamp-2">
                        {report.description}
                      </p>
                      {report.location?.address && (
                        <p className="text-amber-100/60 font-serif text-xs mb-3">
                          Location: {report.location.address}
                        </p>
                      )}
                      <div className="flex justify-between items-center">
                        <p className="text-amber-100/60 font-serif text-xs">
                          Created: {new Date(report.createdAt).toLocaleDateString()}
                        </p>
                        <span className="text-amber-600 group-hover:text-amber-400 font-serif text-sm transition-colors duration-300">
                          View Details →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
