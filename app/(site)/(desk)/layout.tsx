import type { ReactNode } from 'react';
import { DeskShell } from '@/src/components/v2/desk/DeskShell';

export default function DeskLayout({ children }: { children: ReactNode }) {
  return <DeskShell>{children}</DeskShell>;
}
