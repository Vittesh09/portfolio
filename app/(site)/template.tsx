import { Children } from 'react';

export default function V2Template({ children }: { children: React.ReactNode }) {
  return <div className="v2-page-enter">{Children.toArray(children)}</div>;
}
