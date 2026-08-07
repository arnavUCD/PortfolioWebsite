/** Single source of truth for anything that appears in more than one place. */
export const site = {
  name: 'Arnav Sharma',
  email: 'arnsharma@ucdavis.edu',
  phone: '+1 (917) 224-6315',
  /** tel: needs the unpunctuated form. */
  phoneHref: '+19172246315',
  location: 'Davis, CA',
  linkedin: 'https://linkedin.com/in/arnav-sharma-ucd',
  github: 'https://github.com/arnavUCD',
  /** Lives in public/, so it needs the deploy base prefix rather than a bare path. */
  resume: `${import.meta.env.BASE_URL}Arnav-Sharma-Resume.pdf`
} as const;

export const mailto = `mailto:${site.email}`;
