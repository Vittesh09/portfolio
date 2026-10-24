'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { siteConfig } from '@/src/config/v2/site';
import { triggerHaptic } from '@/src/components/v2/ui/haptics';
import { IosHapticSwitch } from '@/src/components/v2/ui/IosHapticSwitch';

type Status = 'idle' | 'sending' | 'sent' | 'error';
type FieldName = 'name' | 'email' | 'message';

const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ?? '';

function headerSafe(value: string, max: number) {
  return value.replace(/[\r\n\0]+/g, ' ').trim().slice(0, max);
}

const THANKS_NOTE = 'Thanks for getting in touch. I’ll reply soon.';

const FORM_ID = 'v2-contact-form';
const NAME_ID = `${FORM_ID}-name`;
const EMAIL_ID = `${FORM_ID}-email`;
const MESSAGE_ID = `${FORM_ID}-message`;
const HONEYPOT_ID = `${FORM_ID}-company-website`;
const SUMMARY_ID = `${FORM_ID}-summary`;
const SUCCESS_ID = `${FORM_ID}-success`;
const NAME_ERROR_ID = `${FORM_ID}-name-error`;
const EMAIL_ERROR_ID = `${FORM_ID}-email-error`;
const MESSAGE_ERROR_ID = `${FORM_ID}-message-error`;

type ContactPayload = { name: string; email: string; message: string };
type ProviderResult = { success?: boolean | string; message?: string };

function isAccepted(response: Response, result: ProviderResult) {
  if (!response.ok) return false;
  if (result.success === false || result.success === 'false') return false;
  return true;
}

function isJsonResponse(response: Response) {
  return (response.headers.get('content-type') || '').toLowerCase().includes('application/json');
}

async function postJson(url: string, body: Record<string, unknown>) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(body)
  });
  let result: ProviderResult = {};
  try {
    result = (await response.json()) as ProviderResult;
  } catch {
    result = {};
  }
  return { response, result };
}

async function tryPostJson(url: string, body: Record<string, unknown>) {
  try {
    return await postJson(url, body);
  } catch {
    return null;
  }
}

async function sendContactMessage({ name, email, message }: ContactPayload) {
  const php = await tryPostJson('/contact.php', { name, email, message });
  if (php && isJsonResponse(php.response) && isAccepted(php.response, php.result)) return;

  if (ACCESS_KEY) {
    const web3 = await tryPostJson('https://api.web3forms.com/submit', {
      access_key: ACCESS_KEY,
      subject: `Portfolio message from ${name}`,
      name,
      from_name: name,
      email,
      message,
      to: siteConfig.email
    });
    if (web3 && isAccepted(web3.response, web3.result)) return;
  }

  const formsubmit = await tryPostJson(
    `https://formsubmit.co/ajax/${encodeURIComponent(siteConfig.email)}`,
    {
      name,
      email,
      message,
      _subject: `Portfolio message from ${name}`,
      _template: 'table',
      _captcha: false,
      _replyto: email
    }
  );
  if (formsubmit && isAccepted(formsubmit.response, formsubmit.result)) return;
  if (formsubmit && typeof formsubmit.result.message === 'string' && /activat/i.test(formsubmit.result.message)) {
    const activate = new Error('ACTIVATE_FORM');
    activate.cause = formsubmit.result.message;
    throw activate;
  }
  throw new Error(
    formsubmit?.result.message || php?.result.message || 'Something went wrong. Please try again.'
  );
}

type ContactFormProps = {
  className?: string;
  /** Heading id that names this form (WCAG 1.3.1 / 4.1.2) */
  labelledBy?: string;
  compact?: boolean;
};

export function ContactForm({ className = '', labelledBy, compact = false }: ContactFormProps) {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLParagraphElement>(null);

  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [sentNote, setSentNote] = useState(THANKS_NOTE);
  const [invalid, setInvalid] = useState<Partial<Record<FieldName, string>>>({});

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

    const form = event.currentTarget;
    const data = new FormData(form);
    if (String(data.get('company_website') ?? '').trim()) {
      form.reset();
      setInvalid({});
      setError('');
      setSentNote(THANKS_NOTE);
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
      await sendContactMessage({ name, email, message });

      form.reset();
      setInvalid({});
      setError('');
      setSentNote(THANKS_NOTE);
      setStatus('sent');
      triggerHaptic('success');
    } catch (err) {
      if (err instanceof Error && err.message === 'ACTIVATE_FORM') {
        form.reset();
        setInvalid({});
        setError('');
        setSentNote(THANKS_NOTE);
        setStatus('sent');
        triggerHaptic('success');
        return;
      }
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
      id={FORM_ID}
      onSubmit={onSubmit}
      className={`v2-contact-form relative ${className}`.trim()}
      noValidate
      aria-labelledby={labelledBy}
      aria-busy={status === 'sending' || undefined}
    >
      {status === 'error' && error ? (
        <div
          ref={summaryRef}
          id={SUMMARY_ID}
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
                    href={`#${NAME_ID}`}
                    className="underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-pop"
                    onClick={(event) => {
                      event.preventDefault();
                      nameRef.current?.focus();
                    }}
                  >
                    Name: {invalid.name}
                  </a>
                </li>
              ) : null}
              {invalid.email ? (
                <li>
                  <a
                    href={`#${EMAIL_ID}`}
                    className="underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-pop"
                    onClick={(event) => {
                      event.preventDefault();
                      emailRef.current?.focus();
                    }}
                  >
                    Email: {invalid.email}
                  </a>
                </li>
              ) : null}
              {invalid.message ? (
                <li>
                  <a
                    href={`#${MESSAGE_ID}`}
                    className="underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-pop"
                    onClick={(event) => {
                      event.preventDefault();
                      messageRef.current?.focus();
                    }}
                  >
                    Message: {invalid.message}
                  </a>
                </li>
              ) : null}
            </ul>
          ) : null}
        </div>
      ) : null}

      <div className="v2-visually-hidden" aria-hidden="true">
        <label htmlFor={HONEYPOT_ID}>Leave this blank</label>
        <input
          id={HONEYPOT_ID}
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="v2-contact-fields">
        <div className="v2-contact-field-group">
          <label htmlFor={NAME_ID} className="v2-contact-label">
            Name <span aria-hidden="true">*</span>
            <span className="v2-visually-hidden"> (required)</span>
          </label>
          <input
            ref={nameRef}
            id={NAME_ID}
            name="name"
            type="text"
            autoComplete="name"
            required
            aria-required="true"
            aria-invalid={invalid.name ? true : undefined}
            aria-describedby={fieldDescribedBy('name', NAME_ERROR_ID)}
            className={`v2-contact-field ${invalid.name ? 'is-invalid' : ''}`}
            maxLength={120}
          />
          {invalid.name ? (
            <p id={NAME_ERROR_ID} className="v2-contact-field-error">
              <span className="font-semibold">Error:</span> {invalid.name}
            </p>
          ) : null}
        </div>

        <div className="v2-contact-field-group">
          <label htmlFor={EMAIL_ID} className="v2-contact-label">
            Email <span aria-hidden="true">*</span>
            <span className="v2-visually-hidden"> (required)</span>
          </label>
          <input
            ref={emailRef}
            id={EMAIL_ID}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            spellCheck={false}
            required
            aria-required="true"
            aria-invalid={invalid.email ? true : undefined}
            aria-describedby={fieldDescribedBy('email', EMAIL_ERROR_ID)}
            className={`v2-contact-field ${invalid.email ? 'is-invalid' : ''}`}
            maxLength={254}
          />
          {invalid.email ? (
            <p id={EMAIL_ERROR_ID} className="v2-contact-field-error">
              <span className="font-semibold">Error:</span> {invalid.email}
            </p>
          ) : null}
        </div>

        <div className="v2-contact-field-group v2-contact-field-group--full">
          <label htmlFor={MESSAGE_ID} className="v2-contact-label">
            Message <span aria-hidden="true">*</span>
            <span className="v2-visually-hidden"> (required)</span>
          </label>
          <textarea
            ref={messageRef}
            id={MESSAGE_ID}
            name="message"
            required
            rows={compact ? 2 : 3}
            aria-required="true"
            aria-invalid={invalid.message ? true : undefined}
            aria-describedby={fieldDescribedBy('message', MESSAGE_ERROR_ID)}
            className={`v2-contact-field v2-contact-field--area ${
              invalid.message ? 'is-invalid' : ''
            }`}
            maxLength={5000}
          />
          {invalid.message ? (
            <p id={MESSAGE_ERROR_ID} className="v2-contact-field-error">
              <span className="font-semibold">Error:</span> {invalid.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="v2-contact-actions relative">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="v2-contact-submit focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-pop"
        >
          {status === 'sending' ? 'Sending…' : 'Submit'}
          <span aria-hidden="true"> →</span>
        </button>
        <IosHapticSwitch
          onActivate={() => {
            if (status === 'sending') return;
            const form = document.getElementById(FORM_ID);
            if (form instanceof HTMLFormElement) form.requestSubmit();
          }}
        />
      </div>

      <div aria-live="polite" aria-atomic="true">
        {status === 'sent' ? (
          <p
            ref={successRef}
            id={SUCCESS_ID}
            tabIndex={-1}
            role="status"
            className="v2-contact-alert outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-pop"
          >
            {sentNote}
          </p>
        ) : null}
      </div>
    </form>
  );
}
