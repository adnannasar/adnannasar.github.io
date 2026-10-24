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
  { id: 'education', label: 'Education', title: 'Education', description: 'Degrees and courses' },
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
    role: 'Chief Executive Officer',
    company: 'Swedish Consultants',
    period: 'Sep 2025 - Present',
    location: 'Stockholm',
    description:
      'Business consulting helping students and professionals with international mobility, career advancement, work / business, and IT consultancy.',
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
    details: [
      { label: 'Major courses', items: ['Data Mining', 'Network and Information Security', 'Research Methodology', 'Enterprise Computing and ERP System', 'Internet of Things'] },
    ],
  },
  {
    title: 'National University of Computer and Emerging Sciences',
    issuer: "Master's degree, Computer Science and Information Technology",
    date: '2016 - 2018',
    details: [
      { label: 'Research areas', items: ['R&D', 'Internet of Things (IoT)', 'Big Data', 'Vehicular ad hoc networks (VANETs)'] },
      { label: 'Major courses', items: ['Machine Learning', 'Statistical Analysis and Pattern Recognition', 'Research Methodology', 'Advanced Analysis of Algorithms', 'Applied Programming', 'Theory of Programming Languages'] },
    ],
  },
  {
    title: 'The University of Lahore',
    issuer: "Bachelor's Degree, Computer Science and Information Technology",
    date: '2010 - 2014',
    details: [
      { label: 'Major courses', items: ['Computer Programming', 'Data Bases', 'Software Engineering', 'Software Testing & Implementation', 'Data Structures', 'Artificial Intelligence', 'Java Software Development Paradigm', 'Object-Oriented Analysis and Design', 'Object-Oriented Programming', 'Discrete Mathematics', 'Linear Algebra & Differential Equation', 'Probability & Statistics', 'Numerical Computations'] },
    ],
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
  { label: 'GitHub', url: 'https://github.com/adnanalvi' },
]

// TODO: add a public email address here if you want it shown. Hidden while empty.
export const email = ''
