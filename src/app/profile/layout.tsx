import { ReactNode } from 'react';
import { requireAuth } from '@/lib/session';

export default async function ProfileLayout({ children }: { children: ReactNode }) {
  // Ensure user is authenticated
  await requireAuth();
  
  return <>{children}</>;
} 