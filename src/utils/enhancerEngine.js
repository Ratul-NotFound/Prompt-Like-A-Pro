/**
 * Prompt Like A Pro — Smart Local AI Engine powered by Compromise NLP
 * Performs real syntactic analysis, POS tagging, noun/verb/topic extraction,
 * and semantic prompt synthesis locally in JavaScript without external API calls!
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
  const nouns = doc.nouns().out('array');

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

  // Classify Semantic Intent
  const intent = classifySemanticIntent(verbs, rawPrompt);

  // Synthesize Dynamic Role / Persona
  const role = settings.role || synthesizePersona(domain, intent, nouns, detectedTech);

  // Synthesize Context-Aware Objective
  const objective = synthesizeObjective(rawPrompt, intent, nouns, detectedTech);

  // Synthesize Tailored Deliverables
  const requirements = synthesizeDeliverables(domain.id, intent, nouns, detectedTech);

  // Synthesize Guardrails
  const constraints = synthesizeGuardrails(domain.id, intent);

  // Directives
  const tone = settings.tone || domain.frameworkDefaults.tone;
  const format = settings.format || domain.frameworkDefaults.format;

  const additions = [
    { tag: 'NLP Role Synthesizer', text: `**Role:** Act as a ${role}.` },
    { tag: 'NLP Objective Extractor', text: `**Objective:** ${objective}` },
    { tag: 'Smart Directives', text: `**Tone:** ${tone}\n**Format:** ${format}` },
    { tag: 'Tailored Deliverables', text: requirements.map(r => `- ${r}`).join('\n') },
    { tag: 'Domain Guardrails', text: constraints.map(c => `- ${c}`).join('\n') }
  ];

  // Construct Master Engineered Prompt
  const enhancedText = `### 🎯 IDENTITY & ROLE
Act as a ${role}. You possess deep domain expertise, follow production-grade best practices, and deliver authoritative, rigorous outputs.

### 📌 TASK OBJECTIVE
${objective}

> Raw Context: "${rawPrompt.trim()}"${detectedTech.length > 0 ? `\nTarget Tech Stack: ${detectedTech.join(', ')}` : ''}

### 📋 KEY DELIVERABLES & REQUIREMENTS
${requirements.map(r => `- ${r}`).join('\n')}

### 🎨 STYLE & FORMAT DIRECTIVES
- **Tone & Approach:** ${tone} (Direct, structured, free of fluff)
- **Output Format:** ${format} with clean Markdown headers and syntax-highlighted code blocks where appropriate.

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
// NLP INTENT & SEMANTIC SYNTHESIS ENGINES
// ============================================================================

function detectTechStack(prompt) {
  const p = prompt.toLowerCase();
  const techList = [
    'react', 'next.js', 'node.js', 'express', 'python', 'typescript', 'javascript',
    'docker', 'kubernetes', 'postgresql', 'mongodb', 'redis', 'tailwind', 'css',
    'html', 'git', 'aws', 'rest api', 'graphql', 'jwt', 'feynman', 'midjourney',
    'sql', 'vue', 'angular', 'django', 'fastapi', 'flask', 'security', 'owasp'
  ];
  return techList.filter(t => p.includes(t));
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

function synthesizePersona(domain, intent, nouns, tech) {
  const techLead = tech.length > 0 ? tech.map(t => t.toUpperCase()).join('/') + ' ' : '';
  const mainNoun = nouns.length > 0 ? capitalize(nouns[0]) + ' ' : '';

  switch (intent) {
    case 'DEBUG':
      return `Staff ${techLead}${mainNoun}Debugging Specialist & Root-Cause Analyst`;
    case 'AUDIT':
      return `Principal Cybersecurity Auditor & ${techLead}Security Lead`;
    case 'REFACTOR':
      return `Staff ${techLead}Code Quality & Refactoring Architect`;
    case 'EXPLAIN':
      return `Distinguished Technical Educator & ${domain.name} Master`;
    case 'SUMMARIZE':
      return `Senior Research Analyst & Knowledge Synthesis Expert`;
    case 'VISUAL':
      return `Master Prompt Engineer & AI Generative Art Director`;
    case 'ARCHITECT':
      return `Principal Distributed Systems Architect & ${techLead}Engineer`;
    default:
      return domain.defaultRole || `Senior ${techLead}${domain.name} Specialist`;
  }
}

function synthesizeObjective(rawPrompt, intent, nouns, tech) {
  const techText = tech.length > 0 ? ` using ${tech.join(', ')}` : '';
  const cleanPrompt = rawPrompt.replace(/^(can you|please|help me|i want to|i need to|write a|create a|generate a)\s+/i, '');

  switch (intent) {
    case 'DEBUG':
      return `Identify the root cause of the issue and provide a production-ready fix for: "${cleanPrompt}"${techText}.`;
    case 'AUDIT':
      return `Perform a comprehensive quality and security vulnerability audit for: "${cleanPrompt}"${techText}.`;
    case 'REFACTOR':
      return `Refactor and optimize the architecture, performance, and readability for: "${cleanPrompt}"${techText}.`;
    case 'EXPLAIN':
      return `Explain the underlying mechanics and core principles in simple, intuitive terms for: "${cleanPrompt}".`;
    case 'SUMMARIZE':
      return `Extract, synthesize, and structure the key actionable takeaways and active-recall notes for: "${cleanPrompt}".`;
    case 'VISUAL':
      return `Generate a detailed visual prompt with lighting, framing, lens, and mood parameters for: "${cleanPrompt}".`;
    case 'ARCHITECT':
      return `Design a scalable, resilient system architecture and schema migration plan for: "${cleanPrompt}"${techText}.`;
    default:
      return `Engineer a high-performance, production-ready solution for: "${cleanPrompt}"${techText}.`;
  }
}

function synthesizeDeliverables(domainId, intent, nouns, tech) {
  const deliverables = [];

  if (intent === 'DEBUG') {
    deliverables.push('Root-Cause Diagnosis: Clearly state why the failure occurs before offering code modifications.');
    deliverables.push('Production-Ready Fix: Provide fully functional, bug-free code with explicit error handling.');
    deliverables.push('Verification Steps: Outline precise commands/tests to verify the resolution.');
    return deliverables;
  }

  if (intent === 'AUDIT') {
    deliverables.push('Risk Rating: Grade all identified risks by severity (CRITICAL, HIGH, MEDIUM, LOW).');
    deliverables.push('Remediation Patches: Provide executable code patches for every vulnerability found.');
    deliverables.push('Compliance Check: Align findings with OWASP Top 10 and security best practices.');
    return deliverables;
  }

  if (intent === 'REFACTOR') {
    deliverables.push('SOLID Architecture: Decompose monolithic functions into modular, clean components.');
    deliverables.push('Performance Optimization: Minimize algorithmic complexity and unnecessary object allocations.');
    deliverables.push('Before vs After Comparison: Highlight structural improvements clearly.');
    return deliverables;
  }

  if (intent === 'EXPLAIN') {
    deliverables.push('Plain-Language Breakdown: Explain concepts clearly without academic jargon.');
    deliverables.push('Intuitive Mental Model: Use an everyday analogy to ground the explanation.');
    deliverables.push('Top 3 Misconceptions: Highlight common pitfalls learners encounter.');
    return deliverables;
  }

  if (intent === 'VISUAL') {
    deliverables.push('Subject & Composition: Detail focal subject, spatial positioning, and atmosphere.');
    deliverables.push('Camera & Lighting: Specify lens specs (e.g. 85mm f/1.4), volumetric lighting, and color grading.');
    deliverables.push('Model Parameters: Append generator flags (e.g. `--ar 16:9 --v 6.0 --style raw`).');
    return deliverables;
  }

  // Domain Fallback
  if (domainId.startsWith('coding')) {
    deliverables.push('Runnable Source Code: Provide functional, copy-paste ready code without unwritten placeholders.');
    deliverables.push('Production Hygiene: Include sanitization, type-safety, and environment isolation.');
  } else if (domainId.startsWith('study')) {
    deliverables.push('Structured Notes: Format with clear hierarchy, bold terms, and summary bullet points.');
    deliverables.push('Self-Test Questions: Include at least 3 active-recall questions to test comprehension.');
  } else {
    deliverables.push('Actionable Deliverables: Provide immediate, high-value outputs ready for execution.');
    deliverables.push('Structured Formatting: Use clean Markdown headers and organized bullet points.');
  }

  return deliverables;
}

function synthesizeGuardrails(domainId, intent) {
  const guardrails = [
    'Avoid conversational filler, fluff, or generic introductory phrases.',
    'Deliver concrete, high-leverage outputs ready for instant execution.'
  ];

  if (intent === 'DEBUG' || intent === 'REFACTOR') {
    guardrails.push('Avoid band-aid fixes; resolve issues at the architectural root level.');
    guardrails.push('Ensure changes introduce zero regressions or side-effects.');
  } else if (domainId.startsWith('coding')) {
    guardrails.push('Do not output incomplete placeholder functions like `// TODO: implement later`.');
  } else if (domainId.startsWith('writing')) {
    guardrails.push('Avoid cliché AI openers like "In today\'s fast-paced digital world...".');
  }

  return guardrails;
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
