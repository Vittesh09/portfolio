import BlogToWritingRedirect from './redirect';

export const metadata = {
  robots: { index: false, follow: true },
  alternates: { canonical: '/writing/' },
  title: 'Redirecting'
};

export default function BlogPage() {
  return <BlogToWritingRedirect />;
}
