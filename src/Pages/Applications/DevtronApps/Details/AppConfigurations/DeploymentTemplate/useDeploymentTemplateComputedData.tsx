import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { BaseURLParams } from '@Shared/types'
import { UseDeploymentTemplateComputedDataProps, UseDeploymentTemplateComputedDataReturnType } from './types'
import { getResolvedDeploymentTemplate } from './service'
import { useDeploymentTemplateContext } from './DeploymentTemplateProvider'

// FIXME: Look if dependency is required
const useDeploymentTemplateComputedData = ({
    resolveScopedVariables,
}: UseDeploymentTemplateComputedDataProps): UseDeploymentTemplateComputedDataReturnType => {
    const {
        state: { editorTemplate, originalTemplate, selectedChartRefId },
        handleDisableResolveScopedVariables,
    } = useDeploymentTemplateContext()

    const { appId, envId } = useParams<Pick<BaseURLParams, 'appId' | 'envId'>>()
    const [resolvedEditorTemplate, setResolvedEditorTemplate] = useState<string>('')
    const [resolvedOriginalTemplate, setResolvedOriginalTemplate] = useState<string>('')
    const [isResolvingVariables, setIsResolvingVariables] = useState<boolean>(false)

    const handleFetchResolvedData = async (value: string): ReturnType<typeof getResolvedDeploymentTemplate> => {
        const resolvedData = await getResolvedDeploymentTemplate({
            appId: +appId,
            chartRefId: selectedChartRefId,
            values: value,
            valuesAndManifestFlag: null,
            ...(envId && { envId: +envId }),
        })
        return resolvedData
    }

    const handleGetResolvedData = async () => {
        try {
            setIsResolvingVariables(true)
            const [resolvedEditorTemplateResponse, resolvedOriginalTemplateResponse] = await Promise.all([
                handleFetchResolvedData(editorTemplate),
                // Since compare mode is not in use, we are passing the original template as it is without defaultEnvId
                handleFetchResolvedData(originalTemplate),
            ])

            if (!resolvedEditorTemplateResponse.areVariablesPresent) {
                handleDisableResolveScopedVariables()
                return
            }

            setResolvedEditorTemplate(resolvedEditorTemplateResponse.resolvedData)
            setResolvedOriginalTemplate(resolvedOriginalTemplateResponse.resolvedData)
        } catch {
            // Do nothing
            handleDisableResolveScopedVariables()
        } finally {
            setIsResolvingVariables(false)
        }
    }

    useEffect(() => {
        if (resolveScopedVariables) {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            handleGetResolvedData()
        }
    }, [resolveScopedVariables, appId, envId])

    const editedDocument = resolveScopedVariables ? resolvedEditorTemplate : editorTemplate
    const uneditedDocument = resolveScopedVariables ? resolvedOriginalTemplate : originalTemplate

    return {
        editedDocument,
        uneditedDocument,
        isResolvingVariables,
    }
}

export default useDeploymentTemplateComputedData
