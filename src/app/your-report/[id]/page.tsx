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

export default async function ReportDetailPage({ params }: PageProps) {
  const { id } = await params;
  const report = await getReport(id);

  if (!report) {
    notFound();
  }

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
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <h1 className="text-2xl font-bold text-amber-100">Report Details</h1>
                <div className="flex gap-2">
                  <Link
                    href="/your-report"
                    className="text-amber-100/60 hover:text-amber-100 transition-colors"
                  >
                    Back to Reports
                  </Link>
                  <DeleteReportButton reportId={report.id} />
                </div>
              </div>

              <div className="bg-amber-950/50 p-6 rounded-lg">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-amber-100/60 text-sm mb-1">Category</h2>
                    <p className="text-amber-100 capitalize">{report.category}</p>
                  </div>

                  <div>
                    <h2 className="text-amber-100/60 text-sm mb-1">Description</h2>
                    <p className="text-amber-100">{report.description}</p>
                  </div>

                  {report.location && (
                    <div>
                      <h2 className="text-amber-100/60 text-sm mb-1">Location</h2>
                      <p className="text-amber-100">
                        {report.location.address || 'No address provided'}
                      </p>
                      <p className="text-amber-100/60 text-sm">
                        Coordinates: {report.location.latitude}, {report.location.longitude}
                      </p>
                    </div>
                  )}

                  {report.imagePath && (
                    <div>
                      <h2 className="text-amber-100/60 text-sm mb-1">Image</h2>
                      <ImageViewer src={report.imagePath} alt="Report Image" />
                    </div>
                  )}

                  <div>
                    <h2 className="text-amber-100/60 text-sm mb-1">Submitted by</h2>
                    <p className="text-amber-100">{report.user.name || 'Anonymous'}</p>
                    <p className="text-amber-100/60 text-sm">{report.user.email}</p>
                  </div>

                  <div>
                    <h2 className="text-amber-100/60 text-sm mb-1">Created At</h2>
                    <p className="text-amber-100">
                      {new Date(report.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
