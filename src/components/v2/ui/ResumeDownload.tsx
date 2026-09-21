import { siteConfig } from '@/src/config/v2/site';
import { ctaBase, ctaClass, type CtaVariant } from '@/src/components/v2/ui/ctaStyles';

type ResumeDownloadProps = {
  href?: string;
  variant?: CtaVariant;
  className?: string;
  label?: string;
};

export function ResumeDownload({
  href = siteConfig.links.resume,
  variant = 'surface',
  className = '',
  label = 'Resume ↓'
}: ResumeDownloadProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${ctaBase} w-full md:w-auto ${ctaClass(variant, 'secondary')} ${className}`}
    >
      <span className="md:hidden">Resume</span>
      <span className="hidden md:inline">{label}</span>
      <span className="v2-visually-hidden"> (opens in a new tab)</span>
    </a>
  );
}
