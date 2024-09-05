import { GetDeploymentTemplateEditorKeyProps } from './types'

export const getDeploymentTemplateEditorKey = ({
    resolveScopedVariables,
    hideLockedKeys,
    isResolvingVariables,
}: GetDeploymentTemplateEditorKeyProps): string =>
    `${resolveScopedVariables ? 'resolved' : 'unresolved'}-${hideLockedKeys ? 'hide-lock' : 'show-locked'}-${isResolvingVariables ? 'loading' : 'loaded'}-deployment-template`
