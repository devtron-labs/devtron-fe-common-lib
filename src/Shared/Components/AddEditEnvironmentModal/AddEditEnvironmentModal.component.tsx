import { useState } from 'react'
import { toast } from 'react-toastify'
import { saveEnvironment, updateEnvironment, deleteEnvironment } from './service'
import { ReactComponent as Close } from '../../../Assets/Icon/ic-close.svg'
import { ReactComponent as DeleteEnvironment } from '../../../Assets/Icon/ic-delete-interactive.svg'
import { ButtonWithLoader } from '../ButtonWithLoader'
import { CustomInput, DeleteDialog, Progressing, showError, stopPropagation, useForm } from '../../../Common'
import { AddEditEnvironmentModalProps } from './types'

const AddEditEnvironmentModal = ({
    environmentName,
    namespace,
    id,
    clusterId,
    prometheusEndpoint,
    isProduction,
    description,
    reload,
    hideClusterDrawer,
    isVirtual,
    virtualClusterSaveUpdateApi,
}: AddEditEnvironmentModalProps) => {
    const isNamespaceMandatory = !isVirtual

    const [loading, setLoading] = useState(false)

    const getEnvironmentPayload = (stateForPayload) => ({
        id,
        environment_name: stateForPayload.environment_name.value,
        cluster_id: clusterId,
        prometheus_endpoint: prometheusEndpoint,
        namespace: stateForPayload.namespace.value || '',
        active: true,
        default: stateForPayload.isProduction.value === 'true',
        description: stateForPayload.description.value || '',
    })

    const renderVirtualClusterSaveUpdate = (idToUpdate) => {
        if (virtualClusterSaveUpdateApi) {
            return virtualClusterSaveUpdateApi(idToUpdate)
        }

        return null
    }

    const onValidation = async (stateToValidate) => {
        let payload
        let api
        if (isVirtual) {
            payload = {
                id,
                environment_name: stateToValidate.environment_name.value,
                namespace: stateToValidate.namespace.value || '',
                IsVirtualEnvironment: true,
                cluster_id: clusterId,
                description: stateToValidate.description.value || '',
            }
            api = renderVirtualClusterSaveUpdate(id)
        } else {
            payload = getEnvironmentPayload(stateToValidate)
            api = id ? updateEnvironment : saveEnvironment
        }

        try {
            setLoading(true)
            await api(payload, id)
            toast.success(`Successfully ${id ? 'updated' : 'saved'}`)
            reload()
            hideClusterDrawer()
        } catch (err) {
            showError(err)
        } finally {
            setLoading(false)
        }
    }

    const { state, handleOnChange, handleOnSubmit } = useForm(
        {
            environment_name: { value: environmentName, error: '' },
            namespace: { value: namespace, error: '' },
            isProduction: { value: isProduction ? 'true' : 'false', error: '' },
            description: { value: description, error: '' },
        },
        {
            environment_name: {
                required: true,
                validators: [
                    { error: 'Environment name is required', regex: /^.*$/ },
                    { error: "Use only lowercase alphanumeric characters or '-'", regex: /^[a-z0-9-]+$/ },
                    { error: "Cannot start/end with '-'", regex: /^(?![-]).*[^-]$/ },
                    { error: 'Minimum 1 and Maximum 16 characters required', regex: /^.{1,16}$/ },
                ],
            },
            namespace: {
                required: isNamespaceMandatory,
                validators: [
                    { error: 'Namespace is required', regex: /^.*$/ },
                    { error: "Use only lowercase alphanumeric characters or '-'", regex: /^[a-z0-9-]+$/ },
                    { error: "Cannot start/end with '-'", regex: /^(?![-]).*[^-]$/ },
                    { error: 'Maximum 63 characters required', regex: /^.{1,63}$/ },
                ],
            },
            isProduction: {
                required: true,
                validator: { error: 'token is required', regex: /[^]+/ },
            },
            description: {
                required: false,
                validators: [{ error: 'Maximum 40 characters required', regex: /^.{0,40}$/ }],
            },
        },
        // eslint-disable-next-line no-use-before-define
        onValidation,
    )
    const [deleting, setDeleting] = useState(false)
    const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false)

    const closeConfirmationModal = () => {
        setShowConfirmationModal(false)
    }

    const handleDeleteEnvironment = async () => {
        setDeleting(true)
        try {
            await deleteEnvironment(getEnvironmentPayload(state))
            toast.success('Successfully deleted')
            closeConfirmationModal()
            hideClusterDrawer()
            reload()
        } catch (error) {
            showError(error)
        } finally {
            setDeleting(false)
        }
    }

    return (
        <div>
            <div className="bcn-0">
                <div className="flex flex-align-center flex-justify dc__border-bottom bcn-0 pt-12 pr-20 pb-12">
                    <div className="fs-16 fw-6 lh-1-43 ml-20">{id ? 'Edit Environment' : 'Add Environment'}</div>
                    <button
                        type="button"
                        className="dc__transparent flex icon-dim-24"
                        onClick={hideClusterDrawer}
                        aria-label="Close modal"
                    >
                        <Close className="icon-dim-24 dc__align-right cursor" />
                    </button>
                </div>
            </div>
            <div onClick={stopPropagation}>
                <div className="dc__overflow-scroll p-20">
                    <div className="mb-16">
                        <CustomInput
                            dataTestid="environment-name"
                            labelClassName="dc__required-field"
                            disabled={!!environmentName}
                            name="environment_name"
                            placeholder={id ? 'sample-env-name' : 'Eg. production'}
                            value={state.environment_name.value}
                            error={state.environment_name.error}
                            onChange={handleOnChange}
                            label="Environment Name"
                        />
                    </div>
                    <div className="mb-16">
                        <CustomInput
                            dataTestid="enter-namespace"
                            labelClassName={isVirtual ? '' : 'dc__required-field'}
                            disabled={!!namespace}
                            name="namespace"
                            placeholder={id ? 'sample-namespace' : 'Eg. prod'}
                            value={state.namespace.value}
                            error={state.namespace.error}
                            onChange={handleOnChange}
                            label="Namespace"
                        />
                    </div>
                    {!isVirtual && (
                        <div className="mb-16 flex left">
                            <label className="pr-16 flex cursor" htmlFor="is-production-true">
                                <input
                                    data-testid="production"
                                    type="radio"
                                    name="isProduction"
                                    checked={state.isProduction.value === 'true'}
                                    value="true"
                                    onChange={handleOnChange}
                                    id="is-production-true"
                                />
                                <span className="ml-10 fw-4 mt-4 fs-13">Production</span>
                            </label>
                            <label className="flex cursor" htmlFor="is-production-false">
                                <input
                                    data-testid="nonProduction"
                                    type="radio"
                                    name="isProduction"
                                    checked={state.isProduction.value === 'false'}
                                    value="false"
                                    onChange={handleOnChange}
                                    id="is-production-false"
                                />
                                <span className="ml-10 fw-4 mt-4 fs-13">Non - Production</span>
                            </label>
                        </div>
                    )}
                    <div className="mb-16">
                        <CustomInput
                            name="description"
                            placeholder="Add a description for this environment"
                            value={state.description.value}
                            error={state.description.error}
                            onChange={handleOnChange}
                            label="Description (Maximum 40 characters allowed)"
                        />
                    </div>
                </div>
                <div className="w-100 dc__border-top flex right pb-8 pt-8 dc__position-fixed dc__position-abs dc__bottom-0 bcn-0">
                    {!!id && (
                        <button
                            className="cta flex override-button delete scr-5 h-36 ml-20 cluster-delete-icon"
                            type="button"
                            onClick={() => setShowConfirmationModal(true)}
                        >
                            <DeleteEnvironment className="icon-dim-16 mr-8" />
                            {deleting ? <Progressing /> : 'Delete'}
                        </button>
                    )}
                    <button className="cta cancel flex mt-8 mb-8 h-36" type="button" onClick={hideClusterDrawer}>
                        Cancel
                    </button>
                    <ButtonWithLoader
                        rootClassName="cta ml-8 flex mr-20 mt-8 mb-8 h-36"
                        type="submit"
                        disabled={loading}
                        onClick={handleOnSubmit}
                        data-testid="save-and-update-environment"
                        isLoading={loading}
                    >
                        {id ? 'Update' : 'Save'}
                    </ButtonWithLoader>
                </div>

                {showConfirmationModal && (
                    <DeleteDialog
                        title={`Delete environment '${state.environment_name.value}'`}
                        delete={handleDeleteEnvironment}
                        closeDelete={closeConfirmationModal}
                        dataTestId="delete-dialog"
                    >
                        <DeleteDialog.Description>
                            <p>Are you sure you want to delete this environment? </p>
                        </DeleteDialog.Description>
                    </DeleteDialog>
                )}
            </div>
        </div>
    )
}

export default AddEditEnvironmentModal
