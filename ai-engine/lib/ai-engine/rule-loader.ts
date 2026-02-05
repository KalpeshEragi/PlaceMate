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
      // This works because Next.js treats JSON imports as modules
      const ruleFile = await import(`../rules/${domain}.json`)

      // The JSON structure is: { ruleEngine: { domains: {...} } }
      // When imported, ruleFile.default contains the whole JSON
      const jsonContent = ruleFile.default || ruleFile

      // Unwrap the ruleEngine wrapper if present
      const ruleEngine = jsonContent.ruleEngine || jsonContent

      // Get the domains object
      const domainsObj = ruleEngine.domains

      if (!domainsObj) {
        console.error(`[RuleLoader] No domains object found in rule file for: ${domain}`)
        console.error('[RuleLoader] JSON structure:', Object.keys(jsonContent))
        throw new Error(`Invalid rule file structure for: ${domain}`)
      }

      // Try to find domain rules - try both kebab-case and camelCase keys
      // Convert web-developer to webDeveloper
      const camelCaseKey = domain.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())

      // Try different key formats
      let domainRules = domainsObj[domain] || domainsObj[camelCaseKey]

      // If still not found, try to get the first (and likely only) domain in the object
      if (!domainRules) {
        const keys = Object.keys(domainsObj)
        if (keys.length > 0) {
          console.log(`[RuleLoader] Using first domain key: ${keys[0]}`)
          domainRules = domainsObj[keys[0]]
        }
      }

      if (!domainRules) {
        throw new Error(`Domain rules not found for: ${domain}`)
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