// File: lib/rules/rules-schema.ts
// Copy this entire file

export interface SkillRule {
  skill: string
  context: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  weight: number
  alternatives?: string[]
}

export interface MetricExample {
  type: string
  examples: string[]
  priority: 'high' | 'medium' | 'low'
  applicable: boolean
}

export interface PowerWord {
  verb: string
  context: string
  strength: 'low' | 'medium' | 'high' | 'very high'
  example: string
}

export interface RedFlag {
  flag: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  reason: string
  suggestion: string
}

export interface ATSRule {
  rule: string
  details: string
  importance: 'critical' | 'high' | 'medium'
  impact: string
}

export interface ResumeSection {
  section: string
  required: boolean
  guidelines: string
  order: number
  minLength?: number
  maxLength?: number
  recommendedItems?: number
  bulletsPerRole?: string
}

export interface ScoringWeights {
  requiredSkills: number
  powerWords: number
  metricsPresent: number
  resumeStructure: number
  atsCompliance: number
  redFlagsAbsent: number
  [key: string]: number
}

export interface ExperienceLevelRules {
  level: 'Entry-Level' | 'Junior' | 'Mid-Level' | 'Senior'
  yearsRequired: string
  rules: {
    requiredSkills: {
      category: string
      importance: number
      skills: SkillRule[]
    }
    niceToHaveSkills: {
      category: string
      importance: number
      skills: SkillRule[]
    }
    powerWords: {
      category: string
      importance: number
      verbs: PowerWord[]
    }
    metricsFramework: {
      category: string
      importance: number
      metricTypes: MetricExample[]
    }
    resumeStructure: {
      category: string
      importance: number
      sections: ResumeSection[]
    }
    redFlags: {
      category: string
      importance: number
      flags: RedFlag[]
    }
    atsOptimization: {
      category: string
      importance: number
      rules: ATSRule[]
    }
  }
  scoringWeights: ScoringWeights
}

export interface DomainRules {
  domain: string
  description: string
  experienceLevels: {
    entryLevel: ExperienceLevelRules
    junior?: ExperienceLevelRules
    midLevel: ExperienceLevelRules
    senior?: ExperienceLevelRules
  }
  overallScoringWeights: ScoringWeights
}

export interface RuleEngine {
  version: string
  lastUpdated: string
  domains: {
    [key: string]: DomainRules
  }
}