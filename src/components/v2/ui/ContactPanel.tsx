import { availability, replyTime } from '@/src/config/v2/profile';
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
            <h2 id={headingId} className="archive-display v2-contact-title">
              Let&apos;s talk
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-text-secondary">
              I&apos;m open to {availability}. Tell me what you&apos;re building and where the
              design is stuck. I reply within {replyTime}.
            </p>
            <div className="mt-6 max-w-md">
              <CopyEmail variant="surface" className="w-full" />
            </div>
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
