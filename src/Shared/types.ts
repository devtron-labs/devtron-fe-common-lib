import { PatchOperationType } from './constants'

export interface RuntimeParamsAPIResponseType {
    envVariables: Record<string, string>
}

export interface RuntimeParamsTriggerPayloadType {
    runtimeParams: RuntimeParamsAPIResponseType
}

export enum CIMaterialSidebarType {
    CODE_SOURCE = 'Code Source',
    PARAMETERS = 'Parameters',
}

/**
 * @example Usage with specific enum for path & `unknown` type for value
 * ```ts
 * enum PatchKeys {
 *  name = 'name',
 *  description = 'description',
 * }
 *
 * const query: PatchQueryType<PatchKeys> = {
 *  op: PatchOperationType.replace,
 *  path: PatchKeys.name,
 *  value: '1'
 * }
 * ```
 *
 * @example Usage with specific enum for path & custom type for value
 * ```ts
 * enum PatchKeys {
 *  name = 'name',
 *  description = 'description',
 * }
 *
 * const query: PatchQueryType<PatchKeys, number> = {
 *  op: PatchOperationType.replace,
 *  path: PatchKeys.name,
 *  value: 1
 * }
 * ```
 *
 * @example Usage with `PatchOperationType.remove`
 * Note: Value is not allowed for remove operation
 *
 * ```ts
 * const query: PatchQueryType<string> = {
 *  op: PatchOperationType.remove,
 *  path: 'name'
 * }
 * ```
 */
export type PatchQueryType<T extends string, K = unknown> = {
    /**
     * The path of the json to be patched
     */
    path: T
} & (
    | {
          /**
           * Operation type for patch
           */
          op: PatchOperationType.replace
          /**
           * Corresponding value for the operation
           */
          value: K
      }
    | {
          /**
           * Operation type for patch
           */
          op: PatchOperationType.remove
          value?: never
      }
)

/**
 * Enum for devtron resources
 */
export enum ResourceType {
    devtronApplication = 'application/devtron-application',
    helmChart = 'application/helm-application',
    job = 'job',
    cluster = 'cluster',
    release = 'release',
    releaseTrack = 'release-track',
}

/**
 * Versions support for the resources on BE
 */
export enum ResourceVersionType {
    v1 = 'v1',
}
