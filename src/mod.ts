// mod.ts
/**
 * A module providing a function to greet people.
 *
 * @example
 * ```ts
 * import { BaseService } from "./mod.ts";
 *
 * const baseService = new BaseService(config, "serviceName");
 * ```
 *
 * @module
 */
export { default as BaseService } from "./services/BaseService.ts";
export { default as AgentVepService } from "./services/AgentVepService.ts";
export { default as DomainService } from "./services/DomainService.ts";
export * from "./types/api.d.ts";
