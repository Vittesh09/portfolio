import { ContactForm } from '@/src/components/v2/ui/ContactForm';
import { CopyEmail } from '@/src/components/v2/ui/CopyEmail';

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
            <p className="v2-contact-kicker">Seems like our stars are aligned!</p>
            <h2 id={headingId} className="archive-display v2-contact-title">
              Let&apos;s connect
            </h2>
            <div className="mt-6 max-w-md">
              <CopyEmail variant="surface" className="w-full" />
            </div>
          </div>
        </div>

        <div className="v2-contact-aside">
          <h3 id={formHeadingId} className="archive-display v2-contact-form-title">
            Shoot me a message
          </h3>
          <ContactForm labelledBy={formHeadingId} />
        </div>
      </div>
    </section>
  );
}
