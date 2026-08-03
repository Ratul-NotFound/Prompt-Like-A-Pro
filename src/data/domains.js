export const DOMAINS = [
  {
    id: 'coding-ui',
    name: 'UI & Frontend Design',
    category: 'Coding',
    icon: 'Layout',
    badge: 'Coding',
    color: '#6366F1',
    description: 'Build modern, high-aesthetic UI components with responsive layouts, CSS glassmorphism, and micro-interactions.',
    defaultRole: 'Principal Frontend Engineer & UI/UX Design System Architect',
    frameworkDefaults: {
      tone: 'Modern, Sleek, Accessible',
      audience: 'Frontend Developers & End Users',
      format: 'Clean React/JSX component code with scoped Vanilla CSS or Tailwind'
    },
    examples: [
      'Build a dark glassmorphic dashboard card showing real-time system analytics with smooth hover animations.',
      'Create a responsive navigation header with a mobile drawer menu and dark mode toggle switch.'
    ]
  },
  {
    id: 'coding-backend',
    name: 'Backend & API Architecture',
    category: 'Coding',
    icon: 'Server',
    badge: 'Coding',
    color: '#8B5CF6',
    description: 'Design robust RESTful/GraphQL APIs, database schemas, authentication layers, and scalable services.',
    defaultRole: 'Staff Backend Architect & Distributed Systems Engineer',
    frameworkDefaults: {
      tone: 'Production-Grade, Scalable, Defensive',
      audience: 'Backend Developers & System Architects',
      format: 'Structured code snippets, DB migration SQL/JSON schemas, and error handling tables'
    },
    examples: [
      'Design a secure JWT authentication & Refresh Token flow with MongoDB / PostgreSQL schema.',
      'Create a rate-limited REST API endpoint in Node.js / Express with input validation middleware.'
    ]
  },
  {
    id: 'coding-security',
    name: 'Security & Vulnerability Audit',
    category: 'Coding',
    icon: 'ShieldCheck',
    badge: 'Security',
    color: '#F43F5E',
    description: 'Inspect code for OWASP Top 10 vulnerabilities, XSS, SQL Injection, broken access control, and secrets leakage.',
    defaultRole: 'Lead Application Security Engineer & Cybersecurity Auditor',
    frameworkDefaults: {
      tone: 'Rigorous, Analytical, Risk-Focused',
      audience: 'Security Reviewers & Tech Leads',
      format: 'Vulnerability Analysis Table (Severity, Threat, Remediation Code)'
    },
    examples: [
      'Audit this authentication endpoint for OWASP Top 10 vulnerabilities and suggest patched code.',
      'Provide a security checklist for validating user uploads and preventing Remote Code Execution (RCE).'
    ]
  },
  {
    id: 'coding-debug',
    name: 'Debugging & Refactoring',
    category: 'Coding',
    icon: 'Bug',
    badge: 'Coding',
    color: '#10B981',
    description: 'Diagnose runtime errors, analyze stack traces, fix memory leaks, and refactor messy code into clean patterns.',
    defaultRole: 'Senior Staff Engineer & Code Quality Specialist',
    frameworkDefaults: {
      tone: 'Diagnostic, Clear, Actionable',
      audience: 'Software Engineers',
      format: 'Root Cause Explanation + Before vs. After Code Comparison'
    },
    examples: [
      'Debug this memory leak in a Node.js event listener and rewrite it using clean patterns.',
      'Refactor a 300-line deeply nested function into modular, clean SOLID functions with error handling.'
    ]
  },
  {
    id: 'study-feynman',
    name: 'Feynman Technique Explainer',
    category: 'Study',
    icon: 'Brain',
    badge: 'Study',
    color: '#06B6D4',
    description: 'Break down complex technical or academic topics using plain language, real-world analogies, and mental models.',
    defaultRole: 'World-Class Educator & Feynman Learning Method Expert',
    frameworkDefaults: {
      tone: 'Intuitive, Engaging, ELI5 (Explain Like I am 5)',
      audience: 'Students & Curious Learners',
      format: '4-Step Breakdown: Core Concept -> Analogy -> Simple Explanation -> Common Misconceptions'
    },
    examples: [
      'Explain how Quantum Entanglement works using an everyday analogy.',
      'Break down the concept of Neural Network Backpropagation without heavy calculus.'
    ]
  },
  {
    id: 'study-notes',
    name: 'Cornell Notes & Active Recall',
    category: 'Study',
    icon: 'BookOpen',
    badge: 'Study',
    color: '#F59E0B',
    description: 'Transform lectures, textbook chapters, or articles into structured Cornell study notes and active recall questions.',
    defaultRole: 'Academic Strategy Consultant & Learning Scientist',
    frameworkDefaults: {
      tone: 'Structured, Concise, Academic',
      audience: 'Students preparing for exams & self-learners',
      format: 'Cornell Format: Cue Questions column + Summary + Active Recall Flashcards'
    },
    examples: [
      'Convert these lecture notes on Cellular Respiration into Cornell notes with active recall flashcards.',
      'Generate 10 challenging active-recall quiz questions from this chapter on Operating System Deadlocks.'
    ]
  },
  {
    id: 'study-research',
    name: 'Paper Summarizer & Literature',
    category: 'Study',
    icon: 'FileText',
    badge: 'Research',
    color: '#EC4899',
    description: 'Summarize scientific research papers, analyze methodologies, spot study limitations, and extract key findings.',
    defaultRole: 'Principal Academic Researcher & Peer Reviewer',
    frameworkDefaults: {
      tone: 'Objective, Scholarly, Critical',
      audience: 'Researchers, Graduate Students, Analysts',
      format: 'Executive Summary + Methodology Critique + Key Data Points + Study Limitations'
    },
    examples: [
      'Summarize this paper on Transformer Attention mechanisms and highlight its key architectural contributions.',
      'Critique the methodology of this empirical study and list potential confounding variables.'
    ]
  },
  {
    id: 'writing-seo',
    name: 'SEO Blog & Article Copywriter',
    category: 'Writing',
    icon: 'PenTool',
    badge: 'Writing',
    color: '#3B82F6',
    description: 'Write engaging, SEO-optimized blog posts with high-converting hooks, clear headers, and strong search intent matching.',
    defaultRole: 'Senior Content Strategist & Growth Copywriter',
    frameworkDefaults: {
      tone: 'Authoritative, Engaging, Reader-Centric',
      audience: 'Target Readers & Search Engines',
      format: 'Full Article Outline with Catchy Title, Hook Intro, Subheadings (H2/H3), and Key Takeaways'
    },
    examples: [
      'Write a 1,200-word blog post on "Why Server-Side Rendering Matters in 2026" with target SEO keywords.',
      'Craft 5 magnetic headline ideas and an opening hook for an article about AI in healthcare.'
    ]
  },
  {
    id: 'writing-social',
    name: 'Social Thread & Outreach Email',
    category: 'Writing',
    icon: 'MessageSquare',
    badge: 'Writing',
    color: '#A855F7',
    description: 'Generate high-performing LinkedIn posts, X/Twitter viral threads, and compelling cold outreach emails.',
    defaultRole: 'Viral Content Director & B2B Outreach Specialist',
    frameworkDefaults: {
      tone: 'Persuasive, Concise, Scroll-Stopping',
      audience: 'Professionals, Founders, Tech Decision Makers',
      format: 'Post/Thread format with line breaks, visual emojis, and clear Call To Action (CTA)'
    },
    examples: [
      'Create a 7-slide LinkedIn carousel script sharing 5 prompt engineering tips for developers.',
      'Write a personalized B2B cold email pitching a software development agency to tech startups.'
    ]
  },
  {
    id: 'visual-image',
    name: 'Midjourney & Flux Image Prompt',
    category: 'Visuals',
    icon: 'Sparkles',
    badge: 'Visuals',
    color: '#14B8A6',
    description: 'Craft hyper-detailed prompts for Midjourney, DALL-E 3, and Flux with lighting, lens specs, camera angles, and style tags.',
    defaultRole: 'Expert AI Visual Artist & Cinematic Director',
    frameworkDefaults: {
      tone: 'Vivid, Descriptive, Technical Photorealism',
      audience: 'Image Generation Models (Midjourney v6 / Flux / DALL-E)',
      format: 'Primary Subject + Lighting/Atmosphere + Camera Lens & Aspect Ratio Flags (--ar 16:9)'
    },
    examples: [
      'Create a photorealistic Midjourney prompt for a futuristic neon glassmorphic cyberpunk workstation.',
      'Generate a Flux prompt for a minimalist 3D vector illustration of an AI assistant workspace.'
    ]
  },
  {
    id: 'system-prompt',
    name: 'System Prompt Crafter',
    category: 'AI Systems',
    icon: 'Cpu',
    badge: 'AI Systems',
    color: '#6366F1',
    description: 'Build production-ready System Instructions for Custom GPTs, AI Agents, and LLM applications with guardrails.',
    defaultRole: 'Senior AI Engineer & System Prompt Architect',
    frameworkDefaults: {
      tone: 'Instructional, Unambiguous, Strict Guardrails',
      audience: 'LLM Runtime System Prompts / System Instructions',
      format: 'System Prompt Template with [IDENTITY], [CAPABILITIES], [GUARDRAILS], and [OUTPUT RULES]'
    },
    examples: [
      'Create a system prompt for a Customer Support AI Agent that strictly adheres to company policy and never reveals private keys.',
      'Build a system prompt for a Python Code Tutor that guides students with hints instead of providing direct solutions.'
    ]
  }
];

export const CATEGORIES = [
  { id: 'All', name: 'All Scenarios' },
  { id: 'Coding', name: 'Coding & Engineering' },
  { id: 'Security', name: 'Security Auditing' },
  { id: 'Study', name: 'Study & Learning' },
  { id: 'Research', name: 'Research & Academics' },
  { id: 'Writing', name: 'Content & Social' },
  { id: 'Visuals', name: 'AI Image Prompts' },
  { id: 'AI Systems', name: 'System Prompts' }
];
