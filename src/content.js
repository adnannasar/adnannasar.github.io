// ALL site content lives in this file. Edit freely.

export const profile = {
  name: 'Adnan Alvi',
  user: 'adnan',
  host: 'portfolio',
  role: 'IT Consultant',
  tagline: 'Helping businesses scale through technology & data',
  location: 'Stockholm, Sweden',
  status: 'Open to networking, partnerships and opportunities that drive impact through technology',
  timezone: 'Europe/Stockholm', // used for the clock in the status bar
  photoAlt: 'Portrait of Adnan Alvi',
}

// Nav sections, in order. id must be one of: about, experience, education, skills, projects, contact.
export const sections = [
  { id: 'about', label: 'About', title: 'About', description: 'Who I am and what I do' },
  { id: 'experience', label: 'Experience', title: 'Experience', description: 'Roles and companies' },
  { id: 'education', label: 'Education', title: 'Education', description: 'Degrees' },
  { id: 'skills', label: 'Skills', title: 'Skills', description: 'Core strengths' },
  { id: 'projects', label: 'Projects', title: 'Projects', description: 'Things I have built' },
  { id: 'contact', label: 'Contact', title: 'Contact', description: 'Links and where to find me' },
]

export const about = [
  'Technology leader and consultant with over a decade of experience in IT strategy, IT support, and data-driven innovation.',
  'My journey runs from hands-on engineering to leading technology strategy, helping businesses scale with cloud migration, digital transformation, and IT consulting.',
  'I have worked across Sweden, Europe, and international markets.',
  'Open to networking, partnerships, and opportunities that drive impact through technology.',
]

export const skills = [
  'IT Strategy & Technology Roadmaps',
  'Data Analytics & Business Intelligence',
  'Cloud Architecture & Migration',
  'Entrepreneurship & Leadership',
]

export const experience = [
  {
    role: 'Senior Software Engineer',
    company: 'Quantum Services AB',
    period: 'Jan 2026 - Present',
    location: 'Stockholm',
  },
  {
    role: 'Chief Executive Officer',
    company: 'Swedish Consultants',
    period: 'Sep 2025 - Present',
    location: 'Stockholm',
  },
  {
    role: 'IT Consultant',
    company: 'SCASIA IT',
    period: 'Oct 2021 - Present',
    location: 'Stockholm',
    description: 'IT services and consulting.',
  },
  {
    role: 'Software Engineer',
    company: 'Sigma Technology Group',
    period: 'Sep 2019 - Sep 2021',
    location: 'Stockholm',
  },
  {
    role: 'IT Software Engineer',
    company: 'Scania Group',
    period: '', // dates unknown, left blank on purpose
  },
]

export const education = [
  {
    title: 'Stockholm University',
    issuer: 'Department of Computer and System Sciences',
    date: '2022',
  },
  {
    title: 'National University of Computer and Emerging Sciences',
    issuer: "Master's degree, Computer Science and Information Technology",
    date: '2016 - 2018',
  },
  {
    title: 'The University of Lahore',
    issuer: "Bachelor's Degree, Computer Science and Information Technology",
    date: '2010 - 2014',
  },
]

// Add your projects here: { name, description, url, tech: ['Vue', ...] }
export const projects = [
  {
    name: 'Your project here',
    description: 'Placeholder: add your projects in src/content.js (the `projects` array).',
    url: '',
    tech: [],
    placeholder: true,
  },
]

export const links = [
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/adnanalvi/' },
  { label: 'GitHub', url: 'https://github.com/adnannasar' },
]

// TODO: add a public email address here if you want it shown. Hidden while empty.
export const email = ''
