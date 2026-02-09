// File: lib/ai-engine/index.ts
// This exports all AI engine components for easy importing

export { RuleEngine } from './rule-engine'
export { RuleLoader } from './rule-loader'
export { SuggestionGenerator, type Suggestion } from './suggestion-generator'
export { ScoringEngine, type ATSScore } from './scoring-engine'

// Unified Rules Loader - bridges comprehensive JSON rules with frontend format
export {
    getUnifiedRuleset,
    getDomainRules,
    getDomainSkills,
    getExperienceLevelExpectations,
    getRoleVariantInfo,
    getHighValueKeywords,
    getDomainRedFlags,
    getTrendingSkills,
    getActionVerbs,
    getMetricExamples,
    clearRulesetCache,
    getAvailableDomains,
    validateRulesLoaded,
    type UnifiedRuleset,
    type FlatATSRule,
    type FlatHRRule,
    type RedFlagRule,
    type JDMatchRule,
    type DomainSkill,
    type ExperienceLevelExpectations,
    type RoleVariant,
    type DomainRulesFlat
} from './unified-rules'

// You can also export types and interfaces for TypeScript support
export type { DomainRules, ExperienceLevelRules as LegacyExperienceLevelRules, SkillRule, PowerWord, RedFlag } from '../rules/rules-schema'