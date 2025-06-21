
import NavHeader from '@/components/ui/nav-header';
import Background from '@/components/Background';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import DeleteReportButton from '@/components/ui/DeleteReportButton';
import ImageViewer from '@/components/ui/ImageViewer';
import Link from 'next/link';

// Define the Report type as expected from Prisma query
interface Report {
  id: string;
  description: string;
  category: string;
  status?: string;
  imagePath?: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: {
    name?: string | null;
    email: string;
  };
  location?: {
    id: string;
    latitude: number;
    longitude: number;
    address?: string | null;
    userId: string;
  } | null;
}

async function getReport(id: string): Promise<Report | null> {
  try {
    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        location: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
    return report;
  } catch (error) {
    console.error("Failed to fetch report:", error);
    return null;
  }
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'air-pollution':
      return '🌫️';
    case 'water-pollution':
      return '💧';
    case 'wildfire':
      return '🔥';
    default:
      return '📋';
  }
};

const formatCategoryName = (category: string) => {
  return category.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

export default async function ReportDetailPage({ params }: PageProps) {
  const { id } = await params;
  const report = await getReport(id);

  if (!report) {
    notFound();
  }

  return (
    <>
      <Background variant="web3-emerald" />
      <div className="relative min-h-screen z-10">
        <NavHeader />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20 max-w-5xl">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8 lg:mb-16">
            <div className="flex items-center space-x-4">
              <div className="text-5xl">{getCategoryIcon(report.category)}</div>
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight">
                  {formatCategoryName(report.category)}
                </h1>
                <p className="text-white/50 font-light">
                  Report #{report.id.slice(-8).toUpperCase()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Link
                href="/your-report"
                className="inline-flex items-center px-4 py-2 text-white/60 hover:text-white transition-colors font-light text-sm sm:text-base"
              >
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Reports
              </Link>
              <DeleteReportButton reportId={report.id} />
            </div>
          </div>

          {/* Main Content */}
          <div className="grid gap-8 lg:gap-12">
            {/* Report Information */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-6 sm:p-8 lg:p-10">
              <div className="flex items-center mb-6 lg:mb-8">
                <svg className="w-6 h-6 text-emerald-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-light text-white">Report Details</h2>
              </div>

              <div className="grid gap-6 lg:gap-8">
                {/* Description */}
                <div>
                  <h3 className="text-base sm:text-lg font-light text-white/80 mb-3 flex items-center">
                    <svg className="w-5 h-5 text-emerald-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    Description
                  </h3>
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 sm:p-6">
                    <p className="text-white/70 font-light leading-relaxed">{report.description}</p>
                  </div>
                </div>

                {/* Status */}
                {report.status && (
                  <div>
                    <h3 className="text-base sm:text-lg font-light text-white/80 mb-3 flex items-center">
                      <svg className="w-5 h-5 text-emerald-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Status
                    </h3>
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 sm:p-6">
                      {report.status === 'resolved' ? (
                        <div className="inline-flex items-center px-4 py-2 bg-emerald-500/20 text-emerald-300 rounded-full text-sm font-light backdrop-blur-sm border border-emerald-500/30">
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Resolved
                        </div>
                      ) : (
                        <div className="inline-flex items-center px-4 py-2 bg-yellow-500/20 text-yellow-300 rounded-full text-sm font-light backdrop-blur-sm border border-yellow-500/30">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Pending
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Location */}
                {report.location && (
                  <div>
                    <h3 className="text-base sm:text-lg font-light text-white/80 mb-3 flex items-center">
                      <svg className="w-5 h-5 text-emerald-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Location
                    </h3>
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 sm:p-6">
                      <p className="text-white/70 font-light mb-2">
                        {report.location.address || 'No address provided'}
                      </p>
                      <p className="text-white/50 font-light text-sm">
                        Coordinates: {report.location.latitude.toFixed(6)}, {report.location.longitude.toFixed(6)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Image */}
                {report.imagePath && (
                  <div>
                    <h3 className="text-base sm:text-lg font-light text-white/80 mb-3 flex items-center">
                      <svg className="w-5 h-5 text-emerald-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Evidence Photo
                    </h3>
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 sm:p-6">
                      <ImageViewer src={report.imagePath} alt="Report Evidence" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Metadata */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-6 sm:p-8 lg:p-10">
              <div className="flex items-center mb-6 lg:mb-8">
                <svg className="w-6 h-6 text-emerald-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-light text-white">Report Information</h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
                {/* Submitted By */}
                <div>
                  <h3 className="text-base sm:text-lg font-light text-white/80 mb-3 flex items-center">
                    <svg className="w-5 h-5 text-emerald-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Submitted By
                  </h3>
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 sm:p-6">
                    <p className="text-white/70 font-light">{report.user.name || 'Anonymous'}</p>
                    <p className="text-white/50 font-light text-sm mt-1">{report.user.email}</p>
                  </div>
                </div>

                {/* Timestamps */}
                <div>
                  <h3 className="text-base sm:text-lg font-light text-white/80 mb-3 flex items-center">
                    <svg className="w-5 h-5 text-emerald-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Timeline
                  </h3>
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 sm:p-6 space-y-3">
                    <div>
                      <p className="text-white/50 font-light text-sm">Created</p>
                      <p className="text-white/70 font-light">
                        {new Date(report.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/50 font-light text-sm">Last Updated</p>
                      <p className="text-white/70 font-light">
                        {new Date(report.updatedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
