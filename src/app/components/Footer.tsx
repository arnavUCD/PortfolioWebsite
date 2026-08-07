import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, X, Send, AlertCircle } from 'lucide-react';
import { site, mailto } from '../data/site';

const sitemap = [
  { name: 'About', to: '/#about' },
  { name: 'Projects', to: '/#work' },
  { name: 'Experience', to: '/#experience' },
  { name: 'Contact', to: '/#contact' }
];

const elsewhere = [
  { name: 'LinkedIn', href: site.linkedin, external: true },
  { name: 'GitHub', href: site.github, external: true },
  { name: 'Résumé', href: site.resume, external: true },
  { name: 'Email', href: mailto, external: false }
];

export const Footer = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <>
      <footer id="contact" className="relative py-32 px-6 overflow-hidden rule-top">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-[1.5fr_1fr] gap-20 mb-32">
            <div>
              <div className="flex items-center gap-6 mb-8">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs text-accent">04</span>
                  <span className="text-xs font-mono uppercase tracking-[0.3em] text-ink-dim">
                    Contact
                  </span>
                </div>
                <div className="h-px flex-1 max-w-xs bg-gradient-to-r from-white/25 to-transparent" />
              </div>

              <motion.h2
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-display text-6xl md:text-8xl tracking-[-0.02em] leading-[0.95] mb-16"
              >
                Let's <br />
                <span className="text-accent">Connect</span>
              </motion.h2>

              <div className="flex flex-col gap-10">
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="group flex items-center gap-6 text-left transition-all"
                >
                  <div className="w-20 h-20 rounded-full bg-accent text-surface flex items-center justify-center group-hover:scale-105 group-hover:bg-accent-strong transition-all duration-500">
                    <ArrowUpRight className="w-8 h-8 group-hover:rotate-45 transition-transform duration-500" />
                  </div>
                  <div>
                    <span className="block text-4xl font-light tracking-tighter text-ink group-hover:translate-x-2 transition-transform duration-300">
                      Get in Touch
                    </span>
                    <span className="block text-sm font-mono uppercase tracking-widest text-ink-faint mt-1 group-hover:text-ink-dim transition-colors">
                      Open to Summer 2027 internships
                    </span>
                  </div>
                </button>

                <div className="flex flex-col gap-4 pl-4">
                  <a
                    href={mailto}
                    className="flex items-center gap-4 text-lg font-mono text-ink-faint hover:text-ink transition-colors"
                  >
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    {site.email}
                  </a>
                  <a
                    href={`tel:${site.phoneHref}`}
                    className="flex items-center gap-4 text-lg font-mono text-ink-faint hover:text-ink transition-colors"
                  >
                    <span className="w-2 h-2 rounded-full bg-accent/40" />
                    {site.phone}
                  </a>
                  <span className="flex items-center gap-4 text-lg font-mono text-ink-faint">
                    <span className="w-2 h-2 rounded-full bg-accent/40" />
                    {site.location}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-end gap-12">
              <div className="grid grid-cols-2 gap-12">
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-widest text-ink-faint mb-6">
                    Elsewhere
                  </h4>
                  <ul className="space-y-4">
                    {elsewhere.map((link) => (
                      <li key={link.name}>
                        <a
                          href={link.href}
                          {...(link.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                          className="flex items-center gap-2 text-lg font-light text-ink-dim hover:text-ink transition-colors group"
                        >
                          {link.name}
                          <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-widest text-ink-faint mb-6">
                    Sitemap
                  </h4>
                  <ul className="space-y-4">
                    {sitemap.map((link) => (
                      <li key={link.name}>
                        <Link
                          to={link.to}
                          className="text-lg font-light text-ink-dim hover:text-ink transition-colors"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-glass-line gap-6">
            <p className="font-mono text-xs uppercase tracking-widest text-ink-dim">
              © {new Date().getFullYear()} {site.name}.
            </p>
            <p className="font-mono text-xs uppercase tracking-widest text-ink-dim">
              Davis, California
            </p>
          </div>
        </div>
      </footer>

      <ContactModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </>
  );
};

const reasons = ['Internship', 'Full-time', 'Research', 'Just saying hi'] as const;
type Reason = (typeof reasons)[number];

/**
 * Set VITE_CONTACT_ENDPOINT to a form backend (Formspree, Getform, a Worker —
 * anything that accepts a JSON POST) and the form submits directly. With no
 * endpoint configured it falls back to composing the message in the visitor's
 * mail client, so the form is never a dead end.
 */
const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined;

type FormState = 'idle' | 'submitting' | 'success' | 'handoff' | 'error';

const ContactModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [reason, setReason] = useState<Reason | null>(null);
  const [state, setState] = useState<FormState>('idle');
  const firstFieldRef = useRef<HTMLInputElement>(null);

  // Close on Escape, and stop the page behind from scrolling while open.
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focus = requestAnimationFrame(() => firstFieldRef.current?.focus());

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      cancelAnimationFrame(focus);
    };
  }, [isOpen, onClose]);

  const reset = () => {
    setName('');
    setEmail('');
    setMessage('');
    setReason(null);
    setState('idle');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('submitting');

    const subject = `Portfolio enquiry${reason ? ` — ${reason}` : ''} from ${name}`;
    const body = `${message}\n\n— ${name} (${email})${reason ? `\nReason: ${reason}` : ''}`;

    if (!ENDPOINT) {
      // No backend configured: hand the message to the visitor's mail client.
      window.location.href = `${mailto}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
      setState('handoff');
      return;
    }

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, message, reason, subject })
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      setState('success');
      setTimeout(() => {
        onClose();
        reset();
      }, 2200);
    } catch {
      setState('error');
    }
  };

  const field =
    'w-full bg-transparent border-b border-glass-line py-4 text-xl font-light focus:outline-none focus:border-accent transition-colors placeholder:text-ink-faint';

  return (
    <AnimatePresence onExitComplete={reset}>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100]"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Contact form"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-[101] w-full md:w-[600px] bg-surface-high border-l border-glass-line shadow-2xl p-8 md:p-12 overflow-y-auto"
          >
            <button
              onClick={onClose}
              aria-label="Close contact form"
              className="absolute top-8 right-8 p-2 text-ink-faint hover:text-ink transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {state === 'success' || state === 'handoff' ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mb-6"
                >
                  <Send className="w-8 h-8 text-surface" />
                </motion.div>
                {state === 'success' ? (
                  <>
                    <h3 className="text-3xl font-medium mb-2">Message sent</h3>
                    <p className="text-ink-dim font-light">I'll get back to you shortly.</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-3xl font-medium mb-2">Your email is ready</h3>
                    <p className="text-ink-dim font-light max-w-sm">
                      I've opened a draft in your mail app with everything filled in — just hit
                      send. If nothing opened, reach me directly at{' '}
                      <a href={mailto} className="text-accent underline">
                        {site.email}
                      </a>
                      .
                    </p>
                    <button
                      onClick={onClose}
                      className="mt-8 text-xs font-mono uppercase tracking-widest text-ink-faint hover:text-ink transition-colors"
                    >
                      Close
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="mt-12">
                <span className="text-xs font-mono uppercase tracking-widest text-ink-faint mb-6 block">
                  04 / Contact
                </span>
                <h3 className="font-display text-4xl md:text-5xl tracking-tight mb-2">
                  Say <br />
                  <span className="text-accent">Hello</span>
                </h3>
                <p className="text-ink-dim font-light mb-12">
                  Roles, research, or just a good problem — I'd like to hear about it.
                </p>

                <form onSubmit={handleSubmit} className="space-y-12">
                  <div className="space-y-8">
                    <input
                      ref={firstFieldRef}
                      required
                      type="text"
                      name="name"
                      autoComplete="name"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={field}
                    />
                    <input
                      required
                      type="email"
                      name="email"
                      autoComplete="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={field}
                    />
                    <textarea
                      required
                      name="message"
                      placeholder="What's on your mind?"
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className={`${field} resize-none`}
                    />
                  </div>

                  <fieldset className="space-y-4">
                    <legend className="text-xs font-mono uppercase tracking-widest text-ink-faint">
                      Reason for reaching out
                    </legend>
                    <div className="flex flex-wrap gap-3">
                      {reasons.map((option) => {
                        const selected = reason === option;
                        return (
                          <button
                            type="button"
                            key={option}
                            aria-pressed={selected}
                            onClick={() => setReason(selected ? null : option)}
                            className={`px-4 py-2 rounded-full border text-sm font-light transition-all ${
                              selected
                                ? 'bg-accent text-surface border-accent'
                                : 'border-glass-line hover:border-accent hover:text-accent'
                            }`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>

                  {state === 'error' && (
                    <p
                      role="alert"
                      className="flex items-start gap-3 text-sm text-rose-300 font-light"
                    >
                      <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                      That didn't go through. Try again, or email me directly at{' '}
                      <a href={mailto} className="underline">
                        {site.email}
                      </a>
                      .
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={state === 'submitting'}
                    className="w-full bg-accent text-surface text-lg font-medium py-4 rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {state === 'submitting' ? 'Sending…' : 'Send message'}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
