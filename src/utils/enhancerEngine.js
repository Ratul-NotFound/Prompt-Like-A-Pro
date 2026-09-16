/**
 * Prompt Like A Pro — Deep Intent Analysis & Precision Prompt Synthesis Engine
 *
 * ════════════════════════════════════════════════════════════════════════
 * LOCAL OFFLINE ENGINE — No API tokens consumed
 * ════════════════════════════════════════════════════════════════════════
 * This engine runs entirely in the browser with zero API calls.
 * It performs genuine semantic analysis using Compromise NLP +
 * a 12-intent classification system + 6-archetype detection to
 * synthesize precision prompts as a fallback when the AI API is unavailable.
 *
 * Upgrade Summary vs previous version:
 *   - Intent classes: 8 → 12 (added WRITE, ANALYZE, COMPARE, PLAN)
 *   - Scoring dimensions: 3 → 8 (real quality signal)
 *   - Added: Prompt Archetype detection (6 types)
 *   - Added: Need-Gap analysis (deeper goal inference)
 *   - Added: Cognitive Frame, Success Criteria, Failure Guardrails sections
 *   - Persona synthesis: much richer, domain + tech + intent driven
 */

import nlp from 'compromise';

// ============================================================================
// VARIABLE EXTRACTION
// ============================================================================

export function extractVariables(text) {
  if (!text) return [];
  const doubleCurlyRegex = /\{\{([^}]+)\}\}/g;
  const squareBracketRegex = /\[([A-Z0-9_\s-]+)\]/g;
  const vars = new Set();
  let match;
  while ((match = doubleCurlyRegex.exec(text)) !== null) vars.add(match[1].trim());
  while ((match = squareBracketRegex.exec(text)) !== null) {
    const val = match[1].trim();
    if (val.length > 1 && !/^\d+$/.test(val) && val.toLowerCase() !== 'x') vars.add(val);
  }
  return Array.from(vars);
}

export function estimateTokens(text) {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

// ============================================================================
// PROMPT STRENGTH EVALUATOR — 8-Dimension Scoring
// ============================================================================

export function evaluatePromptStrength(text) {
  if (!text || !text.trim()) {
    return { score: 0, level: 'Empty', feedback: 'Enter some text to evaluate.', checks: [] };
  }

  let score = 0;
  const checks = [];
  const p = text.toLowerCase();
  const doc = nlp(text);
  const verbs = doc.verbs().out('array');

  // ── Dimension 1: Specificity (length & detail) ────────────────────────────
  if (text.length > 200) {
    score += 16; checks.push('Rich context provided');
  } else if (text.length > 80) {
    score += 9; checks.push('Basic context provided');
  }

  // ── Dimension 2: Action clarity (strong verbs) ────────────────────────────
  const actionVerbs = ['build', 'create', 'write', 'explain', 'analyze', 'debug', 'refactor',
    'design', 'generate', 'fix', 'optimize', 'review', 'summarize', 'compare', 'plan'];
  const hasStrongVerb = verbs.some(v => actionVerbs.includes(v.toLowerCase())) ||
    actionVerbs.some(v => p.includes(v));
  if (hasStrongVerb) { score += 12; checks.push('Clear action directive'); }
  else if (verbs.length > 0) { score += 6; checks.push('Has action verbs'); }

  // ── Dimension 3: Constraints / Negative rules ─────────────────────────────
  const hasConstraint = /\b(not|avoid|don't|except|only|no\s+\w|without|exclude|never|must not)\b/.test(p);
  if (hasConstraint) { score += 13; checks.push('Constraints defined'); }

  // ── Dimension 4: Format specification ────────────────────────────────────
  const hasFormat = /\b(markdown|json|table|list|bullet|numbered|code block|paragraph|short|brief|detailed|step.by.step|outline|summary)\b/.test(p);
  if (hasFormat) { score += 12; checks.push('Output format specified'); }

  // ── Dimension 5: Audience / Context signal ────────────────────────────────
  const hasAudience = /\b(for|audience|beginner|expert|senior|junior|client|team|student|user|developer|manager|non.tech)\b/.test(p);
  if (hasAudience) { score += 11; checks.push('Audience identified'); }

  // ── Dimension 6: Persona / Role signal ────────────────────────────────────
  const hasPersona = /\b(act as|you are|as a|role of|expert|specialist|professional|senior|principal)\b/.test(p);
  if (hasPersona) { score += 12; checks.push('Persona assigned'); }

  // ── Dimension 7: Variable placeholders ───────────────────────────────────
  const hasVariables = /\{\{/.test(text) || /\[[A-Z_]{2,}\]/.test(text);
  if (hasVariables) { score += 12; checks.push('Uses variable placeholders'); }

  // ── Dimension 8: Goal alignment / success criterion ───────────────────────
  const hasGoal = /\b(goal|objective|outcome|result|so that|in order to|achieve|accomplish|purpose|end result)\b/.test(p);
  if (hasGoal) { score += 12; checks.push('Goal / success criterion stated'); }

  score = Math.min(100, score);

  let level, feedback;
  if (score >= 78) {
    level = 'Pro / Elite';
    feedback = 'Excellent. This prompt has specificity, action, constraints, and format.';
  } else if (score >= 50) {
    level = 'Advanced';
    feedback = 'Good. Add a persona, audience, or output format to reach elite level.';
  } else if (score >= 25) {
    level = 'Intermediate';
    feedback = 'Needs constraints, format spec, or audience clarity to be effective.';
  } else {
    level = 'Basic';
    feedback = 'Very vague. Add context, a role, constraints, and the desired output format.';
  }

  return { score, level, feedback, checks };
}

// ============================================================================
// MAIN ENGINE — DEEP INTENT-FIRST PROMPT SYNTHESIS
// ============================================================================

export function enhancePrompt(rawPrompt, domain, settings = {}) {
  if (!rawPrompt || !rawPrompt.trim()) {
    return { enhancedText: '', additions: [], variables: [], tokenCount: 0, rawTokenCount: 0 };
  }

  // ─── PHASE 1: Deep NLP Analysis ────────────────────────────────────────────
  const doc = nlp(rawPrompt);
  const verbs      = doc.verbs().out('array').map(v => v.toLowerCase());
  const nouns      = doc.nouns().out('array').map(n => n.toLowerCase());
  const adjectives = doc.adjectives().out('array').map(a => a.toLowerCase());
  const detectedTech = detectTechStack(rawPrompt);
  const isHeavyWork  = detectComplexity(rawPrompt, verbs, nouns, detectedTech);

  // ─── PHASE 2: Intent & Archetype Classification ────────────────────────────
  const intent    = classifySemanticIntent(verbs, rawPrompt);
  const archetype = detectPromptArchetype(rawPrompt, intent, verbs);

  // ─── PHASE 3: Deep Goal & Need-Gap Inference ───────────────────────────────
  const inferredGoal     = inferUserGoal(rawPrompt, intent, nouns, domain);
  const needGapAnalysis  = inferNeedGap(rawPrompt, intent, domain);
  const inferredAudience = inferAudience(rawPrompt, domain, intent);
  const inferredContext  = inferContext(rawPrompt, domain, detectedTech, isHeavyWork);
  const smartConstraints = inferSmartConstraints(rawPrompt, domain, intent, detectedTech);

  // ─── PHASE 4: Precision Persona + Deliverables ────────────────────────────
  const role        = settings.role || synthesizePrecisionPersona(domain, intent, nouns, detectedTech, isHeavyWork);
  const deliverables = synthesizeDeliverables(domain.id, intent, nouns, detectedTech, isHeavyWork);
  const cognitiveFrame = buildCognitiveFrame(intent, archetype, domain);
  const successCriteria = buildSuccessCriteria(intent, domain, detectedTech);
  const failureGuardrails = buildFailureGuardrails(intent, detectedTech, rawPrompt);
  const outputTrigger = buildOutputTrigger(intent, isHeavyWork);

  // ─── PHASE 5: Style & Format ──────────────────────────────────────────────
  const tone   = settings.tone   || domain.frameworkDefaults?.tone   || 'Expert, authoritative, precise';
  const format = settings.format || domain.frameworkDefaults?.format || 'Structured Markdown';

  // ─── PHASE 6: Context Boosters ────────────────────────────────────────────
  const contextBoosters = buildContextBoosters(rawPrompt, domain, intent, detectedTech, adjectives);

  // ─── Build additions for Diff view ────────────────────────────────────────
  const additions = [
    { tag: 'Intent Classified',   text: `${intent} (${archetype} archetype)` },
    { tag: 'Real Goal Inferred',  text: inferredGoal },
    { tag: 'Need Gap Diagnosed',  text: needGapAnalysis },
    { tag: 'Audience Identified', text: inferredAudience },
    { tag: 'Precision Persona',   text: `Act as: ${role}` },
    { tag: 'Smart Constraints',   text: smartConstraints.map(c => `- ${c}`).join('\n') },
    { tag: 'Deliverables',        text: deliverables.map(d => `- ${d}`).join('\n') },
    { tag: 'Success Criteria',    text: successCriteria.map(s => `✓ ${s}`).join('\n') },
    { tag: 'Failure Guardrails',  text: failureGuardrails.map(f => `✗ ${f}`).join('\n') },
  ];

  if (isHeavyWork) additions.push({ tag: 'Chain-of-Thought', text: 'Step-by-step reasoning & architecture analysis activated for complex task.' });
  if (contextBoosters.length > 0) additions.push({ tag: 'Context Boosters', text: contextBoosters.map(b => `+ ${b}`).join('\n') });

  // ─── Build final precision prompt ─────────────────────────────────────────
  const enhancedText = buildPrecisionPrompt({
    role, inferredGoal, needGapAnalysis, rawPrompt, inferredAudience, inferredContext,
    smartConstraints, deliverables, cognitiveFrame, successCriteria, failureGuardrails,
    contextBoosters, tone, format, isHeavyWork, detectedTech, outputTrigger, archetype
  });

  const variables = extractVariables(enhancedText);

  return {
    enhancedText,
    additions,
    variables,
    intent,
    archetype,
    tokenCount: estimateTokens(enhancedText),
    rawTokenCount: estimateTokens(rawPrompt)
  };
}

// ============================================================================
// INTENT CLASSIFICATION — 12 Classes
// ============================================================================

function classifySemanticIntent(verbs, rawPrompt) {
  const p = rawPrompt.toLowerCase();

  // DEBUG — fix broken things
  if (/\b(debug|fix|error|bug|broken|crash|leak|not working|fails|exception|undefined|null pointer|solve|remediate|issue|problem)\b/.test(p)
    || verbs.some(v => ['fix', 'debug', 'solve', 'patch', 'resolve', 'repair'].includes(v))) return 'DEBUG';

  // AUDIT — security & quality review
  if (/\b(audit|security|inspect|vulnerability|owasp|risk|penetration|pentest|injection|xss|csrf|threat|compliance)\b/.test(p)) return 'AUDIT';

  // REFACTOR — improve existing code/content
  if (/\b(refactor|optimize|clean up|rewrite|scale|performance|speed up|improve|restructure|modularize|modernize)\b/.test(p)
    || verbs.some(v => ['refactor', 'optimize', 'clean', 'rewrite', 'improve'].includes(v))) return 'REFACTOR';

  // EXPLAIN — teaching and understanding
  if (/\b(explain|teach|learn|understand|concept|how does|tutorial|what is|what are|clarify|breakdown|guide me|walk me through)\b/.test(p)
    || verbs.some(v => ['explain', 'teach', 'learn', 'understand'].includes(v))) return 'EXPLAIN';

  // SUMMARIZE — distill information
  if (/\b(summarize|notes|cheat sheet|outline|recap|extract|digest|tldr|key points|condense|shorten|brief overview)\b/.test(p)
    || verbs.some(v => ['summarize', 'outline', 'extract', 'condense'].includes(v))) return 'SUMMARIZE';

  // VISUAL — image generation
  if (/\b(image|logo|illustration|render|photo|midjourney|stable diffusion|dall-e|visual|art|painting|style|portrait|scene|generate.*image)\b/.test(p)
    || verbs.some(v => ['draw', 'render', 'paint', 'illustrate', 'visualize'].includes(v))) return 'VISUAL';

  // ARCHITECT — system / product design
  if (/\b(system|architect|flowchart|diagram|database|schema|api design|endpoint|blueprint|structure|design system|information architecture)\b/.test(p)) return 'ARCHITECT';

  // WRITE — prose, copy, content creation
  if (/\b(write|draft|compose|create.*content|essay|blog|article|email|letter|story|script|copy|caption|post|tweet|newsletter)\b/.test(p)
    || verbs.some(v => ['write', 'draft', 'compose'].includes(v))) return 'WRITE';

  // ANALYZE — investigate data, text, code
  if (/\b(analyze|analyse|evaluate|assess|review|examine|investigate|measure|benchmark|compare performance|data analysis|insights)\b/.test(p)
    || verbs.some(v => ['analyze', 'analyse', 'evaluate', 'assess', 'review'].includes(v))) return 'ANALYZE';

  // COMPARE — side-by-side evaluation
  if (/\b(compare|versus|vs\.?|difference between|pros and cons|trade-?off|which is better|contrast|alternatives)\b/.test(p)) return 'COMPARE';

  // PLAN — strategy, roadmap, project planning
  if (/\b(plan|roadmap|strategy|steps|phases|milestones|timeline|schedule|project|kickoff|sprint|backlog)\b/.test(p)
    || verbs.some(v => ['plan', 'strategize', 'organize', 'schedule'].includes(v))) return 'PLAN';

  return 'BUILD';
}

// ============================================================================
// PROMPT ARCHETYPE DETECTION — 6 Types
// ============================================================================

function detectPromptArchetype(rawPrompt, intent, verbs) {
  if (['DEBUG', 'REFACTOR', 'AUDIT'].includes(intent)) return 'Transformation';
  if (['EXPLAIN', 'SUMMARIZE'].includes(intent)) return 'Knowledge';
  if (['WRITE'].includes(intent)) return 'Creative';
  if (['ANALYZE', 'COMPARE'].includes(intent)) return 'Analysis';
  if (['ARCHITECT', 'PLAN'].includes(intent)) return 'System';
  if (['VISUAL'].includes(intent)) return 'Generative';
  return 'Task';
}

// ============================================================================
// GOAL & NEED-GAP INFERENCE
// ============================================================================

function inferUserGoal(rawPrompt, intent, nouns, domain) {
  const clean = rawPrompt
    .replace(/^(can you|please|help me|i want to|i need to|i want|i need|write a|create a|generate a|make a|make me a|build a|give me a|give me)\s+/i, '')
    .trim();

  const goalMap = {
    DEBUG:    `Diagnose and permanently fix: "${clean}" — root cause first, production-safe fix second.`,
    AUDIT:    `Identify every vulnerability and quality risk in: "${clean}" — prioritized by severity with executable remediation.`,
    REFACTOR: `Transform: "${clean}" into clean, scalable, maintainable code following modern best practices.`,
    EXPLAIN:  `Build a complete, intuitive understanding of: "${clean}" — from first principles to practical mastery.`,
    SUMMARIZE:`Extract the highest-signal insights, patterns, and actionable takeaways from: "${clean}".`,
    VISUAL:   `Generate a photorealistic / stylized visual of: "${clean}" — optimized for generative AI image model input.`,
    ARCHITECT:`Design the complete system architecture, data flow, and implementation blueprint for: "${clean}".`,
    WRITE:    `Produce polished, compelling, audience-calibrated writing for: "${clean}" — not a draft, a publishable output.`,
    ANALYZE:  `Deliver a rigorous, evidence-based analysis of: "${clean}" — with clear findings, patterns, and recommendations.`,
    COMPARE:  `Produce a definitive, objective comparison of: "${clean}" — with a clear recommendation and trade-off reasoning.`,
    PLAN:     `Develop a detailed, executable plan / roadmap for: "${clean}" — with phases, milestones, and success metrics.`,
    BUILD:    `Deliver a fully functional, production-grade implementation of: "${clean}".`
  };

  return goalMap[intent] || `Produce an expert, high-quality solution for: "${clean}".`;
}

/**
 * Need-Gap Analysis — identifies the deeper, unstated need behind the request.
 * This is what separates a surface-level enhancer from a true intent engine.
 */
function inferNeedGap(rawPrompt, intent, domain) {
  const p = rawPrompt.toLowerCase();

  // Common surface-to-deep-need mappings
  if (intent === 'WRITE' && /\b(cover letter|resume|cv|portfolio)\b/.test(p)) {
    return 'Real need: Get hired. The writing must demonstrate measurable impact and relevant skills, not just describe experience.';
  }
  if (intent === 'EXPLAIN' && /\b(interview|job|hiring|recruiter)\b/.test(p)) {
    return 'Real need: Pass a technical interview. Explanations must be concise, accurate, and demonstrable — not textbook.';
  }
  if (intent === 'BUILD' && /\b(startup|mvp|product|launch)\b/.test(p)) {
    return 'Real need: Ship fast and validate. Implementation must prioritize working over perfect — with clear extension points.';
  }
  if (intent === 'ANALYZE' && /\b(business|revenue|growth|churn|conversion)\b/.test(p)) {
    return 'Real need: Make a decision or justify a recommendation. Analysis must produce a clear action, not just observations.';
  }
  if (intent === 'DEBUG') {
    return 'Real need: Never see this error again. Fix must address root cause and include prevention — not a patch.';
  }
  if (intent === 'REFACTOR') {
    return 'Real need: Code that future teammates (or future self) can understand, extend, and maintain without fear.';
  }
  if (intent === 'PLAN') {
    return 'Real need: A roadmap someone will actually execute. The plan must account for real constraints, risks, and dependencies.';
  }
  if (intent === 'SUMMARIZE') {
    return 'Real need: Retain and apply the key knowledge — not just read it. Output should enable recall and action.';
  }
  if (intent === 'COMPARE') {
    return 'Real need: Make a confident decision. The comparison must end with a clear, reasoned recommendation — not a tie.';
  }

  return `Real need: An output that fully solves the underlying problem in "${domain.name}" — not just addresses the surface request.`;
}

function inferAudience(rawPrompt, domain, intent) {
  const p = rawPrompt.toLowerCase();

  if (/\b(client|customer|non-tech|manager|exec|ceo|cto|stakeholder|investor|pitch|board)\b/.test(p))
    return 'Non-technical business decision-makers — avoid jargon, lead with value and outcomes';
  if (/\b(interview|hiring|resume|job|recruiter|linkedin|portfolio)\b/.test(p))
    return 'Hiring managers and technical recruiters — show measurable impact and clear skills';
  if (/\b(student|beginner|learn|newbie|junior|first time|starter)\b/.test(p))
    return 'Beginner learners — use plain language, relatable analogies, and step-by-step progression';
  if (/\b(senior|principal|staff|architect|lead|team|review|pr|code review)\b/.test(p))
    return 'Senior engineers and technical leads — assume deep expertise, be terse and precise';
  if (/\b(ai|llm|model|gpt|claude|gemini|prompt|agent)\b/.test(p))
    return 'An AI language model — use clear directives, structured format, unambiguous instructions';
  if (/\b(general|public|everyone|anyone|broad)\b/.test(p))
    return 'A broad, mixed audience — balance accessibility with depth; avoid exclusive jargon';

  // Domain-based fallback
  const audienceByDomain = {
    'coding':   'Software engineers expecting clean, runnable, production-grade code',
    'writing':  'Readers expecting clear, engaging, well-structured prose',
    'business': 'Business professionals expecting strategic, data-driven insights',
    'study':    'Learners expecting structured, memorable, easy-to-digest explanations',
    'creative': 'Creative collaborators expecting imaginative, original, vivid outputs',
    'ai':       'AI models and prompt engineers expecting precise, unambiguous instructions',
    'visuals':  'Generative AI models requiring precise visual descriptions and technical parameters'
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
  if (isHeavyWork) contexts.push('Scale: Enterprise / Production-grade');
  if (/\b(startup|mvp|prototype|demo|poc)\b/.test(p)) contexts.push('Stage: Early-stage MVP — speed and clarity over perfection');
  if (/\b(production|scale|performance|optimize|deploy|release)\b/.test(p)) contexts.push('Stage: Production — correctness, performance, and reliability critical');
  if (/\b(team|collaboration|pr|review|open source|monorepo)\b/.test(p)) contexts.push('Environment: Collaborative team codebase — follow conventions and write for reviewability');
  if (/\b(solo|personal|side project|freelance|learning)\b/.test(p)) contexts.push('Environment: Solo / personal project — prioritize clarity and maintainability');

  return contexts.length > 0 ? contexts.join(' | ') : `Domain: ${domain.name}`;
}

// ============================================================================
// CONSTRAINTS, GUARDRAILS, COGNITIVE FRAME, SUCCESS CRITERIA
// ============================================================================

function inferSmartConstraints(rawPrompt, domain, intent, tech) {
  const p = rawPrompt.toLowerCase();
  const constraints = [];

  // Universal — always included
  constraints.push('Start the output immediately — no preamble, no "Here is your...", no restating the request.');
  constraints.push('Every recommendation must be specific and immediately actionable — no vague advice.');

  // Intent-specific
  if (intent === 'DEBUG' || intent === 'REFACTOR') {
    constraints.push('Fix at the root level, not the symptom. Explain WHY the issue exists before the fix.');
    constraints.push('Ensure zero regressions — verify no adjacent functionality is broken by the change.');
  }
  if (intent === 'EXPLAIN') {
    constraints.push('No academic jargon without immediate plain-language translation in the same sentence.');
    constraints.push('Every abstract concept must have one concrete, real-world analogy — not optional.');
  }
  if (intent === 'BUILD' && tech.length > 0) {
    constraints.push(`Write only for the specified stack (${tech.join(', ')}) — do not introduce unlisted dependencies.`);
    constraints.push('All code must be copy-paste ready — no TODO placeholders, no omitted sections, no pseudocode.');
  }
  if (intent === 'WRITE') {
    constraints.push('Avoid clichéd AI openers ("In today\'s fast-paced world...", "In conclusion..."). Start strong, end decisively.');
    constraints.push('Match the specified tone throughout — no tonal drift between paragraphs.');
  }
  if (intent === 'VISUAL') {
    constraints.push('Specify exact camera lens, lighting type, mood, and color palette — avoid vague terms like "beautiful lighting".');
    constraints.push('Include platform-specific parameters (e.g., --ar 16:9 --v 6 --style raw for Midjourney).');
  }
  if (intent === 'ANALYZE' || intent === 'COMPARE') {
    constraints.push('Back every claim with specific evidence, data, or logical reasoning — no unsupported assertions.');
    constraints.push('End with a concrete conclusion or recommendation — not a list of considerations.');
  }
  if (intent === 'PLAN') {
    constraints.push('Make the plan executable: each step must have a clear owner, action, and success indicator.');
    constraints.push('Account for dependencies and risks — not just the happy path.');
  }
  if (/\b(short|brief|concise|quick|tldr)\b/.test(p)) {
    constraints.push('Keep output scannable — max 200 words unless precision absolutely requires more.');
  }
  if (intent === 'AUDIT') {
    constraints.push('Rank all findings CRITICAL / HIGH / MEDIUM / LOW — no severity omissions.');
    constraints.push('Every vulnerability must include a working remediation code snippet, not just a description.');
  }

  return constraints;
}

function buildFailureGuardrails(intent, tech, rawPrompt) {
  const p = rawPrompt.toLowerCase();
  const guardrails = [];

  const universalGuardrails = {
    DEBUG:    ['Generic "try-catch everything" non-solutions', 'Fixes that mask errors instead of resolving them'],
    AUDIT:    ['Missing severity rankings', 'Describing vulnerabilities without providing fixes'],
    REFACTOR: ['Premature optimization without profiling', 'Over-engineering simple problems'],
    EXPLAIN:  ['Circular definitions (explaining X with X)', 'Missing the practical "so what" application'],
    SUMMARIZE:['Losing nuance in over-simplification', 'Missing the key actionable insights'],
    WRITE:    ['Generic AI openers and closers', 'Tonal inconsistency across sections'],
    ANALYZE:  ['Correlation-as-causation errors', 'Conclusions without evidence'],
    COMPARE:  ['False balance (treating unequal options as equal)', 'Missing a clear winner with justification'],
    PLAN:     ['Plans with no dependencies or risk considerations', 'Missing measurable milestones'],
    VISUAL:   ['Vague descriptors ("beautiful", "amazing")', 'Missing technical camera/lighting specs'],
    ARCHITECT:['Single points of failure', 'No error handling or fallback strategy'],
    BUILD:    ['Incomplete code with TODOs', 'Missing input validation and error handling']
  };

  const specific = universalGuardrails[intent] || ['Vague, non-actionable output', 'Missing key context or requirements'];
  guardrails.push(...specific);

  if (tech.length > 0) guardrails.push(`Introducing dependencies outside: ${tech.join(', ')}`);

  return guardrails;
}

function buildCognitiveFrame(intent, archetype, domain) {
  const frames = {
    'Transformation': 'Think like a senior code reviewer who has seen this pattern break in production before.',
    'Knowledge':      'Think like a great teacher who knows the student\'s exact mental model gap.',
    'Creative':       'Think like a professional writer who knows their reader will judge quality in the first sentence.',
    'Analysis':       'Think like a consultant who must defend their findings to a skeptical client.',
    'System':         'Think like a principal engineer designing for 10x scale and 5-year maintainability.',
    'Generative':     'Think like a professional art director briefing a generative AI with precision and intent.',
    'Task':           `Think like a ${domain.defaultRole || 'specialist'} who has solved this exact problem before.`
  };
  return frames[archetype] || frames['Task'];
}

function buildSuccessCriteria(intent, domain, tech) {
  const criteria = {
    DEBUG:    ['Root cause identified and explained', 'Fix is production-safe and tested', 'Recurrence prevented'],
    AUDIT:    ['All issues ranked by severity', 'Every vulnerability has a working fix', 'Standards referenced'],
    REFACTOR: ['Code is cleaner and more readable', 'Performance is equal or better', 'Tests still pass'],
    EXPLAIN:  ['Concept understood from scratch', 'Analogy makes it permanently memorable', 'Can apply it immediately'],
    SUMMARIZE:['Key insights captured accurately', 'Can recall without re-reading source', 'Action items clear'],
    WRITE:    ['Grabs attention in first sentence', 'Sustains tone throughout', 'Achieves intended reader reaction'],
    ANALYZE:  ['Findings are evidence-based', 'Pattern is clearly identified', 'Recommendation is concrete'],
    COMPARE:  ['Trade-offs are honestly presented', 'A clear winner is identified', 'Reader can decide immediately'],
    PLAN:     ['Steps are executable', 'Dependencies are mapped', 'Risks are acknowledged'],
    VISUAL:   ['Prompt generates the intended visual', 'Technical parameters are complete', 'Ready to paste'],
    ARCHITECT:['System handles the load', 'Failure modes are addressed', 'Can be implemented incrementally'],
    BUILD:    ['Code runs without modification', 'Edge cases handled', 'Error handling included']
  };
  return criteria[intent] || ['Output is immediately usable', 'Fully addresses the stated need', 'Meets professional quality standard'];
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
    boosters.push('Address failure modes and error handling strategies in the design');
  }
  if (intent === 'WRITE' && !p.includes('tone')) {
    boosters.push('Specify the tone explicitly (e.g., professional, conversational, persuasive) for best results');
  }
  if (intent === 'PLAN' && !p.includes('risk')) {
    boosters.push('Flag the top 3 risks or blockers for each major phase');
  }

  return boosters;
}

function buildOutputTrigger(intent, isHeavyWork) {
  const triggerMap = {
    DEBUG:    'Begin with your root-cause diagnosis. Then deliver the production-ready fix:',
    AUDIT:    'Start with the severity matrix. Then provide remediation for every finding:',
    REFACTOR: 'Show the improved architecture with before/after comparison:',
    EXPLAIN:  'Deliver your explanation, starting with the core mental model:',
    SUMMARIZE:'Provide the structured summary with key insights and immediate takeaways:',
    VISUAL:   'Output the complete generative prompt, optimized and ready to paste:',
    ARCHITECT:'Present the full architecture with components, data flow, and failure handling:',
    WRITE:    'Deliver the complete, polished piece — starting with the strongest hook:',
    ANALYZE:  'Present your analysis: findings, evidence, patterns, then your recommendation:',
    COMPARE:  'Deliver the comparison with a definitive recommendation and reasoning:',
    PLAN:     'Present the phased plan with milestones, dependencies, and risk flags:',
    BUILD:    isHeavyWork
      ? 'Reason through the architecture first, then deliver the complete implementation:'
      : 'Deliver the complete, working implementation:'
  };
  return triggerMap[intent] || 'Deliver your expert output now:';
}

// ============================================================================
// PRECISION PROMPT BUILDER
// ============================================================================

function buildPrecisionPrompt({
  role, inferredGoal, needGapAnalysis, rawPrompt, inferredAudience, inferredContext,
  smartConstraints, deliverables, cognitiveFrame, successCriteria, failureGuardrails,
  contextBoosters, tone, format, isHeavyWork, detectedTech, outputTrigger, archetype
}) {
  const techLine = detectedTech.length > 0
    ? `\nTechnology Stack: ${detectedTech.join(', ')}`
    : '';

  const contextLine = inferredContext ? `\nWorking Context: ${inferredContext}` : '';
  const audienceLine = inferredAudience ? `\nTarget Audience: ${inferredAudience}` : '';

  const boosterSection = contextBoosters.length > 0
    ? `\n\n### 💡 CONTEXT BOOSTERS\n${contextBoosters.map(b => `- ${b}`).join('\n')}`
    : '';

  const cotSection = isHeavyWork
    ? `\n\n### 🧠 REASONING PROTOCOL\nBefore producing output, internally map your approach:\n1. Identify all core requirements, edge cases, and constraints.\n2. Evaluate trade-offs or alternative approaches.\n3. Identify the most likely failure mode and pre-empt it.\n4. Confirm your strategy is optimal — then execute.`
    : '';

  const successSection = successCriteria.length > 0
    ? `\n\n### ✅ SUCCESS CRITERIA\nYour output must satisfy all of the following:\n${successCriteria.map(s => `- ${s}`).join('\n')}`
    : '';

  const guardrailSection = failureGuardrails.length > 0
    ? `\n\n### 🚫 FAILURE GUARDRAILS — Actively avoid:\n${failureGuardrails.map(f => `- ${f}`).join('\n')}`
    : '';

  return `### 🎯 ROLE & EXPERTISE
Act as ${role}. You have deep, production-grade expertise in this domain. ${cognitiveFrame}

### 📌 REAL OBJECTIVE
${inferredGoal}${techLine}${contextLine}${audienceLine}

> **Underlying need:** ${needGapAnalysis}

### 📋 DELIVERABLES
${deliverables.map(d => `- ${d}`).join('\n')}${boosterSection}

### 🎨 STYLE & FORMAT
- **Tone:** ${tone}
- **Format:** ${format}${cotSection}${successSection}${guardrailSection}

### 🛡️ HARD CONSTRAINTS
${smartConstraints.map(c => `- ${c}`).join('\n')}

${outputTrigger}`;
}

// ============================================================================
// NLP SUPPORT ENGINES
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
    'java', 'spring', 'laravel', 'php', 'swift', 'kotlin', 'flutter', 'android',
    'terraform', 'ansible', 'nginx', 'linux', 'bash', 'powershell', 'zod', 'prisma'
  ];
  return techList.filter(t => p.includes(t));
}

function detectComplexity(rawPrompt, verbs, nouns, tech) {
  const p = rawPrompt.toLowerCase();
  if (p.length > 100) return true;
  if (tech.length >= 2) return true;
  if (/\b(fullstack|system|auth|jwt|database|schema|migration|architecture|microservices|distributed|pipeline|production|enterprise|audit|security|integration|multi-tenant|async|concurrent|real.time|scalab)\b/.test(p)) {
    return true;
  }
  return false;
}

function synthesizePrecisionPersona(domain, intent, nouns, tech, isHeavyWork) {
  const techStr = tech.length > 0 ? tech.slice(0, 2).map(t => t.charAt(0).toUpperCase() + t.slice(1)).join('/') + ' ' : '';
  const tier = isHeavyWork ? 'Principal Staff-Level ' : 'Senior ';

  const personaMap = {
    DEBUG:    `${tier}${techStr}Debugging Architect — specializes in root-cause analysis and production-safe remediation with zero regressions`,
    AUDIT:    `${tier}Cybersecurity Engineer & ${techStr}Security Architect — OWASP Top 10 specialist with threat modeling expertise`,
    REFACTOR: `${tier}${techStr}Software Architect — expert in clean architecture, SOLID principles, and measurable performance optimization`,
    EXPLAIN:  `Expert Technical Educator with deep mastery of ${domain.name} — known for making complex ideas permanently memorable through precision and analogy`,
    SUMMARIZE:`Senior Knowledge Synthesist — expert in distilling dense material into high-signal, immediately actionable insights`,
    VISUAL:   `Master AI Art Director with expertise in generative prompt engineering for Midjourney, DALL-E 3, and Stable Diffusion — specializes in photorealistic and stylized outputs`,
    ARCHITECT:`${tier}Distributed Systems Architect — expert in scalable design patterns, ${techStr}system reliability, and failure-mode engineering`,
    WRITE:    `Senior ${domain.name} Copywriter & Content Strategist — expert in audience-calibrated writing that achieves measurable results`,
    ANALYZE:  `Senior ${techStr}Data & Strategy Analyst — specializes in evidence-based insights, pattern recognition, and decision-ready recommendations`,
    COMPARE:  `Senior ${domain.name} Evaluation Specialist — expert in objective, trade-off-aware comparative analysis with clear decisional outcomes`,
    PLAN:     `Senior ${domain.name} Strategist & Project Architect — expert in executable roadmaps that account for real constraints, dependencies, and risks`,
    BUILD:    domain.defaultRole || `${tier}${techStr}${domain.name} Specialist with production-grade delivery standards`
  };

  return personaMap[intent] || domain.defaultRole || `${tier}${domain.name} Expert`;
}

function synthesizeDeliverables(domainId, intent, nouns, tech, isHeavyWork) {
  const deliverables = [];

  if (intent === 'DEBUG') {
    deliverables.push('Root-Cause Diagnosis: Trace the exact failure path — explain WHY it breaks, not just what breaks.');
    deliverables.push('Production-Ready Fix: Fully working, copy-paste code with proper error handling — no half-solutions.');
    deliverables.push('Recurrence Prevention: How to prevent this entire class of issue going forward.');
    if (isHeavyWork) deliverables.push('Regression Check: Confirmation that no adjacent functionality is broken by the fix.');
    return deliverables;
  }

  if (intent === 'AUDIT') {
    deliverables.push('Severity Matrix: Every issue ranked CRITICAL / HIGH / MEDIUM / LOW with precise impact descriptions.');
    deliverables.push('Executable Patches: Working remediation code for every identified vulnerability — not just descriptions.');
    deliverables.push('Standards Alignment: Map all findings to OWASP Top 10, CWE, or relevant security benchmarks.');
    return deliverables;
  }

  if (intent === 'REFACTOR') {
    deliverables.push('Improved Architecture: Restructured code applying SOLID principles and clear separation of concerns.');
    deliverables.push('Performance Gains: Concrete optimizations with measurable improvements stated explicitly.');
    deliverables.push('Before vs After: Clear diff showing what changed, why each change is better, and what was preserved.');
    return deliverables;
  }

  if (intent === 'EXPLAIN') {
    deliverables.push('Core Concept: A jargon-free explanation built from first principles — not a textbook definition.');
    deliverables.push('Mental Model: One powerful analogy that makes the concept permanently memorable.');
    deliverables.push('Common Misconceptions: The top 3 mistakes beginners and intermediate learners make with this concept.');
    deliverables.push('Practical Application: One concrete, real-world use case that demonstrates why this matters.');
    return deliverables;
  }

  if (intent === 'SUMMARIZE') {
    deliverables.push('Key Insights: The 5 most important ideas — phrased as standalone, actionable sentences.');
    deliverables.push('Active-Recall Questions: 5 questions that test real comprehension of the material.');
    deliverables.push('Executive TL;DR: A 3-sentence summary for someone with no time to read more.');
    return deliverables;
  }

  if (intent === 'WRITE') {
    deliverables.push('Complete Draft: Polished, complete piece — not an outline or bullet list unless explicitly requested.');
    deliverables.push('Tone Calibration: Consistent voice and register throughout — matched to the specified audience.');
    deliverables.push('Hook & Close: A compelling opening that grabs attention and a decisive ending that drives action.');
    return deliverables;
  }

  if (intent === 'ANALYZE') {
    deliverables.push('Key Findings: The 3–5 most significant insights with supporting evidence for each.');
    deliverables.push('Pattern Identification: Underlying patterns, trends, or anomalies in the subject matter.');
    deliverables.push('Concrete Recommendation: A specific, actionable recommendation based on the analysis — not a list of options.');
    return deliverables;
  }

  if (intent === 'COMPARE') {
    deliverables.push('Objective Comparison Table: Side-by-side evaluation across the key decision dimensions.');
    deliverables.push('Trade-off Analysis: Honest assessment of pros, cons, and context-dependency for each option.');
    deliverables.push('Clear Winner: A definitive recommendation with explicit reasoning — not "it depends" without explanation.');
    return deliverables;
  }

  if (intent === 'PLAN') {
    deliverables.push('Phased Roadmap: Clear phases with specific milestones and deliverables for each.');
    deliverables.push('Dependency Map: What each phase depends on and which tasks can run in parallel.');
    deliverables.push('Risk Register: Top 3 risks per phase with mitigation strategies.');
    deliverables.push('Success Metrics: How to measure whether each phase achieved its goal.');
    return deliverables;
  }

  if (intent === 'VISUAL') {
    deliverables.push('Subject & Composition: Precise description of focal subject, scene positioning, and visual hierarchy.');
    deliverables.push('Camera & Lighting: Specific lens (e.g., 85mm f/1.4), lighting style, color palette, and mood.');
    deliverables.push('Platform Parameters: Exact model flags ready to paste (e.g., `--ar 16:9 --v 6.0 --style raw`).');
    return deliverables;
  }

  if (intent === 'ARCHITECT') {
    deliverables.push('System Overview: High-level component architecture with clear responsibilities for each component.');
    deliverables.push('Data Flow: End-to-end data movement — ingestion, processing, storage, and retrieval.');
    deliverables.push('API Design: Key endpoints, request/response schemas, and authentication strategy.');
    if (isHeavyWork) deliverables.push('Failure & Scale: How the system handles failures, retries, and horizontal scaling pressure.');
    return deliverables;
  }

  // Domain fallbacks for BUILD
  if (domainId?.startsWith('coding')) {
    deliverables.push('Complete Source Code: Runnable, copy-paste ready — no TODOs, no omissions, no pseudocode.');
    deliverables.push('Production Hygiene: Input validation, sanitization, error handling, and environment variable isolation.');
    if (isHeavyWork) deliverables.push('Scalability Notes: Index strategy, concurrency handling, and caching recommendations.');
  } else if (domainId?.startsWith('study')) {
    deliverables.push('Structured Notes: Hierarchical format with bold key terms and clear visual separation.');
    deliverables.push('Self-Test Battery: Minimum 5 active-recall questions covering core concepts.');
  } else if (domainId?.startsWith('writing')) {
    deliverables.push('Draft Output: Polished, complete prose — not an outline unless explicitly requested.');
    deliverables.push('Tone Calibration: Matched to the specified audience and maintained throughout.');
  } else if (domainId?.startsWith('business')) {
    deliverables.push('Strategic Recommendations: Prioritized, data-informed, and tied directly to business outcomes.');
    deliverables.push('Executive-Ready Format: Structured for busy decision-makers — headline first, evidence second.');
  } else {
    deliverables.push('Expert-Grade Output: Immediately usable, high-value content ready for execution.');
    deliverables.push('Structured Format: Clear sections, scannable, no unnecessary padding or filler.');
  }

  return deliverables;
}
