import { redirect } from 'next/navigation';

/** Workbench moved to the classic archive lab. */
export default function V2WorkbenchRedirect() {
  redirect('/v2/classic/workbench/');
}
