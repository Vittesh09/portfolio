'use client';

import { NavLabelSwap } from '@/src/components/v2/ui/NavLabelSwap';
import { MENU_CLICK_SOUND, playUiSound } from '@/src/components/v2/ui/playUiSound';
import { useKissMode } from '@/src/components/v2/layout/KissModeProvider';
import { useMobileLanding } from '@/src/components/v2/ui/useMobileLanding';

type KissNavControlProps = {
  className?: string;
  layout?: 'desktop' | 'mobile';
  onActivate?: () => void;
};

const navClass = 'archive-label v2-nav-option group hover:text-accent-pop';

/** Desktop only — toggles the simple Kiss landing on /v2 (not the classic archive). */
export function KissNavControl({
  className = '',
  layout = 'desktop',
  onActivate
}: KissNavControlProps) {
  const isMobile = useMobileLanding();
  const { kissMode, toggleKissMode } = useKissMode();

  if (isMobile) return null;

  const hoverLabel = kissMode ? 'Singularity mode' : 'Simple mode';
  const ariaLabel = `SM (${hoverLabel})`;

  const handleClick = () => {
    playUiSound(MENU_CLICK_SOUND);
    toggleKissMode();
    onActivate?.();
  };

  if (layout === 'mobile') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`v2-nav-mobile-row flex w-full border-b border-border-subtle text-left ${className}`}
        aria-label={ariaLabel}
        aria-pressed={kissMode}
      >
        <span className="text-2xl font-semibold tracking-tight">
          [SM]{' '}
          <span className="text-base font-normal text-text-secondary">({hoverLabel})</span>
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${navClass} ${className}`}
      aria-label={ariaLabel}
      aria-pressed={kissMode}
    >
      <NavLabelSwap short="[SM]" long={hoverLabel} />
    </button>
  );
}
