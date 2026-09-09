/** Single source of truth for anything that appears in more than one place. */
export const site = {
  name: 'Arnav Sharma',
  email: 'arnsharma@ucdavis.edu',
  phone: '+1 (917) 224-6315',
  /** tel: needs the unpunctuated form. */
  phoneHref: '+19172246315',
  location: 'Davis, CA',
  linkedin: 'https://linkedin.com/in/arnav-sharma-772469279',
  github: 'https://github.com/arnavUCD',
  resume: new URL('../../../Arnav Sharma Resume.pdf', import.meta.url).href
} as const;

export const mailto = `mailto:${site.email}`;
