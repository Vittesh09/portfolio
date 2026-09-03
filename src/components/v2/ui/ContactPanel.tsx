import { siteConfig } from '@/src/config/v2/site';
import { ContactForm } from '@/src/components/v2/ui/ContactForm';

type ContactPanelProps = {
  headingId?: string;
  formHeadingId?: string;
};

export function ContactPanel({
  headingId = 'contact-heading',
  formHeadingId = 'contact-form-heading'
}: ContactPanelProps) {
  return (
    <section
      id="contact"
      className="v2-contact-panel scroll-mt-16"
      aria-labelledby={headingId}
    >
      <div className="v2-contact-layout">
        <div className="v2-contact-intro">
          <div>
            <h2 id={headingId} className="archive-display v2-contact-title">
              Let&apos;s collaborate
            </h2>
            <a
              href={`mailto:${siteConfig.email}`}
              className="v2-contact-email focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-pop"
            >
              {siteConfig.email}
            </a>
          </div>
        </div>

        <div className="v2-contact-aside">
          <h3 id={formHeadingId} className="archive-display v2-contact-form-title">
            Say hello
          </h3>
          <ContactForm labelledBy={formHeadingId} />
        </div>
      </div>
    </section>
  );
}
