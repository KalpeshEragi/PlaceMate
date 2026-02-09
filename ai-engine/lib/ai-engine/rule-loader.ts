// File: lib/ai-engine/rule-loader.ts
// Copy this entire file

import { DomainRules, RuleEngine } from '../rules/rules-schema'

export class RuleLoader {
  private static cachedRules: Map<string, DomainRules> = new Map()

  /**
   * Load rules for a specific domain
   * Example: loadRules('web-developer')
   * 
   * This dynamically imports the JSON file and caches it for performance
   */
  static async loadRules(domain: string): Promise<DomainRules> {
    // Check cache first
    if (this.cachedRules.has(domain)) {
      console.log(`[RuleLoader] Using cached rules for: ${domain}`)
      return this.cachedRules.get(domain)!
    }

    try {
      console.log(`[RuleLoader] Loading rules for: ${domain}`)

      // Import the JSON file dynamically
      const ruleFile = await import(`../rules/${domain}.json`)
      const jsonContent = ruleFile.default || ruleFile

      // Handle multiple JSON structures:
      // 1. New structure: { webDevRules: {...} } or { atsRules: {...} }
      // 2. Old structure: { ruleEngine: { domains: {...} } }

      let domainRules: DomainRules | null = null

      // Try new structure first (webDevRules, atsRules, etc.)
      const directKeys = ['webDevRules', 'atsRules', 'hrRules', 'dataScienceRules', 'cyberSecurityRules', 'devopsRules', 'aimlRules']
      for (const key of directKeys) {
        if (jsonContent[key]) {
          console.log(`[RuleLoader] Found direct rules key: ${key}`)
          domainRules = this.transformNewStructure(jsonContent[key], domain)
          break
        }
      }

      // If not found, try old structure
      if (!domainRules) {
        const ruleEngine = jsonContent.ruleEngine || jsonContent
        const domainsObj = ruleEngine.domains

        if (domainsObj) {
          const camelCaseKey = domain.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
          domainRules = domainsObj[domain] || domainsObj[camelCaseKey]

          if (!domainRules) {
            const keys = Object.keys(domainsObj)
            if (keys.length > 0) {
              domainRules = domainsObj[keys[0]]
            }
          }
        }
      }

      if (!domainRules) {
        console.error(`[RuleLoader] Could not parse rules for: ${domain}`)
        console.error('[RuleLoader] JSON keys:', Object.keys(jsonContent))
        throw new Error(`Invalid rule file structure for: ${domain}`)
      }

      // Cache it for future use
      this.cachedRules.set(domain, domainRules)
      console.log(`[RuleLoader] Successfully loaded and cached rules for: ${domain}`)

      return domainRules
    } catch (error) {
      console.error(`[RuleLoader] Failed to load rules for ${domain}:`, error)
      throw new Error(`Unable to load rules for domain: ${domain}. Make sure ${domain}.json exists in lib/rules/`)
    }
  }

  /**
   * Get all available domains
   * Returns list of domains that have rule files
   */
  static async getAvailableDomains(): Promise<string[]> {
    return [
      'web-developer',
      'data-scientist',
      'cyber-security',
      'aiml-engineer',
      'devops-engineer'
    ]
  }

  /**
   * Transform new JSON structure to DomainRules format
   */
  private static transformNewStructure(rules: any, domain: string): DomainRules {
    // Build experience level rules with all required fields
    const buildExpLevel = (level: any, levelName: string): any => ({
      level: levelName as 'Entry-Level' | 'Junior' | 'Mid-Level' | 'Senior',
      yearsRequired: level?.yearsRequired || '0-2 years',
      rules: {
        requiredSkills: {
          category: 'Required Skills',
          importance: 1.0,
          skills: (level?.criticalSkills || []).map((s: string) => ({
            skill: s,
            importance: 'high',
            rationale: 'Core skill for this role'
          }))
        },
        niceToHaveSkills: {
          category: 'Nice to Have',
          importance: 0.5,
          skills: (level?.niceToHave || []).map((s: string) => ({
            skill: s,
            importance: 'medium',
            rationale: 'Beneficial skill'
          }))
        },
        powerWords: {
          category: 'Action Verbs',
          importance: 0.8,
          verbs: []
        },
        metricsFramework: {
          category: 'Metrics',
          importance: 0.9,
          types: []
        },
        redFlags: {
          category: 'Red Flags',
          importance: 1.0,
          flags: []
        }
      },
      scoringWeights: {
        requiredSkills: 0.35,
        powerWords: 0.15,
        metricsPresent: 0.20,
        resumeStructure: 0.10,
        atsCompliance: 0.10,
        redFlagsAbsent: 0.10
      }
    })

    return {
      domain: domain,
      description: rules.description || `Rules for ${domain}`,
      experienceLevels: {
        entryLevel: buildExpLevel(rules.experienceLevelSpecifics?.entryLevel, 'Entry-Level'),
        midLevel: buildExpLevel(rules.experienceLevelSpecifics?.midLevel, 'Mid-Level'),
        senior: buildExpLevel(rules.experienceLevelSpecifics?.senior, 'Senior')
      },
      overallScoringWeights: {
        requiredSkills: 0.35,
        powerWords: 0.15,
        metricsPresent: 0.20,
        resumeStructure: 0.10,
        atsCompliance: 0.10,
        redFlagsAbsent: 0.10
      }
    }
  }

  /**
   * Check if a domain has rules available
   */
  static async isDomainAvailable(domain: string): Promise<boolean> {
    try {
      await this.loadRules(domain)
      return true
    } catch {
      return false
    }
  }

  /**
   * Clear the cache (useful for testing or when rules update)
   * Call this if you update a JSON rule file and want fresh data
   */
  static clearCache() {
    this.cachedRules.clear()
    console.log('[RuleLoader] Cache cleared')
  }

  /**
   * Get a specific cached domain (returns null if not cached)
   */
  static getCachedDomain(domain: string): DomainRules | null {
    return this.cachedRules.get(domain) || null
  }

  /**
   * Preload multiple domains at once
   * Useful to load all rules when app starts
   */
  static async preloadDomains(domains: string[]): Promise<void> {
    console.log(`[RuleLoader] Preloading ${domains.length} domains...`)

    for (const domain of domains) {
      try {
        await this.loadRules(domain)
      } catch (error) {
        console.warn(`[RuleLoader] Failed to preload ${domain}:`, error)
      }
    }

    console.log(`[RuleLoader] Preloading complete`)
  }
}