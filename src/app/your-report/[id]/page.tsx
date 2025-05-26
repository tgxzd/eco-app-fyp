import Image from 'next/image';
import NavHeader from '@/components/ui/nav-header';
import artwork from '../../../../public/images/gambar.jpg';
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
  status: string;
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
  params: {
    id: string;
  };
}

export default async function ReportDetailPage({ params }: PageProps) {
  const report = await getReport(params.id);

  if (!report) {
    notFound();
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'approved':
      case 'resolved':
        return 'bg-green-500/20 text-green-300';
      case 'rejected':
        return 'bg-red-500/20 text-red-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

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
          <div className="w-full max-w-3xl mx-auto bg-black/60 border border-amber-700/30 rounded-lg shadow-xl overflow-hidden">
            {report.imagePath && (
              <ImageViewer
                src={report.imagePath}
                alt={`Report image for ${report.category}`}
              />
            )}
            <div className="p-6 md:p-8">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 pb-4 border-b border-amber-700/20">
                <div>
                  <h1 className="text-2xl md:text-3xl font-serif text-amber-100 mb-1 capitalize">
                    {report.category.replace('-', ' ')} Report
                  </h1>
                  <p className="text-xs text-amber-100/60 font-serif">
                    Reported on: {new Date(report.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <span className={`mt-2 sm:mt-0 px-4 py-1.5 text-sm font-semibold rounded-full font-serif ${getStatusColor(report.status)}`}>
                  Status: {report.status.toUpperCase()}
                </span>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-serif text-amber-200 mb-2">Description</h2>
                <p className="text-amber-100/90 font-serif leading-relaxed">
                  {report.description}
                </p>
              </div>

              {report.location && (
                <div className="mb-6 pb-6 border-b border-amber-700/20">
                  <h2 className="text-lg font-serif text-amber-200 mb-2">Location Details</h2>
                  {report.location.address ? (
                    <p className="text-amber-100/90 font-serif">{report.location.address}</p>
                  ) : (
                    <p className="text-amber-100/70 font-serif italic">Address not available.</p>
                  )}
                  <p className="text-xs text-amber-100/60 font-serif mt-1">
                    Coordinates: {report.location.latitude.toFixed(6)}, {report.location.longitude.toFixed(6)}
                  </p>
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-lg font-serif text-amber-200 mb-2">Reported By</h2>
                <p className="text-amber-100/90 font-serif">{report.user.name || report.user.email}</p>
                <p className="text-xs text-amber-100/60 font-serif">User ID: {report.userId}</p>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  href="/your-report" 
                  className="px-6 py-2 bg-amber-700/30 text-amber-100 font-serif border border-amber-700 hover:bg-amber-700/50 transition-colors duration-300 uppercase tracking-widest text-sm shadow-md"
                >
                  ← Back to Your Reports
                </Link>
                <DeleteReportButton reportId={report.id} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
