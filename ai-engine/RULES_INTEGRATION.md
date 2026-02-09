# AI Engine Rules Integration Guide

## Overview

This document explains how the comprehensive resume builder rules are integrated between the `ai-engine` and `frontend` folders.

## Architecture

```
PlaceMate/
├── ai-engine/                      # Core AI engine with rule definitions
│   ├── lib/
│   │   ├── ai-engine/
│   │   │   ├── unified-rules.ts    # Unified rules loader (exports for external use)
│   │   │   ├── index.ts            # Main exports
│   │   │   ├── rule-engine.ts
│   │   │   ├── rule-loader.ts
│   │   │   ├── scoring-engine.ts
│   │   │   └── suggestion-generator.ts
│   │   └── rules/
│   │       ├── ats_rules.json      # ATS optimization rules
│   │       ├── hr_rules.json       # HR evaluation rules
│   │       ├── web-developer.json  # Web development domain rules
│   │       ├── data-scientist.json
│   │       ├── cyber-security.json
│   │       ├── aiml-engineer.json
│   │       ├── devops-engineer.json
│   │       └── rules-schema.ts     # TypeScript schema
│   └── ruleset.json                # Legacy ruleset (for backwards compatibility)
│
└── frontend/                       # Next.js frontend application
    └── lib/
        └── ai-engine/
            ├── unified-rules-bridge.ts  # Bridge file (embedds rules for frontend)
            ├── ruleset.ts               # Rule evaluation functions
            ├── evaluator.ts             # Resume evaluation engine
            └── ontology.ts              # Skill taxonomy and detection
```

## Rule Files

### 1. ATS Rules (`ats_rules.json`)
Universal ATS optimization rules applicable across all domains:
- **Keyword Matching**: Exact keyword matching, job titles, technical terms
- **Format Compliance**: Layout, headers, fonts, file format
- **Content Structure**: Skills section, contact info, resume length

### 2. HR Rules (`hr_rules.json`)
Human recruiter evaluation rules:
- **Impact Quantification**: Metrics, action verbs, problem-solving context
- **Portfolio Presence**: GitHub, portfolio projects, open-source contributions
- **Professionalism**: LinkedIn, email, error-free writing
- **Experience Presentation**: Bullet points, chronological order, relevance
- **Soft Skills**: Collaboration, leadership, communication
- **Red Flags**: Objective statements, buzzwords, duties-focused content

### 3. Web Developer Rules (`web-developer.json`)
Domain-specific rules for web development:
- **Core Skills**: HTML, CSS, JavaScript, TypeScript, Responsive Design, Git
- **Frontend Skills**: React, Next.js, Vue.js, Angular, Tailwind CSS
- **Backend Skills**: Node.js, Python, Databases, API Development, Cloud
- **Modern Skills**: Testing, Performance, Accessibility, AI-Assisted Development
- **Experience Levels**: Entry-Level, Mid-Level, Senior expectations
- **Role Variants**: Frontend, Backend, Full-Stack specific focus areas
- **Trending Skills**: AI-assisted development, TypeScript, Next.js
- **Declining Skills**: jQuery, AngularJS, Bower

## How It Works

### 1. Rule Loading Flow

```
ai-engine/lib/rules/*.json
         ↓
ai-engine/lib/ai-engine/unified-rules.ts (transforms nested → flat)
         ↓
frontend/lib/ai-engine/unified-rules-bridge.ts (embedds transformed rules)
         ↓
frontend/lib/ai-engine/ruleset.ts (uses rules for evaluation)
         ↓
frontend/lib/ai-engine/evaluator.ts (generates scores & suggestions)
```

### 2. Data Flow

1. **Rule Files**: Comprehensive JSON rules with rich metadata
2. **Unified Loader**: Transforms nested structure → flat arrays
3. **Bridge Layer**: Makes rules available to frontend
4. **Evaluation**: Applies rules to resume data
5. **Scoring**: Calculates ATS, HR, and JD match scores
6. **Suggestions**: Generates improvement suggestions

## Key Exports

### From `unified-rules-bridge.ts`:
```typescript
// Get complete ruleset
getUnifiedRuleset(): UnifiedRuleset

// Get domain-specific rules
getDomainRules(domain: string): DomainRulesFlat | null

// Get red flags for a domain
getDomainRedFlags(domain: string): RedFlag[]

// Get action verbs by category
getActionVerbs(): { leadership, creation, improvement, analysis, collaboration }

// Get metric examples
getMetricExamples(): MetricType[]

// Get trending/declining skills
getTrendingSkills(domain: string): { emerging: [], declining: [] }
```

### From `ruleset.ts`:
```typescript
// Evaluate resume against rules
evaluateATSRules(resume: Resume): RuleEvaluation[]
evaluateHRRules(resume: Resume): RuleEvaluation[]
evaluateRedFlags(resume: Resume): RuleEvaluation[]
evaluateJDMatch(resume: Resume, jobContext?: JobContext): RuleEvaluation[]

// Get role-specific tips
getRoleSpecificTips(role: string): string[]

// Get scoring configuration
getScoringWeights(): { ats: 0.4, hr: 0.3, jd: 0.3 }
getVerdictThresholds(): { pass: 75, borderline: 55, fail: 0 }
```

## Adding New Rules

### 1. Update JSON Files
Add new rules to the appropriate JSON file in `ai-engine/lib/rules/`:

```json
{
  "ruleId": "ATS-NEW-001",
  "rule": "New rule description",
  "rationale": "Why this rule matters",
  "weight": 0.85,
  "implementation": [
    "How to implement this rule",
    "Additional guidance"
  ]
}
```

### 2. Update Bridge File
If adding new rule categories, update `frontend/lib/ai-engine/unified-rules-bridge.ts` to include the new rules in the embedded data.

### 3. Update Evaluation Logic
If the new rules require special evaluation logic, update `frontend/lib/ai-engine/ruleset.ts` with the appropriate switch cases.

## Scoring Formula

```
Final Score = (ATS Score × 0.4) + (HR Score × 0.3) + (JD Score × 0.3) - Red Flag Penalty

Verdicts:
- PASS: Score >= 75
- BORDERLINE: Score >= 55
- FAIL: Score < 55

Red Flag Penalty: Capped at 20 points maximum
```

## Best Practices

1. **Keep Rules Atomic**: Each rule should test one specific thing
2. **Provide Clear Suggestions**: Every rule failure should have actionable guidance
3. **Weight Appropriately**: Critical rules should have weight 0.9-1.0, medium 0.7-0.8
4. **Include Rationale**: Explain why each rule matters for recruiter credibility
5. **Sync Regularly**: Keep bridge file in sync with JSON source files

## Troubleshooting

### Import Issues
If you encounter import errors, ensure:
1. `resolveJsonModule: true` in `tsconfig.json`
2. Path aliases are configured in both `tsconfig.json` and `next.config.mjs`

### Build Errors
Clear Next.js cache and node_modules:
```bash
rm -rf .next node_modules
npm install
npm run dev
```

### Rule Not Applied
Check:
1. Rule ID is in the flattened rules array
2. Rule has corresponding switch case in evaluation functions
3. Rule weight is > 0

## Version History

- **v1.0** (2026-02-05): Initial comprehensive rules integration
  - ATS rules: 441 lines, 14 critical rules
  - HR rules: 578 lines, 20+ evaluation rules
  - Web Developer: 1027 lines, complete domain coverage
