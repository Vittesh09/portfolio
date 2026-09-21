'use client';

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { siteConfig } from '@/src/config/v2/site';

type Status = 'idle' | 'sending' | 'sent' | 'error';
type FieldName = 'name' | 'email' | 'message';

const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ?? '';

function headerSafe(value: string, max: number) {
  return value.replace(/[\r\n\0]+/g, ' ').trim().slice(0, max);
}

type ContactFormProps = {
  className?: string;
  /** Heading id that names this form (WCAG 1.3.1 / 4.1.2) */
  labelledBy?: string;
};

export function ContactForm({ className = '', labelledBy }: ContactFormProps) {
  const reactId = useId();
  const formId = `contact-${reactId.replace(/:/g, '')}`;
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLParagraphElement>(null);

  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [invalid, setInvalid] = useState<Partial<Record<FieldName, string>>>({});

  const summaryId = `${formId}-summary`;
  const successId = `${formId}-success`;
  const nameErrorId = `${formId}-name-error`;
  const emailErrorId = `${formId}-email-error`;
  const messageErrorId = `${formId}-message-error`;

  useEffect(() => {
    if (status === 'error' && error) {
      summaryRef.current?.focus();
      return;
    }
    if (status === 'sent') {
      successRef.current?.focus();
    }
  }, [status, error, invalid]);

  function fieldDescribedBy(field: FieldName, errorId: string) {
    return invalid[field] ? errorId : undefined;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setInvalid({});
    setStatus('idle');

    if (!ACCESS_KEY) {
      setStatus('error');
      setError(`Form isn’t connected yet. Or email me at ${siteConfig.email}.`);
      return;
    }

    const form = event.currentTarget;
    const data = new FormData(form);
    if (String(data.get('company_website') ?? '').trim()) {
      form.reset();
      setInvalid({});
      setError('');
      setStatus('sent');
      return;
    }
    const name = headerSafe(String(data.get('name') ?? '').trim(), 120);
    const email = headerSafe(String(data.get('email') ?? '').trim(), 254);
    const message = String(data.get('message') ?? '').trim().slice(0, 5000);

    const nextInvalid: Partial<Record<FieldName, string>> = {};
    if (!name) nextInvalid.name = 'Enter your name.';
    if (!email) nextInvalid.email = 'Enter your email address.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextInvalid.email = 'Enter a valid email address, for example name@company.com.';
    }
    if (!message) nextInvalid.message = 'Enter a message.';

    const errorCount = Object.keys(nextInvalid).length;
    if (errorCount > 0) {
      setInvalid(nextInvalid);
      setStatus('error');
      setError(
        errorCount === 1
          ? '1 error found. Please fix it and try again.'
          : `${errorCount} errors found. Please fix them and try again.`
      );
      return;
    }

    setStatus('sending');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `Portfolio message from ${name}`,
          from_name: name,
          email,
          message,
          to: siteConfig.email
        })
      });

      const result = (await response.json()) as { success?: boolean; message?: string };
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Something went wrong. Please try again.');
      }

      form.reset();
      setInvalid({});
      setError('');
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setError(
        err instanceof Error
          ? `${err.message} Or email me at ${siteConfig.email}.`
          : `Couldn’t send. Or email me at ${siteConfig.email}.`
      );
    }
  }

  return (
    <form
      id={formId}
      onSubmit={onSubmit}
      className={`v2-contact-form relative ${className}`.trim()}
      noValidate
      aria-labelledby={labelledBy}
      aria-busy={status === 'sending' || undefined}
    >
      {status === 'error' && error ? (
        <div
          ref={summaryRef}
          id={summaryId}
          tabIndex={-1}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          className="v2-contact-alert outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-pop"
        >
          <p className="text-sm font-semibold text-text-primary">{error}</p>
          {Object.keys(invalid).length > 0 ? (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-text-primary">
              {invalid.name ? (
                <li>
                  <a
                    href={`#${formId}-name`}
                    className="underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-pop"
                    onClick={(event) => {
                      event.preventDefault();
                      nameRef.current?.focus();
                    }}
                  >
                    Name — {invalid.name}
                  </a>
                </li>
              ) : null}
              {invalid.email ? (
                <li>
                  <a
                    href={`#${formId}-email`}
                    className="underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-pop"
                    onClick={(event) => {
                      event.preventDefault();
                      emailRef.current?.focus();
                    }}
                  >
                    Email — {invalid.email}
                  </a>
                </li>
              ) : null}
              {invalid.message ? (
                <li>
                  <a
                    href={`#${formId}-message`}
                    className="underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-pop"
                    onClick={(event) => {
                      event.preventDefault();
                      messageRef.current?.focus();
                    }}
                  >
                    Message — {invalid.message}
                  </a>
                </li>
              ) : null}
            </ul>
          ) : null}
        </div>
      ) : null}

      <div className="v2-visually-hidden" aria-hidden="true">
        <label htmlFor={`${formId}-company-website`}>Company website</label>
        <input
          id={`${formId}-company-website`}
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="v2-contact-fields">
        <div className="v2-contact-field-group">
          <label htmlFor={`${formId}-name`} className="v2-contact-label">
            Name <span aria-hidden="true">*</span>
            <span className="v2-visually-hidden"> (required)</span>
          </label>
          <input
            ref={nameRef}
            id={`${formId}-name`}
            name="name"
            type="text"
            autoComplete="name"
            required
            aria-required="true"
            aria-invalid={invalid.name ? true : undefined}
            aria-describedby={fieldDescribedBy('name', nameErrorId)}
            className={`v2-contact-field ${invalid.name ? 'is-invalid' : ''}`}
            maxLength={120}
          />
          {invalid.name ? (
            <p id={nameErrorId} className="v2-contact-field-error">
              <span className="font-semibold">Error:</span> {invalid.name}
            </p>
          ) : null}
        </div>

        <div className="v2-contact-field-group">
          <label htmlFor={`${formId}-email`} className="v2-contact-label">
            Email <span aria-hidden="true">*</span>
            <span className="v2-visually-hidden"> (required)</span>
          </label>
          <input
            ref={emailRef}
            id={`${formId}-email`}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            spellCheck={false}
            required
            aria-required="true"
            aria-invalid={invalid.email ? true : undefined}
            aria-describedby={fieldDescribedBy('email', emailErrorId)}
            className={`v2-contact-field ${invalid.email ? 'is-invalid' : ''}`}
            maxLength={254}
          />
          {invalid.email ? (
            <p id={emailErrorId} className="v2-contact-field-error">
              <span className="font-semibold">Error:</span> {invalid.email}
            </p>
          ) : null}
        </div>

        <div className="v2-contact-field-group v2-contact-field-group--full">
          <label htmlFor={`${formId}-message`} className="v2-contact-label">
            Message <span aria-hidden="true">*</span>
            <span className="v2-visually-hidden"> (required)</span>
          </label>
          <textarea
            ref={messageRef}
            id={`${formId}-message`}
            name="message"
            required
            rows={3}
            aria-required="true"
            aria-invalid={invalid.message ? true : undefined}
            aria-describedby={fieldDescribedBy('message', messageErrorId)}
            className={`v2-contact-field v2-contact-field--area ${
              invalid.message ? 'is-invalid' : ''
            }`}
            maxLength={5000}
          />
          {invalid.message ? (
            <p id={messageErrorId} className="v2-contact-field-error">
              <span className="font-semibold">Error:</span> {invalid.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="v2-contact-actions">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="v2-contact-submit focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-pop"
        >
          {status === 'sending' ? 'Sending…' : 'Submit'}
          <span aria-hidden="true"> →</span>
        </button>
      </div>

      <div aria-live="polite" aria-atomic="true">
        {status === 'sent' ? (
          <p
            ref={successRef}
            id={successId}
            tabIndex={-1}
            role="status"
            className="v2-contact-alert outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-pop"
          >
            Thanks — your message was sent. I’ll get back to you soon.
          </p>
        ) : null}
      </div>
      <p className="mt-4 text-sm leading-relaxed text-text-secondary">
        I use submissions only to reply. Nothing is sold or added to a marketing list.
      </p>
    </form>
  );
}
