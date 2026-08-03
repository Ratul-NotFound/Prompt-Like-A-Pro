/**
 * Prompt Like A Pro — Heuristic Prompt Enhancer Engine
 * Formats, enriches, and structures raw user prompts using established
 * Prompt Engineering Frameworks (CO-STAR, RTF, Few-Shot, Chain-of-Thought).
 */

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

  // Length Check
  if (text.length > 150) {
    score += 30;
    checks.push('Detailed Context provided');
  } else if (text.length > 50) {
    score += 15;
    checks.push('Basic context provided');
  }

  // Key verb checks
  const verbs = ['build', 'create', 'write', 'explain', 'analyze', 'audit', 'summarize', 'refactor', 'design', 'generate'];
  const hasVerb = verbs.some(v => text.toLowerCase().includes(v));
  if (hasVerb) {
    score += 20;
    checks.push('Clear action verbs');
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

  const cleanRaw = rawPrompt.trim();
  const additions = [];  // 1. Role & Objective Priming
  const role = settings.role || domain.defaultRole || 'Expert Specialist';
  const contextText = settings.context ? ` Context: ${settings.context}` : '';
  const objectiveSection = `**Role:** Act as a ${role}.${contextText}

**Task Objective:**
> "${cleanRaw}"`;
  additions.push({ tag: 'Role & Objective', text: objectiveSection });

  // 2. Directives & Output Format
  const tone = settings.tone || domain.frameworkDefaults.tone;
  const format = settings.format || domain.frameworkDefaults.format;
  const styleSection = `**Directives:**
- **Tone:** ${tone}
- **Output Format:** ${format} (Clean, structured Markdown)`;
  additions.push({ tag: 'Style & Format', text: styleSection });

  // 3. Constraints
  const domainConstraints = getDomainConstraints(domain.id);
  const constraintSection = `**Constraints:**
${domainConstraints.map(c => `- ${c}`).join('\n')}`;
  // Combine into Dense Master Prompt
  const enhancedText = `${objectiveSection}\n\n${styleSection}\n\n${constraintSection}`;

  const variables = extractVariables(enhancedText);

  return {
    enhancedText,
    additions,
    variables,
    tokenCount: estimateTokens(enhancedText),
    rawTokenCount: estimateTokens(cleanRaw)
  };
}

function getDomainConstraints(domainId) {
  switch (domainId) {
    case 'coding-ui':
      return [
        'Do not use inline styles or generic plain colors; use curated dark mode palettes, smooth transitions, and proper padding.',
        'Ensure the UI code is fully responsive and accessible (a11y standards).',
        'Avoid placeholder functions like `// do something here`; write functional, runnable code logic.'
      ];
    case 'coding-backend':
      return [
        'Include robust error handling, status code responses, and sanitization for all input parameters.',
        'Provide database schema migration code and index recommendations for high-concurrency workloads.',
        'Follow SOLID principles and avoid hardcoded secrets or magic numbers.'
      ];
    case 'coding-security':
      return [
        'Categorize all identified risks by severity (CRITICAL, HIGH, MEDIUM, LOW).',
        'Provide concrete, runnable remediation code patches rather than vague advice.',
        'Check for OWASP Top 10 risks including injection, broken auth, and exposed secrets.'
      ];
    case 'coding-debug':
      return [
        'Clearly state the ROOT CAUSE of the bug before offering code solutions.',
        'Show a clear Before vs. After code comparison.',
        'Ensure the fix does not introduce side-effects or regressions.'
      ];
    case 'study-feynman':
      return [
        'Avoid unnecessary academic jargon; define any complex technical terms upon first use.',
        'Use relatable everyday analogies to anchor conceptual understanding.',
        'Include a "Common Misconceptions" section to address frequent pitfalls.'
      ];
    case 'study-notes':
      return [
        'Organize notes into clear hierarchical sections with bold key terms.',
        'Provide at least 5 active-recall questions at the end to test comprehension.',
        'Keep summaries tight, punchy, and actionable.'
      ];
    case 'study-research':
      return [
        'Critique both the strengths and methodology limitations of the study objectively.',
        'Extract exact empirical data points, sample sizes, and statistical confidence if mentioned.',
        'Maintain a scholarly, neutral academic tone.'
      ];
    case 'writing-seo':
      return [
        'Avoid cliché AI opener intros like "In today\'s fast-paced digital world...".',
        'Use engaging hooks, bulleted lists, and clear bold emphasis to maximize readability.',
        'Integrate primary and secondary search keywords naturally without keyword stuffing.'
      ];
    case 'writing-social':
      return [
        'Format with clean line breaks and emojis for effortless mobile scanning.',
        'Include a high-impact opening hook in the first 2 lines.',
        'End with a clear, single Call-To-Action (CTA) question to spark engagement.'
      ];
    case 'visual-image':
      return [
        'Include explicit details for subject, lighting (e.g., volumetric cinematic glow), lens (e.g., 85mm f/1.4), and mood.',
        'Specify exact model parameter flags at the end (e.g., `--ar 16:9 --v 6.0 --style raw`).',
        'Avoid contradictory descriptor terms.'
      ];
    case 'system-prompt':
      return [
        'Establish unambiguous boundaries; specify exactly what the assistant MUST and MUST NOT do.',
        'Define fallback instructions for out-of-scope user requests.',
        'Format rules as numbered imperative directives.'
      ];
    default:
      return [
        'Avoid generic or vague advice; provide specific, actionable outputs.',
        'Structure the response logically with clear Markdown headings.',
        'Maintain high accuracy and precision.'
      ];
  }
}
