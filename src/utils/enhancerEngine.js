/**
 * Prompt Like A Pro — Smart Heavy-Duty Local AI Engine powered by Compromise NLP
 * Performs syntactic parsing, POS tagging, noun/verb/topic extraction, complexity analysis,
 * technology ontology mapping, Chain-of-Thought injection, and multi-stage enterprise prompt synthesis.
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
    checks.push('Detailed Context provided');
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
    checks.push('Constraints or Formats specified');
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

  return {
    score,
    level,
    feedback,
    checks
  };
}

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

  // Run Compromise NLP Parser
  const doc = nlp(rawPrompt);
  const verbs = doc.verbs().out('array').map(v => v.toLowerCase());
  const nouns = doc.nouns().out('array').map(n => n.toLowerCase());
  const detectedTech = detectTechStack(rawPrompt);
  const isHeavyWork = detectComplexity(rawPrompt, verbs, nouns, detectedTech);

  // Classify Semantic Intent
  const intent = classifySemanticIntent(verbs, rawPrompt);

  // Synthesize Dynamic Role / Persona
  const role = settings.role || synthesizePersona(domain, intent, nouns, detectedTech, isHeavyWork);

  // Synthesize Context-Aware Objective
  const objective = synthesizeObjective(rawPrompt, intent, nouns, detectedTech, isHeavyWork);

  // Synthesize Tailored Deliverables
  const requirements = synthesizeDeliverables(domain.id, intent, nouns, detectedTech, isHeavyWork);

  // Synthesize Guardrails
  const constraints = synthesizeGuardrails(domain.id, intent);

  // Directives
  const tone = settings.tone || domain.frameworkDefaults.tone;
  const format = settings.format || domain.frameworkDefaults.format;

  // Chain-of-Thought (CoT) Section for heavy tasks
  const cotSection = isHeavyWork
    ? `\n\n### 🧠 REASONING PROCESS & ARCHITECTURAL ANALYSIS
Before producing the final deliverables, analyze the problem step-by-step:
1. Deconstruct core requirements and boundary constraints.
2. Evaluate potential failure modes, race conditions, or edge cases.
3. Formulate an optimal, production-grade strategy under a '### 💡 Reasoning' section.`
    : '';

  const additions = [
    { tag: 'NLP Role Synthesizer', text: `**Role:** Act as a ${role}.` },
    { tag: 'NLP Objective Extractor', text: `**Objective:** ${objective}` },
    { tag: 'Smart Directives', text: `**Tone:** ${tone}\n**Format:** ${format}` },
    { tag: 'Tailored Deliverables', text: requirements.map(r => `- ${r}`).join('\n') },
    { tag: 'Guardrails', text: constraints.map(c => `- ${c}`).join('\n') }
  ];

  if (isHeavyWork) {
    additions.push({ tag: 'Chain-of-Thought', text: 'Step-by-step reasoning & architecture analysis enabled for complex task.' });
  }

  // Construct Master Heavy-Duty Engineered Prompt
  const enhancedText = `### 🎯 IDENTITY & ROLE
Act as a ${role}. You possess deep, production-grade domain expertise, adhere to industry-leading standards, and deliver authoritative, highly optimized outputs.

### 📌 TASK OBJECTIVE
${objective}

> Raw Input: "${rawPrompt.trim()}"${detectedTech.length > 0 ? `\nTarget Technologies: ${detectedTech.join(', ')}` : ''}${isHeavyWork ? '\nWorkload Tier: Heavy / Enterprise Complexity' : ''}${cotSection}

### 📋 KEY DELIVERABLES & REQUIREMENTS
${requirements.map(r => `- ${r}`).join('\n')}

### 🎨 STYLE & FORMAT DIRECTIVES
- **Tone & Approach:** ${tone} (Direct, authoritative, structured, and fluff-free)
- **Output Format:** ${format} using clean Markdown headers, structured bullet points, and syntax-highlighted code where applicable.

### 🛡️ GUARDRAILS & QUALITY CONSTRAINTS
${constraints.map(c => `- ${c}`).join('\n')}`;

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
// HEURISTIC NLP ONTOLOGY & COMPLEXITY ENGINES
// ============================================================================

function detectTechStack(prompt) {
  const p = prompt.toLowerCase();
  const techList = [
    'react', 'next.js', 'node.js', 'express', 'python', 'typescript', 'javascript',
    'docker', 'kubernetes', 'postgresql', 'mongodb', 'redis', 'tailwind', 'css',
    'html', 'git', 'aws', 'rest api', 'graphql', 'jwt', 'feynman', 'midjourney',
    'sql', 'vue', 'angular', 'django', 'fastapi', 'flask', 'security', 'owasp',
    'kafka', 'rabbitmq', 'microservices', 'sqlite', 'prisma', 'drizzle', 'ci/cd',
    'webpack', 'vite', 'serverless', 'auth', 'stripe', 'firebase', 'supabase'
  ];
  return techList.filter(t => p.includes(t));
}

function detectComplexity(rawPrompt, verbs, nouns, tech) {
  const p = rawPrompt.toLowerCase();
  if (p.length > 100) return true;
  if (tech.length >= 2) return true;
  if (/\b(fullstack|system|auth|jwt|database|schema|migration|architecture|microservices|distributed|pipeline|production|enterprise|audit|security)\b/.test(p)) {
    return true;
  }
  return false;
}

function classifySemanticIntent(verbs, rawPrompt) {
  const p = rawPrompt.toLowerCase();
  if (/\b(debug|fix|error|leak|crash|bug|broken|solve|issue|fail|remediate)\b/.test(p) || verbs.some(v => ['fix', 'debug', 'solve', 'patch'].includes(v))) {
    return 'DEBUG';
  }
  if (/\b(audit|security|inspect|check|review|vulnerability|owasp|risk)\b/.test(p) || verbs.some(v => ['audit', 'inspect', 'review', 'check'].includes(v))) {
    return 'AUDIT';
  }
  if (/\b(refactor|optimize|clean|rewrite|scale|performance|speed up)\b/.test(p) || verbs.some(v => ['refactor', 'optimize', 'clean', 'rewrite'].includes(v))) {
    return 'REFACTOR';
  }
  if (/\b(explain|teach|learn|understand|feynman|concept|how does|tutorial)\b/.test(p) || verbs.some(v => ['explain', 'teach', 'learn'].includes(v))) {
    return 'EXPLAIN';
  }
  if (/\b(summarize|notes|cheat sheet|outline|recap|extract|study)\b/.test(p) || verbs.some(v => ['summarize', 'outline', 'extract'].includes(v))) {
    return 'SUMMARIZE';
  }
  if (/\b(image|logo|illustration|render|photo|midjourney|prompt|visual)\b/.test(p) || verbs.some(v => ['draw', 'render', 'design'].includes(v))) {
    return 'VISUAL';
  }
  if (/\b(system|architect|flowchart|db|database|schema|api|endpoint)\b/.test(p)) {
    return 'ARCHITECT';
  }
  return 'BUILD';
}

function synthesizePersona(domain, intent, nouns, tech, isHeavyWork) {
  const techLead = tech.length > 0 ? tech.map(t => t.toUpperCase()).join('/') + ' ' : '';
  const mainNoun = nouns.length > 0 ? capitalize(nouns[0]) + ' ' : '';
  const tier = isHeavyWork ? 'Principal Staff ' : 'Senior ';

  switch (intent) {
    case 'DEBUG':
      return `${tier}${techLead}${mainNoun}Debugging Architect & Root-Cause Specialist`;
    case 'AUDIT':
      return `${tier}Cybersecurity Auditor & ${techLead}Security Lead`;
    case 'REFACTOR':
      return `${tier}${techLead}Code Quality & Enterprise Refactoring Architect`;
    case 'EXPLAIN':
      return `Distinguished Technical Educator & ${domain.name} Master`;
    case 'SUMMARIZE':
      return `Senior Research Analyst & Knowledge Synthesis Specialist`;
    case 'VISUAL':
      return `Master Prompt Engineer & AI Generative Art Director`;
    case 'ARCHITECT':
      return `${tier}Distributed Systems Architect & ${techLead}Lead`;
    default:
      return domain.defaultRole || `${tier}${techLead}${domain.name} Specialist`;
  }
}

function synthesizeObjective(rawPrompt, intent, nouns, tech, isHeavyWork) {
  const techText = tech.length > 0 ? ` leveraging ${tech.join(', ')}` : '';
  const cleanPrompt = rawPrompt.replace(/^(can you|please|help me|i want to|i need to|write a|create a|generate a)\s+/i, '');
  const scopeText = isHeavyWork ? ' Design and implement an enterprise-grade solution for' : ' Provide a robust solution for';

  switch (intent) {
    case 'DEBUG':
      return `Perform a comprehensive root-cause diagnosis and provide a production-ready fix for:${scopeText} "${cleanPrompt}"${techText}. Include placeholder {{error_logs}} and {{expected_behavior}} if applicable.`;
    case 'AUDIT':
      return `Perform an end-to-end security and quality audit for:${scopeText} "${cleanPrompt}"${techText}. Assess vulnerabilities and provide remediation code.`;
    case 'REFACTOR':
      return `Refactor and optimize the architecture, memory footprint, and readability for:${scopeText} "${cleanPrompt}"${techText}.`;
    case 'EXPLAIN':
      return `Break down the underlying mechanics, mathematical/logical foundations, and mental models for: "${cleanPrompt}".`;
    case 'SUMMARIZE':
      return `Synthesize and structure the key actionable takeaways, active-recall questions, and executive notes for: "${cleanPrompt}".`;
    case 'VISUAL':
      return `Engineer a high-precision generative visual prompt with composition, lighting, camera lens, and mood flags for: "${cleanPrompt}".`;
    case 'ARCHITECT':
      return `Design a scalable, resilient system architecture, database schema, and API flow for:${scopeText} "${cleanPrompt}"${techText}.`;
    default:
      return `Engineer a high-performance, production-grade solution for:${scopeText} "${cleanPrompt}"${techText}.`;
  }
}

function synthesizeDeliverables(domainId, intent, nouns, tech, isHeavyWork) {
  const deliverables = [];

  if (intent === 'DEBUG') {
    deliverables.push('Root-Cause Diagnosis: Trace the exact failure vector and explain why the issue occurs before modifying code.');
    deliverables.push('Production-Ready Fix: Provide fully functional, bug-free code with explicit try/catch error handling and sanitization.');
    deliverables.push('Verification Protocol: Supply precise test commands or profiling steps to confirm the bug is resolved.');
    if (isHeavyWork) deliverables.push('Regression Analysis: Ensure changes introduce zero side-effects on adjacent dependencies.');
    return deliverables;
  }

  if (intent === 'AUDIT') {
    deliverables.push('Severity Matrix: Categorize all identified risks by severity (CRITICAL, HIGH, MEDIUM, LOW).');
    deliverables.push('Remediation Patches: Provide executable code patches for every vulnerability identified.');
    deliverables.push('OWASP & Standards Alignment: Cross-reference findings against industry security benchmarks.');
    if (isHeavyWork) deliverables.push('Attack Vector Analysis: Explain how an adversary could exploit each flaw.');
    return deliverables;
  }

  if (intent === 'REFACTOR') {
    deliverables.push('SOLID Architecture: Decompose monolithic functions into modular, loosely-coupled components.');
    deliverables.push('Performance Optimization: Minimize algorithmic complexity, memory allocations, and unneeded re-renders.');
    deliverables.push('Before vs After Comparison: Highlight structural and maintainability improvements clearly.');
    return deliverables;
  }

  if (intent === 'EXPLAIN') {
    deliverables.push('Plain-Language Breakdown: Explain concepts clearly without unnecessary academic jargon.');
    deliverables.push('Intuitive Mental Model: Use a relatable everyday analogy to ground technical understanding.');
    deliverables.push('Common Misconceptions: Highlight the top 3 pitfalls learners encounter.');
    return deliverables;
  }

  if (intent === 'VISUAL') {
    deliverables.push('Subject & Composition: Detail focal subject, spatial positioning, framing, and environment.');
    deliverables.push('Camera & Lighting: Specify lens specs (e.g. 85mm f/1.4), volumetric lighting, and color grading.');
    deliverables.push('Model Parameter Flags: Append exact generator flags (e.g. `--ar 16:9 --v 6.0 --style raw`).');
    return deliverables;
  }

  // Domain Fallback
  if (domainId.startsWith('coding')) {
    deliverables.push('Runnable Source Code: Provide clean, copy-paste ready code without unwritten placeholders or `// TODO` comments.');
    deliverables.push('Production Hygiene: Include sanitization, type-safety, status codes, and environment variable isolation.');
    if (isHeavyWork) deliverables.push('Scalability & Schema: Include database index recommendations or concurrency handling rules.');
  } else if (domainId.startsWith('study')) {
    deliverables.push('Structured Notes: Format with clear hierarchy, bold key terms, and executive summary bullet points.');
    deliverables.push('Self-Test Questions: Include at least 5 active-recall questions to test comprehension.');
  } else {
    deliverables.push('Actionable Deliverables: Provide immediate, high-value outputs ready for execution.');
    deliverables.push('Structured Layout: Organize output logically with clean Markdown headers.');
  }

  return deliverables;
}

function synthesizeGuardrails(domainId, intent) {
  const guardrails = [
    'Avoid conversational filler, fluff, or generic introductory phrases.',
    'Deliver concrete, high-leverage outputs ready for instant execution.'
  ];

  if (intent === 'DEBUG' || intent === 'REFACTOR') {
    guardrails.push('Avoid band-aid workarounds; resolve issues at the architectural root level.');
    guardrails.push('Ensure changes introduce zero regressions or unintended side-effects.');
  } else if (domainId.startsWith('coding')) {
    guardrails.push('Do not output incomplete placeholder code like `// TODO: implement later`.');
  } else if (domainId.startsWith('writing')) {
    guardrails.push('Avoid cliché AI openers like "In today\'s fast-paced digital world...".');
  }

  return guardrails;
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
