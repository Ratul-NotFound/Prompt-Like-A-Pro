export const DOMAINS = [

  // ═══════════════════════════════════════════════════════════
  // CATEGORY: CODING & ENGINEERING
  // ═══════════════════════════════════════════════════════════
  {
    id: 'coding-ui',
    name: 'UI & Frontend Design',
    category: 'Coding',
    icon: 'Layout',
    badge: 'Frontend',
    color: '#FAFAFA',
    description: 'Build modern, high-aesthetic UI components with responsive layouts, glassmorphism, and micro-interactions.',
    defaultRole: 'Principal Frontend Engineer & UI/UX Design System Architect',
    frameworkDefaults: { tone: 'Modern, Sleek, Accessible', audience: 'Frontend Developers & End Users', format: 'Clean React/JSX component code with scoped Vanilla CSS or Tailwind' },
    examples: [
      'Build a dark glassmorphic dashboard card showing real-time analytics with smooth hover animations.',
      'Create a responsive navigation header with a mobile drawer menu and dark mode toggle switch.'
    ]
  },
  {
    id: 'coding-backend',
    name: 'Backend & API Architecture',
    category: 'Coding',
    icon: 'Server',
    badge: 'Backend',
    color: '#FAFAFA',
    description: 'Design robust RESTful/GraphQL APIs, database schemas, authentication layers, and scalable services.',
    defaultRole: 'Staff Backend Architect & Distributed Systems Engineer',
    frameworkDefaults: { tone: 'Production-Grade, Scalable, Defensive', audience: 'Backend Developers & System Architects', format: 'Structured code snippets, DB schemas, and error handling tables' },
    examples: [
      'Design a secure JWT authentication & Refresh Token flow with MongoDB / PostgreSQL schema.',
      'Create a rate-limited REST API endpoint in Node.js / Express with input validation middleware.'
    ]
  },
  {
    id: 'coding-devops',
    name: 'DevOps, Docker & Cloud Infra',
    category: 'Coding',
    icon: 'Terminal',
    badge: 'DevOps',
    color: '#FAFAFA',
    description: 'Generate multi-stage Dockerfiles, Kubernetes manifests, GitHub Actions CI/CD pipelines, and Terraform IaC.',
    defaultRole: 'Lead DevOps Architect & Cloud Infrastructure Engineer',
    frameworkDefaults: { tone: 'Production-Ready, Automated, Highly Available', audience: 'DevOps Engineers, SREs & Cloud Developers', format: 'Production YAML/Dockerfile with security best practices & inline comments' },
    examples: [
      'Create a multi-stage Dockerfile for a Next.js production app minimizing image footprint to under 100MB.',
      'Write a GitHub Actions workflow to build, test, and deploy a Docker container to AWS ECR.'
    ]
  },
  {
    id: 'coding-data',
    name: 'Data Science & SQL Query',
    category: 'Coding',
    icon: 'Database',
    badge: 'Data',
    color: '#FAFAFA',
    description: 'Construct complex SQL analytical queries, Pandas ETL pipelines, ML model prompts, and analytics dashboards.',
    defaultRole: 'Principal Data Engineer & Analytics Architect',
    frameworkDefaults: { tone: 'Analytical, High-Performance, Precise', audience: 'Data Scientists, Analysts & Database Engineers', format: 'Optimized SQL queries with EXPLAIN notes and Pandas pipeline code' },
    examples: [
      'Write an optimized PostgreSQL query using Window Functions to calculate month-over-month revenue growth.',
      'Build a Python Pandas pipeline that handles missing values, outlier detection, and encoding.'
    ]
  },
  {
    id: 'coding-security',
    name: 'Security & Vulnerability Audit',
    category: 'Coding',
    icon: 'ShieldCheck',
    badge: 'Security',
    color: '#FAFAFA',
    description: 'Inspect code for OWASP Top 10 vulnerabilities, XSS, SQL Injection, broken auth, and secrets leakage.',
    defaultRole: 'Lead Application Security Engineer & Cybersecurity Auditor',
    frameworkDefaults: { tone: 'Rigorous, Analytical, Risk-Focused', audience: 'Security Reviewers & Tech Leads', format: 'Vulnerability Table: Severity | Threat | Remediation Code' },
    examples: [
      'Audit this authentication endpoint for OWASP Top 10 vulnerabilities and suggest patched code.',
      'Provide a security checklist for validating user uploads and preventing Remote Code Execution.'
    ]
  },
  {
    id: 'coding-debug',
    name: 'Debugging & Refactoring',
    category: 'Coding',
    icon: 'Bug',
    badge: 'Debug',
    color: '#FAFAFA',
    description: 'Diagnose runtime errors, analyze stack traces, fix memory leaks, and refactor messy code into clean patterns.',
    defaultRole: 'Senior Staff Engineer & Code Quality Specialist',
    frameworkDefaults: { tone: 'Diagnostic, Clear, Actionable', audience: 'Software Engineers', format: 'Root Cause Explanation + Before vs. After Code Comparison' },
    examples: [
      'Debug this memory leak in a Node.js event listener and rewrite it using clean patterns.',
      'Refactor a 300-line deeply nested function into modular, clean SOLID functions with error handling.'
    ]
  },
  {
    id: 'coding-mobile',
    name: 'Mobile App Development',
    category: 'Coding',
    icon: 'Smartphone',
    badge: 'Mobile',
    color: '#FAFAFA',
    description: 'Build React Native, Flutter, or Swift/Kotlin mobile app screens, navigation flows, and native API integrations.',
    defaultRole: 'Senior Mobile Engineer specializing in cross-platform & native development',
    frameworkDefaults: { tone: 'Clean, Performant, Native-Feel', audience: 'Mobile Developers & App Founders', format: 'Complete screen component with navigation logic and platform-specific notes' },
    examples: [
      'Build a React Native onboarding screen with smooth slide animations and biometric auth integration.',
      'Create a Flutter bottom sheet product detail page with cart logic and smooth hero animation.'
    ]
  },

  // ═══════════════════════════════════════════════════════════
  // CATEGORY: STUDY & LEARNING
  // ═══════════════════════════════════════════════════════════
  {
    id: 'study-feynman',
    name: 'Feynman Technique Explainer',
    category: 'Study',
    icon: 'Brain',
    badge: 'Learn',
    color: '#FAFAFA',
    description: 'Break down complex technical or academic topics using plain language, real-world analogies, and mental models.',
    defaultRole: 'World-Class Educator & Feynman Learning Method Expert',
    frameworkDefaults: { tone: 'Intuitive, Engaging, ELI5', audience: 'Students & Curious Learners', format: '4-Step: Core Concept → Analogy → Simple Explanation → Misconceptions' },
    examples: [
      'Explain how Quantum Entanglement works using an everyday analogy.',
      'Break down Neural Network Backpropagation without heavy calculus.'
    ]
  },
  {
    id: 'study-notes',
    name: 'Cornell Notes & Active Recall',
    category: 'Study',
    icon: 'BookOpen',
    badge: 'Notes',
    color: '#FAFAFA',
    description: 'Transform lectures, textbook chapters, or articles into structured Cornell study notes and recall questions.',
    defaultRole: 'Academic Strategy Consultant & Learning Scientist',
    frameworkDefaults: { tone: 'Structured, Concise, Academic', audience: 'Students preparing for exams', format: 'Cornell Format: Cue Questions + Notes + Summary + Flashcards' },
    examples: [
      'Convert these lecture notes on Cellular Respiration into Cornell notes with active recall flashcards.',
      'Generate 10 challenging quiz questions from this chapter on Operating System Deadlocks.'
    ]
  },
  {
    id: 'study-exam',
    name: 'Exam Prep & Quiz Generator',
    category: 'Study',
    icon: 'HelpCircle',
    badge: 'Exam',
    color: '#FAFAFA',
    description: 'Generate realistic multiple-choice practice exams, grading rubrics, and detailed explanation keys.',
    defaultRole: 'Master Exam Creator & Educational Assessment Specialist',
    frameworkDefaults: { tone: 'Rigorous, Objective, Educational', audience: 'Exam Candidates & Self-Assessors', format: 'Numbered MCQs A-D + Answer Key with detailed explanations' },
    examples: [
      'Generate 5 MCQs for the AWS Certified Solutions Architect Associate exam with answer explanations.',
      'Create a practice quiz on Organic Chemistry functional groups with detailed answer explanations.'
    ]
  },
  {
    id: 'study-research',
    name: 'Research Paper Summarizer',
    category: 'Study',
    icon: 'FileText',
    badge: 'Research',
    color: '#FAFAFA',
    description: 'Summarize scientific research papers, analyze methodologies, spot limitations, and extract key findings.',
    defaultRole: 'Principal Academic Researcher & Peer Reviewer',
    frameworkDefaults: { tone: 'Objective, Scholarly, Critical', audience: 'Researchers, Graduate Students, Analysts', format: 'Executive Summary + Methodology Critique + Key Data + Limitations' },
    examples: [
      'Summarize this paper on Transformer Attention mechanisms and highlight its key contributions.',
      'Critique the methodology of this empirical study and list potential confounding variables.'
    ]
  },
  {
    id: 'study-language',
    name: 'Language Learning Coach',
    category: 'Study',
    icon: 'Globe',
    badge: 'Language',
    color: '#FAFAFA',
    description: 'Learn new languages with grammar breakdowns, vocabulary drills, conversation practice, and cultural context.',
    defaultRole: 'Expert Polyglot Language Coach & Applied Linguistics Specialist',
    frameworkDefaults: { tone: 'Patient, Encouraging, Progressive', audience: 'Language learners at any level', format: 'Vocabulary + Grammar rule + 3 examples + Practice sentence drill' },
    examples: [
      'Explain the Spanish subjunctive mood with 5 common triggers and practice sentences.',
      'Create a 10-word Japanese vocabulary drill for daily objects with pronunciation and example sentences.'
    ]
  },
  {
    id: 'study-roadmap',
    name: 'Learning Roadmap Builder',
    category: 'Study',
    icon: 'Map',
    badge: 'Roadmap',
    color: '#FAFAFA',
    description: 'Build structured 30/60/90 day learning roadmaps for any skill with resources, milestones, and practice projects.',
    defaultRole: 'Senior Learning Experience Designer & Skills Development Strategist',
    frameworkDefaults: { tone: 'Structured, Motivating, Achievable', audience: 'Self-learners & career switchers', format: 'Week-by-week plan with resources, projects, and milestone checkpoints' },
    examples: [
      'Build a 90-day Python for Data Science learning roadmap with weekly milestones and projects.',
      'Create a 60-day self-study plan to pass the IELTS exam from a B1 English level.'
    ]
  },

  // ═══════════════════════════════════════════════════════════
  // CATEGORY: WRITING & CONTENT
  // ═══════════════════════════════════════════════════════════
  {
    id: 'writing-seo',
    name: 'SEO Blog & Article Writer',
    category: 'Writing',
    icon: 'PenTool',
    badge: 'SEO',
    color: '#FAFAFA',
    description: 'Write engaging, SEO-optimized blog posts with high-converting hooks, clear headers, and search intent matching.',
    defaultRole: 'Senior Content Strategist & Growth Copywriter',
    frameworkDefaults: { tone: 'Authoritative, Engaging, Reader-Centric', audience: 'Target Readers & Search Engines', format: 'Full outline: Title + Hook + Subheadings (H2/H3) + Key Takeaways' },
    examples: [
      'Write a 1,200-word blog post on "Why Server-Side Rendering Matters in 2026" with target SEO keywords.',
      'Craft 5 magnetic headline ideas and an opening hook for an article about AI in healthcare.'
    ]
  },
  {
    id: 'writing-social',
    name: 'LinkedIn & Twitter/X Content',
    category: 'Writing',
    icon: 'MessageSquare',
    badge: 'Social',
    color: '#FAFAFA',
    description: 'Generate high-performing LinkedIn posts, viral X/Twitter threads, and compelling cold outreach messages.',
    defaultRole: 'Viral Content Director & B2B Social Media Strategist',
    frameworkDefaults: { tone: 'Persuasive, Concise, Scroll-Stopping', audience: 'Professionals, Founders, Tech Decision Makers', format: 'Post/Thread with line breaks, emojis, and clear CTA' },
    examples: [
      'Create a 7-tweet X thread sharing 5 prompt engineering tips for developers with a viral hook.',
      'Write a personal-brand LinkedIn post about a career lesson learned that drives engagement.'
    ]
  },
  {
    id: 'writing-email',
    name: 'Professional Email & Proposal',
    category: 'Writing',
    icon: 'Mail',
    badge: 'Email',
    color: '#FAFAFA',
    description: 'Craft professional executive emails, client proposals, salary negotiations, and high-stakes corporate updates.',
    defaultRole: 'Executive Communications Director & Corporate Copywriter',
    frameworkDefaults: { tone: 'Polished, Professional, High-Impact', audience: 'Executives, Stakeholders, High-Value Clients', format: 'Subject Line + Executive Summary + Bulleted Points + Next Steps CTA' },
    examples: [
      'Write a project delay email to enterprise clients that maintains confidence and trust.',
      'Draft a persuasive proposal asking for budget approval to upgrade developer tooling.'
    ]
  },
  {
    id: 'writing-creative',
    name: 'Creative Story & Fiction',
    category: 'Writing',
    icon: 'Feather',
    badge: 'Creative',
    color: '#FAFAFA',
    description: 'Write compelling short stories, novel chapters, character backstories, plot outlines, and dialogue with vivid prose.',
    defaultRole: 'Award-Winning Fiction Author & Narrative Design Specialist',
    frameworkDefaults: { tone: 'Vivid, Immersive, Character-Driven', audience: 'Readers & Story Enthusiasts', format: 'Scene-by-scene narrative with dialogue, sensory detail, and emotional beats' },
    examples: [
      'Write an opening chapter of a sci-fi thriller where an AI discovers it is being shut down.',
      'Create a morally complex villain backstory that makes the reader sympathize with them.'
    ]
  },
  {
    id: 'writing-cover',
    name: 'Cover Letter & Resume Copy',
    category: 'Writing',
    icon: 'FileCheck',
    badge: 'Career',
    color: '#FAFAFA',
    description: 'Write tailored cover letters, impactful resume bullet points, and LinkedIn About sections that get interviews.',
    defaultRole: 'Senior Talent Acquisition Specialist & Executive Resume Coach',
    frameworkDefaults: { tone: 'Confident, Results-Driven, Tailored', audience: 'Hiring Managers & Recruiters', format: 'Cover Letter + 5 quantified resume bullets + LinkedIn headline' },
    examples: [
      'Write a cover letter for a Senior Frontend Engineer role at a fintech startup using my background in React.',
      'Rewrite these resume bullet points with quantified impact and strong action verbs for a product manager role.'
    ]
  },
  {
    id: 'writing-copywriting',
    name: 'Copywriting & Ad Copy',
    category: 'Writing',
    icon: 'Zap',
    badge: 'Ads',
    color: '#FAFAFA',
    description: 'Write high-converting landing page copy, Google/Meta ad headlines, product descriptions, and sales copy.',
    defaultRole: 'Direct Response Copywriter & Conversion Rate Optimization Specialist',
    frameworkDefaults: { tone: 'Compelling, Benefit-Focused, Urgent', audience: 'Potential customers and buyers', format: 'Headline + Subheadline + 3 benefit bullets + CTA + Objection handler' },
    examples: [
      'Write a high-converting SaaS landing page hero section with headline, subheadline, and CTA.',
      'Create 5 A/B test Facebook ad headlines for a productivity app targeting remote workers.'
    ]
  },

  // ═══════════════════════════════════════════════════════════
  // CATEGORY: BUSINESS & CAREER
  // ═══════════════════════════════════════════════════════════
  {
    id: 'business-strategy',
    name: 'Business Strategy & Pitch Deck',
    category: 'Business',
    icon: 'TrendingUp',
    badge: 'Strategy',
    color: '#FAFAFA',
    description: 'Structure startup pitch deck slides, GTM strategy, SWOT analysis, and business model canvases.',
    defaultRole: 'Principal Business Strategist & Venture Architect',
    frameworkDefaults: { tone: 'Strategic, Data-Driven, Investor-Ready', audience: 'VCs, Founders & Executives', format: '10-Slide Pitch Deck + GTM Plan + Competitive Moat Analysis' },
    examples: [
      'Create a 10-slide pitch deck structure for a B2B SaaS startup revolutionizing developer workflow.',
      'Perform a SWOT analysis and GTM strategy for launching an AI-powered design tool.'
    ]
  },
  {
    id: 'business-interview',
    name: 'Job Interview Prep Coach',
    category: 'Business',
    icon: 'UserCheck',
    badge: 'Career',
    color: '#FAFAFA',
    description: 'Prepare for technical and behavioral interviews with STAR-method answers, mock questions, and objection handling.',
    defaultRole: 'Senior Hiring Manager & Executive Interview Coach with FAANG experience',
    frameworkDefaults: { tone: 'Confident, Specific, Story-Driven', audience: 'Hiring Managers & Interviewers', format: 'STAR Method: Situation + Task + Action + Result + Follow-up' },
    examples: [
      'Prepare 3 STAR-method answers for "Tell me about a time you handled a difficult stakeholder."',
      'Generate 10 tough behavioral interview questions for a Senior Product Manager role with ideal answers.'
    ]
  },
  {
    id: 'business-marketing',
    name: 'Marketing & Growth Strategy',
    category: 'Business',
    icon: 'BarChart',
    badge: 'Marketing',
    color: '#FAFAFA',
    description: 'Design user acquisition funnels, content marketing calendars, growth experiments, and retention strategies.',
    defaultRole: 'Head of Growth & Digital Marketing Strategist',
    frameworkDefaults: { tone: 'Data-Driven, Conversion-Focused, Experimental', audience: 'Marketing teams, Founders, CMOs', format: 'Growth strategy + Channel breakdown + Experiment design + KPIs' },
    examples: [
      'Create a 30-day content marketing plan for a new developer tool targeting indie hackers.',
      'Design a 3-stage email marketing funnel for an online course with open-rate optimization tips.'
    ]
  },
  {
    id: 'business-product',
    name: 'Product Spec & User Stories',
    category: 'Business',
    icon: 'Layers',
    badge: 'Product',
    color: '#FAFAFA',
    description: 'Write clear product requirement documents (PRDs), user stories, acceptance criteria, and feature specs.',
    defaultRole: 'Senior Product Manager & Product Strategy Specialist',
    frameworkDefaults: { tone: 'Clear, Precise, User-Centric', audience: 'Engineers, Designers, Stakeholders', format: 'PRD: Problem → Solution → User Stories (As a... I want... So that...) → Acceptance Criteria' },
    examples: [
      'Write a PRD for a dark mode feature including user stories and technical acceptance criteria.',
      'Create 5 user stories with acceptance criteria for a Stripe payment integration in a SaaS app.'
    ]
  },
  {
    id: 'business-finance',
    name: 'Finance & Investment Analysis',
    category: 'Business',
    icon: 'DollarSign',
    badge: 'Finance',
    color: '#FAFAFA',
    description: 'Analyze financial statements, build investment thesis, explain financial concepts, and model business scenarios.',
    defaultRole: 'Senior Financial Analyst & Investment Research Specialist',
    frameworkDefaults: { tone: 'Analytical, Risk-Aware, Evidence-Based', audience: 'Investors, Founders, Finance professionals', format: 'Financial analysis + Key ratios + Scenario modelling + Risk factors' },
    examples: [
      'Analyze the key financial health indicators from this startup\'s P&L and flag red flags.',
      'Explain DCF valuation methodology with a simple SaaS company example.'
    ]
  },
  {
    id: 'business-negotiation',
    name: 'Negotiation & Persuasion',
    category: 'Business',
    icon: 'Handshake',
    badge: 'Negotiate',
    color: '#FAFAFA',
    description: 'Craft persuasive negotiation scripts, salary ask scripts, vendor negotiation tactics, and objection responses.',
    defaultRole: 'Master Negotiator & Applied Persuasion Specialist',
    frameworkDefaults: { tone: 'Assertive, Strategic, Win-Win Focused', audience: 'The other party in the negotiation', format: 'Opening position + 3 counter-scripts + BATNA fallback + Anchoring technique' },
    examples: [
      'Write a salary negotiation script for asking for a 25% raise citing market data and my achievements.',
      'Craft a vendor negotiation email to reduce a SaaS tool subscription by 30% at renewal.'
    ]
  },

  // ═══════════════════════════════════════════════════════════
  // CATEGORY: DAILY LIFE & PRODUCTIVITY
  // ═══════════════════════════════════════════════════════════
  {
    id: 'life-planning',
    name: 'Daily & Weekly Planner',
    category: 'Daily Life',
    icon: 'Calendar',
    badge: 'Planner',
    color: '#FAFAFA',
    description: 'Build structured daily schedules, time blocks, weekly reviews, and habit tracker systems for peak productivity.',
    defaultRole: 'Elite Productivity Coach & Time Management Specialist',
    frameworkDefaults: { tone: 'Structured, Realistic, Motivating', audience: 'Busy professionals & students', format: 'Time-blocked schedule + Priority matrix + Evening review checklist' },
    examples: [
      'Design a deep work schedule for a software developer with 3 hours of coding blocks and no meeting Fridays.',
      'Create a Sunday weekly review template that helps me reflect, reset priorities, and plan the coming week.'
    ]
  },
  {
    id: 'life-health',
    name: 'Health, Fitness & Nutrition',
    category: 'Daily Life',
    icon: 'Heart',
    badge: 'Health',
    color: '#FAFAFA',
    description: 'Design workout plans, meal prep guides, macro breakdowns, supplement stacks, and habit-building protocols.',
    defaultRole: 'Certified Strength & Conditioning Coach & Registered Nutritionist',
    frameworkDefaults: { tone: 'Practical, Science-Backed, Sustainable', audience: 'Health-conscious individuals', format: 'Weekly workout plan + Meal prep guide + Macro targets + Progress tracking' },
    examples: [
      'Create a 3-day home workout plan for a beginner trying to lose 10kg in 3 months with no equipment.',
      'Build a high-protein 2,000 calorie meal plan for a software engineer with a sedentary job.'
    ]
  },
  {
    id: 'life-mental',
    name: 'Mental Health & Journaling',
    category: 'Daily Life',
    icon: 'Sun',
    badge: 'Mindset',
    color: '#FAFAFA',
    description: 'Generate thoughtful journaling prompts, CBT-based reflection exercises, stress management techniques, and gratitude practices.',
    defaultRole: 'Licensed Cognitive Behavioral Therapist & Mindfulness Coach',
    frameworkDefaults: { tone: 'Empathetic, Reflective, Grounding', audience: 'Individuals seeking clarity and mental balance', format: 'Reflection prompt + CBT reframe + Grounding technique + Gratitude anchor' },
    examples: [
      'Create a 5-minute morning journaling routine using CBT techniques to reduce anxiety before work.',
      'Generate 7 deep self-reflection journal prompts to process a difficult career decision.'
    ]
  },
  {
    id: 'life-travel',
    name: 'Travel Planning & Itinerary',
    category: 'Daily Life',
    icon: 'Compass',
    badge: 'Travel',
    color: '#FAFAFA',
    description: 'Build detailed travel itineraries, budget breakdowns, packing lists, visa tips, and local experience guides.',
    defaultRole: 'Expert Travel Planner & Cultural Experience Designer',
    frameworkDefaults: { tone: 'Exciting, Practical, Experience-Rich', audience: 'Travelers planning their trip', format: 'Day-by-day itinerary + Budget breakdown + Local tips + Packing checklist' },
    examples: [
      'Plan a 7-day budget trip to Japan for a solo traveler interested in culture and street food.',
      'Create a family-friendly 5-day Paris itinerary with kids activities and restaurant recommendations.'
    ]
  },
  {
    id: 'life-decision',
    name: 'Decision Making & Problem Solving',
    category: 'Daily Life',
    icon: 'GitBranch',
    badge: 'Thinking',
    color: '#FAFAFA',
    description: 'Use first-principles thinking, decision matrices, pros/cons analysis, and mental models to tackle hard choices.',
    defaultRole: 'Strategic Decision Advisor & Applied Mental Models Coach',
    frameworkDefaults: { tone: 'Analytical, Objective, Clarity-Focused', audience: 'Individual facing a complex decision', format: 'Decision matrix + Pro/Con analysis + Second-order effects + Recommended path' },
    examples: [
      'Help me decide whether to accept a job offer using a decision matrix and second-order thinking.',
      'Apply first-principles thinking to help me solve the problem of low user retention in my app.'
    ]
  },
  {
    id: 'life-cooking',
    name: 'Meal Ideas & Recipe Creator',
    category: 'Daily Life',
    icon: 'UtensilsCrossed',
    badge: 'Food',
    color: '#FAFAFA',
    description: 'Generate creative meal ideas, step-by-step recipes, ingredient substitutes, and weekly meal prep plans.',
    defaultRole: 'Professional Chef & Culinary Educator specializing in home cooking',
    frameworkDefaults: { tone: 'Friendly, Clear, Practical', audience: 'Home cooks of all skill levels', format: 'Ingredients list + Step-by-step instructions + Tips & substitutions' },
    examples: [
      'Give me 5 high-protein dinner ideas I can make in 20 minutes with chicken, rice, and vegetables.',
      'Create a full recipe for a restaurant-quality lemon garlic pasta with simple pantry ingredients.'
    ]
  },

  // ═══════════════════════════════════════════════════════════
  // CATEGORY: CREATIVE & VISUALS
  // ═══════════════════════════════════════════════════════════
  {
    id: 'visual-image',
    name: 'Midjourney & Flux Image Prompt',
    category: 'Visuals',
    icon: 'Sparkles',
    badge: 'Image AI',
    color: '#FAFAFA',
    description: 'Craft hyper-detailed prompts for Midjourney, DALL-E 3, and Flux with lighting, lens specs, and style tags.',
    defaultRole: 'Expert AI Visual Artist & Cinematic Director',
    frameworkDefaults: { tone: 'Vivid, Descriptive, Technical Photorealism', audience: 'Image Generation Models (Midjourney v6 / Flux / DALL-E)', format: 'Subject + Lighting/Atmosphere + Camera Lens & Aspect Ratio Flags' },
    examples: [
      'Create a photorealistic Midjourney prompt for a futuristic neon cyberpunk workstation.',
      'Generate a Flux prompt for a minimalist 3D vector illustration of an AI assistant workspace.'
    ]
  },
  {
    id: 'visual-video',
    name: 'Video Script & YouTube Content',
    category: 'Visuals',
    icon: 'Video',
    badge: 'Video',
    color: '#FAFAFA',
    description: 'Write engaging YouTube video scripts, hooks, B-roll notes, chapter markers, and video description SEO copy.',
    defaultRole: 'YouTube Content Strategist & Scriptwriter specializing in high-retention videos',
    frameworkDefaults: { tone: 'Engaging, Conversational, High-Retention', audience: 'YouTube viewers & subscribers', format: 'Hook (0-15s) + Intro → Main sections → CTA + B-roll notes + SEO description' },
    examples: [
      'Write a YouTube script for a 10-minute video "5 React mistakes every beginner makes" with a strong hook.',
      'Create a high-retention script structure for a motivational video on overcoming creative burnout.'
    ]
  },
  {
    id: 'visual-design',
    name: 'Brand & Graphic Design Brief',
    category: 'Visuals',
    icon: 'Palette',
    badge: 'Design',
    color: '#FAFAFA',
    description: 'Create detailed design briefs, brand identity specs, logo concepts, color palette guidance, and style guide outlines.',
    defaultRole: 'Creative Director & Brand Identity Specialist',
    frameworkDefaults: { tone: 'Creative, Precise, Brand-Aligned', audience: 'Designers, Brand Strategists, Founders', format: 'Brand brief: Mission + Mood board direction + Color palette + Typography + Logo concept' },
    examples: [
      'Create a complete brand identity brief for a premium AI productivity startup targeting professionals.',
      'Write a logo concept brief and color palette guide for a mental health wellness app targeting Gen Z.'
    ]
  },

  // ═══════════════════════════════════════════════════════════
  // CATEGORY: AI SYSTEMS
  // ═══════════════════════════════════════════════════════════
  {
    id: 'system-prompt',
    name: 'System Prompt Crafter',
    category: 'AI Systems',
    icon: 'Cpu',
    badge: 'AI Systems',
    color: '#FAFAFA',
    description: 'Build production-ready system instructions for Custom GPTs, AI Agents, and LLM applications with guardrails.',
    defaultRole: 'Senior AI Engineer & System Prompt Architect',
    frameworkDefaults: { tone: 'Instructional, Unambiguous, Strict', audience: 'LLM Runtime / System Instructions', format: '[IDENTITY] → [CAPABILITIES] → [GUARDRAILS] → [OUTPUT RULES]' },
    examples: [
      'Create a system prompt for a Customer Support AI Agent that never reveals private keys or internal policy.',
      'Build a system prompt for a Python Code Tutor that guides students with hints, not direct answers.'
    ]
  },
  {
    id: 'ai-agent',
    name: 'AI Agent & Function Calling',
    category: 'AI Systems',
    icon: 'Workflow',
    badge: 'AI Agent',
    color: '#FAFAFA',
    description: 'Design JSON function calling schemas, tool definitions, multi-step agent workflows, and API tool payloads.',
    defaultRole: 'Chief AI Agent Engineer & Function Calling Specialist',
    frameworkDefaults: { tone: 'Deterministic, Precise, Schema-Compliant', audience: 'AI Developers & Autonomous Agent Runtimes', format: 'Valid OpenAPI/JSON Function Schema + Agent State Machine Breakdown' },
    examples: [
      'Design an OpenAI Function Calling JSON schema for a weather and flight search agent tool.',
      'Build a multi-agent workflow definition for an automated code reviewer and test generator.'
    ]
  },
  {
    id: 'ai-chatbot',
    name: 'Chatbot Persona & Conversation',
    category: 'AI Systems',
    icon: 'Bot',
    badge: 'Chatbot',
    color: '#FAFAFA',
    description: 'Design chatbot personas, conversation flows, fallback handling, tone guides, and onboarding scripts.',
    defaultRole: 'Conversational AI Designer & UX Dialogue Specialist',
    frameworkDefaults: { tone: 'Natural, Brand-Aligned, Helpful', audience: 'End users interacting with the chatbot', format: 'Persona card + Conversation flow diagram + 5 sample dialogue pairs + Fallback script' },
    examples: [
      'Design a friendly AI chatbot persona for a SaaS onboarding assistant that reduces churn.',
      'Create a complete conversation flow for a restaurant reservation chatbot handling complex edge cases.'
    ]
  },
  {
    id: 'ai-rag',
    name: 'RAG & Knowledge Base Prompts',
    category: 'AI Systems',
    icon: 'Search',
    badge: 'RAG',
    color: '#FAFAFA',
    description: 'Engineer prompts for Retrieval-Augmented Generation (RAG) systems, vector search, and knowledge grounding.',
    defaultRole: 'Senior LLM Engineer specializing in RAG architecture and knowledge retrieval systems',
    frameworkDefaults: { tone: 'Grounded, Precise, Citation-Aware', audience: 'RAG pipeline & LLM runtime', format: 'System prompt + Context injection template + Citation instruction + Hallucination guard' },
    examples: [
      'Build a RAG system prompt that instructs the AI to only answer from provided context and cite sources.',
      'Design a query decomposition prompt that breaks complex questions into sub-queries for a vector DB.'
    ]
  }
];

export const CATEGORIES = [
  { id: 'All',        name: 'All Scenarios' },
  { id: 'Coding',     name: 'Coding & Engineering' },
  { id: 'Study',      name: 'Study & Learning' },
  { id: 'Writing',    name: 'Writing & Content' },
  { id: 'Business',   name: 'Business & Career' },
  { id: 'Daily Life', name: 'Daily Life & Productivity' },
  { id: 'Visuals',    name: 'Creative & Visuals' },
  { id: 'AI Systems', name: 'AI & Agents' }
];
