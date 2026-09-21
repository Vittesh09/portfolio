import { profile } from '@/src/config/v2/profile';

export function HeroIntroCopy({ className }: { className?: string }) {
  const [before, after] = profile.heroIntro.split('Vittesh');
  return (
    <p className={className}>
      {before}
      <span className="text-accent-pop">Vittesh</span>
      {after}
    </p>
  );
}
