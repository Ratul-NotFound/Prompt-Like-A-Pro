/**
 * Prompt Like A Pro — Smart Heavy-Duty Local AI Engine powered by Compromise NLP
 *
 * UPGRADED: Intent-First Deep Reasoning Engine
 * Performs deep intent analysis, goal inference, audience detection,
 * constraint mapping, and context-aware precision prompt synthesis.
 * Not a template. A thinking system.
 */

import nlp from 'compromise';

export function extractVariables(text) {
  if (!text) return [];
  const doubleCurlyRegex = /\{\{([^}]+)\}\}/g;
  const squareBracketRegex = /\[([A-Z0-9_\s-]+)\]/g;
  
  const vars = new Set();
  let match;

  while ((match = doubleCurlyRegex.exec(text)) !== null) {
    vars.add(match[1].trim());
  }

  while ((match = squareBracketRegex.exec(text)) !== null) {
    const val = match[1].trim();
    if (val.length > 1 && !/^\d+$/.test(val) && val.toLowerCase() !== 'x') {
      vars.add(val);
    }
  }

  return Array.from(vars);
}

export function estimateTokens(text) {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

export function evaluatePromptStrength(text) {
  if (!text || !text.trim()) {
    return { score: 0, level: 'Empty', feedback: 'Enter some text to evaluate.', checks: [] };
  }

  let score = 0;
  const checks = [];

  const doc = nlp(text);
  const verbs = doc.verbs().out('array');

  // Length Check
  if (text.length > 150) {
    score += 30;
    checks.push('Detailed context provided');
  } else if (text.length > 50) {
    score += 15;
    checks.push('Basic context provided');
  }

  // Key verb check via NLP
  if (verbs.length > 0) {
    score += 20;
    checks.push(`Clear action verbs (${verbs.slice(0, 2).join(', ')})`);
  }

  // Constraints/Examples check
  const constraints = ['not', 'avoid', 'only', 'don\'t', 'except', 'format', 'markdown', 'json', 'table'];
  const hasConstraint = constraints.some(c => text.toLowerCase().includes(c));
  if (hasConstraint) {
    score += 25;
    checks.push('Constraints or formats specified');
  }

  // Variable check
  const hasVariables = text.includes('{{') || text.includes('[') || text.includes('<');
  if (hasVariables) {
    score += 25;
    checks.push('Uses variable placeholders');
  }

  let level = 'Basic';
  let feedback = 'Add context, format requirements, or role constraints to make it professional.';

  if (score >= 75) {
    level = 'Pro / Elite';
    feedback = 'Excellent. Contains specific context, actions, constraints, or formats.';
  } else if (score >= 40) {
    level = 'Advanced';
    feedback = 'Good start. Add specific negative constraints or persona details.';
  }

  return { score, level, feedback, checks };
}

// ============================================================================
// MAIN ENGINE — DEEP INTENT-FIRST PROMPT SYNTHESIS
// ============================================================================

export function enhancePrompt(rawPrompt, domain, settings = {}) {
  if (!rawPrompt || !rawPrompt.trim()) {
    return {
      enhancedText: '',
      additions: [],
      variables: [],
      tokenCount: 0,
      rawTokenCount: 0
    };
  }

  // ─── PHASE 1: Deep Analysis ────────────────────────────────────────────────
  const doc = nlp(rawPrompt);
  const verbs = doc.verbs().out('array').map(v => v.toLowerCase());
  const nouns = doc.nouns().out('array').map(n => n.toLowerCase());
  const adjectives = doc.adjectives().out('array').map(a => a.toLowerCase());
  const detectedTech = detectTechStack(rawPrompt);
  const isHeavyWork = detectComplexity(rawPrompt, verbs, nouns, detectedTech);

  // ─── PHASE 2: Intent & Goal Inference ─────────────────────────────────────
  const intent = classifySemanticIntent(verbs, rawPrompt);
  const inferredGoal = inferUserGoal(rawPrompt, intent, nouns, domain);
  const inferredAudience = inferAudience(rawPrompt, domain, intent);
  const inferredContext = inferContext(rawPrompt, domain, detectedTech, isHeavyWork);
  const smartConstraints = inferSmartConstraints(rawPrompt, domain, intent, detectedTech);

  // ─── PHASE 3: Precision Persona ───────────────────────────────────────────
  const role = settings.role || synthesizePrecisionPersona(domain, intent, nouns, detectedTech, isHeavyWork);

  // ─── PHASE 4: Output Specification ────────────────────────────────────────
  const deliverables = synthesizeDeliverables(domain.id, intent, nouns, detectedTech, isHeavyWork);
  const outputTrigger = buildOutputTrigger(intent, isHeavyWork);
  const tone = settings.tone || domain.frameworkDefaults?.tone || 'Expert, authoritative, precise';
  const format = settings.format || domain.frameworkDefaults?.format || 'Structured Markdown';

  // ─── PHASE 5: Context Boosters (what the user forgot but obviously needs) ─
  const contextBoosters = buildContextBoosters(rawPrompt, domain, intent, detectedTech, adjectives);

  // ─── Build additions (for Diff view) ──────────────────────────────────────
  const additions = [
    { tag: 'Intent Analysis', text: `Goal: ${inferredGoal}` },
    { tag: 'Audience Detection', text: `For: ${inferredAudience}` },
    { tag: 'Precision Persona', text: `Act as: ${role}` },
    { tag: 'Smart Constraints', text: smartConstraints.map(c => `- ${c}`).join('\n') },
    { tag: 'Deliverables', text: deliverables.map(d => `- ${d}`).join('\n') }
  ];

  if (isHeavyWork) {
    additions.push({ tag: 'Chain-of-Thought', text: 'Step-by-step reasoning & architecture analysis enabled for complex task.' });
  }
  if (contextBoosters.length > 0) {
    additions.push({ tag: 'Context Boosters', text: contextBoosters.map(b => `+ ${b}`).join('\n') });
  }

  // ─── Build the final precision prompt ─────────────────────────────────────
  const enhancedText = buildPrecisionPrompt({
    role,
    inferredGoal,
    rawPrompt,
    inferredAudience,
    inferredContext,
    smartConstraints,
    deliverables,
    contextBoosters,
    tone,
    format,
    isHeavyWork,
    detectedTech,
    outputTrigger
  });

  const variables = extractVariables(enhancedText);

  return {
    enhancedText,
    additions,
    variables,
    tokenCount: estimateTokens(enhancedText),
    rawTokenCount: estimateTokens(rawPrompt)
  };
}

// ============================================================================
// GOAL & AUDIENCE INFERENCE ENGINE
// ============================================================================

function inferUserGoal(rawPrompt, intent, nouns, domain) {
  const p = rawPrompt.toLowerCase();
  const clean = rawPrompt.replace(/^(can you|please|help me|i want to|i need to|write a|create a|generate a|make a|build a)\s+/i, '').trim();

  const goalMap = {
    DEBUG:    `Diagnose and permanently fix: "${clean}" — output must be production-ready, not just patched.`,
    AUDIT:    `Identify all vulnerabilities, risks, and quality issues in: "${clean}" — prioritized by severity with executable fixes.`,
    REFACTOR: `Transform: "${clean}" into clean, scalable, maintainable code following modern best practices.`,
    EXPLAIN:  `Build a complete, intuitive understanding of: "${clean}" — from fundamentals to practical application.`,
    SUMMARIZE:`Extract the key insights, patterns, and actionable takeaways from: "${clean}".`,
    VISUAL:   `Generate a photorealistic / artistic visual of: "${clean}" — optimized for generative AI image model input.`,
    ARCHITECT:`Design the complete architecture, data flow, and implementation blueprint for: "${clean}".`,
    BUILD:    `Deliver a fully functional, production-grade implementation of: "${clean}".`
  };

  return goalMap[intent] || `Produce an expert, high-quality solution for: "${clean}".`;
}

function inferAudience(rawPrompt, domain, intent) {
  const p = rawPrompt.toLowerCase();

  if (/\b(client|customer|non-tech|manager|exec|ceo|cto|stakeholder|investor|pitch)\b/.test(p)) {
    return 'Non-technical business decision-makers — avoid jargon, lead with value and outcomes';
  }
  if (/\b(interview|hiring|resume|job|recruiter|linkedin|portfolio)\b/.test(p)) {
    return 'Hiring managers and technical recruiters — show measurable impact and clear skills';
  }
  if (/\b(student|beginner|learn|newbie|junior|first time)\b/.test(p)) {
    return 'Beginner learners — use plain language, relatable analogies, and step-by-step progression';
  }
  if (/\b(senior|principal|staff|architect|lead|team|review|pr)\b/.test(p)) {
    return 'Senior engineers and technical leads — assume deep expertise, be terse and precise';
  }
  if (/\b(ai|llm|model|gpt|claude|gemini|prompt)\b/.test(p)) {
    return 'An AI language model — use clear directives, structured format, unambiguous instructions';
  }

  // Infer from domain
  const audienceByDomain = {
    'coding':   'Software engineers expecting clean, runnable, production-grade code',
    'writing':  'Readers expecting clear, engaging, well-structured prose',
    'business': 'Business professionals expecting strategic, data-driven insights',
    'study':    'Learners expecting structured, memorable, easy-to-digest explanations',
    'creative': 'Creative collaborators expecting imaginative, original, vivid outputs',
    'ai':       'AI models and prompt engineers expecting precise, unambiguous instructions'
  };

  const domainCat = domain.category?.toLowerCase() || '';
  for (const [key, val] of Object.entries(audienceByDomain)) {
    if (domainCat.includes(key)) return val;
  }

  return 'A capable AI assistant expecting clear, specific, actionable instructions';
}

function inferContext(rawPrompt, domain, detectedTech, isHeavyWork) {
  const contexts = [];
  const p = rawPrompt.toLowerCase();

  if (detectedTech.length > 0) contexts.push(`Tech Stack: ${detectedTech.join(', ')}`);
  if (isHeavyWork) contexts.push('Scale: Enterprise / Production');
  if (/\b(startup|mvp|prototype|demo|poc)\b/.test(p)) contexts.push('Stage: Early-stage / MVP — speed and clarity over perfection');
  if (/\b(production|scale|performance|optimize|deploy)\b/.test(p)) contexts.push('Stage: Production — correctness, performance, and reliability critical');
  if (/\b(team|collaboration|pr|review|open source)\b/.test(p)) contexts.push('Environment: Collaborative team codebase — follow conventions and write for reviewability');

  return contexts.length > 0 ? contexts.join(' | ') : `Domain: ${domain.name}`;
}

function inferSmartConstraints(rawPrompt, domain, intent, tech) {
  const p = rawPrompt.toLowerCase();
  const constraints = [];

  // Universal smart constraints
  constraints.push('No filler text, preamble, or "here is your..." introductions — start the output immediately.');
  constraints.push('No vague recommendations — every suggestion must be specific and immediately actionable.');

  // Intent-specific
  if (intent === 'DEBUG' || intent === 'REFACTOR') {
    constraints.push('Do not apply band-aid patches. Fix at the root level and explain the underlying cause.');
    constraints.push('Ensure zero regressions — verify no adjacent functionality is broken.');
  }
  if (intent === 'EXPLAIN') {
    constraints.push('No academic jargon without immediate plain-language translation.');
    constraints.push('Every abstract concept must have one concrete real-world analogy.');
  }
  if (intent === 'BUILD' && tech.length > 0) {
    constraints.push(`Write only for the specified stack (${tech.join(', ')}) — do not introduce unlisted dependencies.`);
    constraints.push('All code must be copy-paste ready — no TODO placeholders, no omitted sections.');
  }
  if (intent === 'VISUAL') {
    constraints.push('Specify exact camera lens, lighting type, and color palette — not generic terms like "beautiful lighting".');
    constraints.push('Include platform-specific flags (e.g. --ar 16:9 --v 6 for Midjourney).');
  }
  if (/\b(short|brief|concise|quick|tldr)\b/.test(p)) {
    constraints.push('Keep output brief and scannable — max 200 words unless precision requires more.');
  }
  if (domain.id?.startsWith('writing')) {
    constraints.push('Avoid clichéd AI openers ("In today\'s world...", "In conclusion..."). Start strong, end decisively.');
  }

  return constraints;
}

function buildContextBoosters(rawPrompt, domain, intent, tech, adjectives) {
  const boosters = [];
  const p = rawPrompt.toLowerCase();

  if (!p.includes('format') && !p.includes('markdown') && !p.includes('json') && intent !== 'VISUAL') {
    boosters.push('Structure your output with clear headers and sections for maximum readability');
  }
  if (tech.length > 0 && !p.includes('test') && intent === 'BUILD') {
    boosters.push('Include a basic test case or validation step to verify correctness');
  }
  if (!p.includes('example') && (intent === 'EXPLAIN' || intent === 'BUILD')) {
    boosters.push('Include at least one concrete, working example to illustrate the concept');
  }
  if (intent === 'ARCHITECT' && !p.includes('error') && !p.includes('fail')) {
    boosters.push('Address failure modes and error handling in the design');
  }

  return boosters;
}

function buildOutputTrigger(intent, isHeavyWork) {
  const triggerMap = {
    DEBUG:    'Begin with your root-cause diagnosis, then deliver the fix:',
    AUDIT:    'Start with a severity matrix, then provide remediation:',
    REFACTOR: 'Show the refactored architecture with before/after comparison:',
    EXPLAIN:  'Deliver your explanation, starting with the core mental model:',
    SUMMARIZE:'Provide the structured summary with key insights and takeaways:',
    VISUAL:   'Output the complete generative prompt, ready to paste:',
    ARCHITECT:'Present the full architecture design with components and data flow:',
    BUILD:    isHeavyWork
      ? 'Think through the architecture first, then deliver the complete implementation:'
      : 'Deliver the complete, working implementation:'
  };
  return triggerMap[intent] || 'Deliver your expert output now:';
}

// ============================================================================
// PRECISION PROMPT BUILDER
// ============================================================================

function buildPrecisionPrompt({ role, inferredGoal, rawPrompt, inferredAudience, inferredContext, smartConstraints, deliverables, contextBoosters, tone, format, isHeavyWork, detectedTech, outputTrigger }) {
  const techLine = detectedTech.length > 0
    ? `\nTechnology Stack: ${detectedTech.join(', ')}`
    : '';

  const contextLine = inferredContext
    ? `\nWorking Context: ${inferredContext}`
    : '';

  const audienceLine = inferredAudience
    ? `\nTarget Audience: ${inferredAudience}`
    : '';

  const boosterSection = contextBoosters.length > 0
    ? `\n\n### 💡 CONTEXT BOOSTERS\n${contextBoosters.map(b => `- ${b}`).join('\n')}`
    : '';

  const cotSection = isHeavyWork
    ? `\n\n### 🧠 REASONING FIRST\nBefore producing output, briefly map your approach:\n1. Identify core requirements and edge cases.\n2. Evaluate trade-offs or alternative approaches.\n3. Confirm your strategy, then execute.`
    : '';

  return `### 🎯 ROLE & EXPERTISE
Act as ${role}. You have deep, production-grade expertise in this domain. You think precisely, write authoritatively, and never produce vague or generic output.

### 📌 TASK & REAL OBJECTIVE
${inferredGoal}${techLine}${contextLine}${audienceLine}

### 📋 DELIVERABLES
${deliverables.map(d => `- ${d}`).join('\n')}${boosterSection}

### 🎨 STYLE & FORMAT
- **Tone:** ${tone}
- **Format:** ${format}${cotSection}

### 🛡️ HARD CONSTRAINTS
${smartConstraints.map(c => `- ${c}`).join('\n')}

${outputTrigger}`;
}

// ============================================================================
// NLP CLASSIFICATION ENGINES
// ============================================================================

function detectTechStack(prompt) {
  const p = prompt.toLowerCase();
  const techList = [
    'react', 'next.js', 'node.js', 'express', 'python', 'typescript', 'javascript',
    'docker', 'kubernetes', 'postgresql', 'mongodb', 'redis', 'tailwind', 'css',
    'html', 'git', 'aws', 'rest api', 'graphql', 'jwt', 'feynman', 'midjourney',
    'sql', 'vue', 'angular', 'django', 'fastapi', 'flask', 'security', 'owasp',
    'kafka', 'rabbitmq', 'microservices', 'sqlite', 'prisma', 'drizzle', 'ci/cd',
    'webpack', 'vite', 'serverless', 'auth', 'stripe', 'firebase', 'supabase',
    'langchain', 'openai', 'llm', 'embedding', 'vector', 'rag', 'rust', 'go',
    'java', 'spring', 'laravel', 'php', 'swift', 'kotlin', 'flutter', 'android'
  ];
  return techList.filter(t => p.includes(t));
}

function detectComplexity(rawPrompt, verbs, nouns, tech) {
  const p = rawPrompt.toLowerCase();
  if (p.length > 100) return true;
  if (tech.length >= 2) return true;
  if (/\b(fullstack|system|auth|jwt|database|schema|migration|architecture|microservices|distributed|pipeline|production|enterprise|audit|security|integration|multi-tenant|async|concurrent)\b/.test(p)) {
    return true;
  }
  return false;
}

function classifySemanticIntent(verbs, rawPrompt) {
  const p = rawPrompt.toLowerCase();
  if (/\b(debug|fix|error|leak|crash|bug|broken|solve|issue|fail|remediate|not working|broken)\b/.test(p) || verbs.some(v => ['fix', 'debug', 'solve', 'patch', 'resolve'].includes(v))) {
    return 'DEBUG';
  }
  if (/\b(audit|security|inspect|vulnerability|owasp|risk|penetration|pentest|injection|xss|csrf)\b/.test(p)) {
    return 'AUDIT';
  }
  if (/\b(refactor|optimize|clean|rewrite|scale|performance|speed up|improve|restructure|modularize)\b/.test(p) || verbs.some(v => ['refactor', 'optimize', 'clean', 'rewrite'].includes(v))) {
    return 'REFACTOR';
  }
  if (/\b(explain|teach|learn|understand|concept|how does|tutorial|what is|clarify|breakdown)\b/.test(p) || verbs.some(v => ['explain', 'teach', 'learn'].includes(v))) {
    return 'EXPLAIN';
  }
  if (/\b(summarize|notes|cheat sheet|outline|recap|extract|study|digest|tldr|key points)\b/.test(p) || verbs.some(v => ['summarize', 'outline', 'extract'].includes(v))) {
    return 'SUMMARIZE';
  }
  if (/\b(image|logo|illustration|render|photo|midjourney|stable diffusion|dall-e|visual|art|painting|style)\b/.test(p) || verbs.some(v => ['draw', 'render', 'paint', 'illustrate'].includes(v))) {
    return 'VISUAL';
  }
  if (/\b(system|architect|flowchart|diagram|database|schema|api|endpoint|design|blueprint|structure)\b/.test(p)) {
    return 'ARCHITECT';
  }
  return 'BUILD';
}

function synthesizePrecisionPersona(domain, intent, nouns, tech, isHeavyWork) {
  const techStr = tech.length > 0 ? tech.slice(0, 2).map(t => t.charAt(0).toUpperCase() + t.slice(1)).join('/') + ' ' : '';
  const tier = isHeavyWork ? 'Principal Staff-Level ' : 'Senior ';

  const personaMap = {
    DEBUG:    `${tier}${techStr}Debugging Architect specializing in root-cause analysis and production-safe remediation`,
    AUDIT:    `${tier}Cybersecurity Engineer & ${techStr}Security Lead with deep OWASP and threat-modeling expertise`,
    REFACTOR: `${tier}${techStr}Software Architect specializing in clean architecture, SOLID principles, and performance optimization`,
    EXPLAIN:  `Expert Technical Educator with mastery of ${domain.name} — known for transforming complex ideas into crystal-clear mental models`,
    SUMMARIZE:`Senior Knowledge Analyst specializing in distilling dense material into high-signal, actionable insights`,
    VISUAL:   `Master AI Generative Art Director with expertise in prompt engineering for Midjourney, DALL-E, and Stable Diffusion`,
    ARCHITECT:`${tier}Distributed Systems Architect with expertise in scalable design patterns, ${techStr}and system reliability engineering`,
    BUILD:    domain.defaultRole || `${tier}${techStr}${domain.name} Specialist with production-grade delivery standards`
  };

  return personaMap[intent] || domain.defaultRole || `${tier}${domain.name} Expert`;
}

function synthesizeDeliverables(domainId, intent, nouns, tech, isHeavyWork) {
  const deliverables = [];

  if (intent === 'DEBUG') {
    deliverables.push('Root-Cause Diagnosis: Trace the exact failure path — explain WHY it breaks, not just what breaks.');
    deliverables.push('Production-Ready Fix: Fully working code with proper error handling — no half-solutions.');
    deliverables.push('Prevention: Explain how to prevent this class of issue in the future.');
    if (isHeavyWork) deliverables.push('Regression Check: Confirm no adjacent functionality is affected.');
    return deliverables;
  }

  if (intent === 'AUDIT') {
    deliverables.push('Severity Matrix: Rank all issues CRITICAL / HIGH / MEDIUM / LOW with clear impact descriptions.');
    deliverables.push('Executable Patches: Working remediation code for every identified vulnerability.');
    deliverables.push('Standards Alignment: Map findings to OWASP Top 10 or relevant security benchmarks.');
    return deliverables;
  }

  if (intent === 'REFACTOR') {
    deliverables.push('Improved Architecture: Restructured code following SOLID principles and separation of concerns.');
    deliverables.push('Performance Gains: Concrete optimization with measurable improvements stated.');
    deliverables.push('Before vs After: Clearly highlight what changed and why it\'s better.');
    return deliverables;
  }

  if (intent === 'EXPLAIN') {
    deliverables.push('Core Concept: A precise, jargon-free explanation from first principles.');
    deliverables.push('Mental Model: One powerful analogy that makes the concept permanently memorable.');
    deliverables.push('Common Pitfalls: The top 3 misconceptions beginners and intermediate learners have.');
    deliverables.push('Practical Application: One concrete real-world use case or example.');
    return deliverables;
  }

  if (intent === 'SUMMARIZE') {
    deliverables.push('Key Insights: The 5 most important ideas — stated as standalone, actionable sentences.');
    deliverables.push('Active-Recall Questions: 5 questions that test comprehension of the material.');
    deliverables.push('Executive Summary: A 3-sentence TL;DR for someone with no time to read more.');
    return deliverables;
  }

  if (intent === 'VISUAL') {
    deliverables.push('Subject & Composition: Precise description of focal subject, positioning, and scene.');
    deliverables.push('Camera & Lighting: Lens spec (e.g., 85mm f/1.4), lighting style, and color palette.');
    deliverables.push('Platform Flags: Exact model flags (e.g., `--ar 16:9 --v 6.0 --style raw`).');
    return deliverables;
  }

  if (intent === 'ARCHITECT') {
    deliverables.push('System Overview: High-level component diagram described in structured text.');
    deliverables.push('Data Flow: How data moves through the system end-to-end.');
    deliverables.push('API Design: Key endpoints, request/response structure, and auth strategy.');
    if (isHeavyWork) deliverables.push('Failure Handling: How the system handles failures, retries, and scaling pressure.');
    return deliverables;
  }

  // Domain fallbacks
  if (domainId?.startsWith('coding')) {
    deliverables.push('Complete Source Code: Runnable, copy-paste ready — no TODO markers, no omissions.');
    deliverables.push('Production Hygiene: Input sanitization, error handling, environment variable isolation.');
    if (isHeavyWork) deliverables.push('Scalability Notes: Index strategy, concurrency handling, or caching recommendations.');
  } else if (domainId?.startsWith('study')) {
    deliverables.push('Structured Notes: Hierarchical format with bold key terms and clear visual separation.');
    deliverables.push('Self-Test Battery: Minimum 5 active-recall questions covering core concepts.');
  } else if (domainId?.startsWith('writing')) {
    deliverables.push('Draft Output: Polished, complete prose — not an outline unless explicitly requested.');
    deliverables.push('Tone Calibration: Match the specified audience and context throughout.');
  } else if (domainId?.startsWith('business')) {
    deliverables.push('Strategic Recommendations: Prioritized, data-informed, tied to business outcomes.');
    deliverables.push('Executive-Ready Format: Structured for busy decision-makers — lead with the headline.');
  } else {
    deliverables.push('Expert-Grade Output: Immediately usable, high-value content ready for execution.');
    deliverables.push('Structured Format: Clear sections, scannable, no unnecessary padding.');
  }

  return deliverables;
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
