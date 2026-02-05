// File: lib/ai-engine/index.ts
// Copy this entire file
// This exports all AI engine components for easy importing

export { RuleEngine } from './rule-engine'
export { RuleLoader } from './rule-loader'
export { SuggestionGenerator, type Suggestion } from './suggestion-generator'
export { ScoringEngine, type ATSScore } from './scoring-engine'

// You can also export types and interfaces for TypeScript support
export type { DomainRules, ExperienceLevelRules, SkillRule, PowerWord, RedFlag } from '../rules/rules-schema'