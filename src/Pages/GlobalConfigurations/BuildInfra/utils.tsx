import { FormEvent, cloneElement, useEffect, useState } from 'react'
import { components } from 'react-select'
import { toast } from 'react-toastify'
import { showError, useAsync } from '../../../Common'
import { getBuildInfraProfileByName, createBuildInfraProfile, updateBuildInfraProfile } from './services'
import {
    BuildInfraConfigTypes,
    BuildInfraInheritActions,
    BuildInfraMetaConfigTypes,
    BuildInfraProfileData,
    HandleProfileInputChangeType,
    ProfileInputErrorType,
    UseBuildInfraFormProps,
    UseBuildInfraFormResponseType,
    ValidateRequestLimitResponseType,
    ValidateRequestLimitType,
} from './types'
import { BUILD_INFRA_TEXT, DEFAULT_PROFILE_NAME, PROFILE_INPUT_ERROR_FIELDS, REQUIRED_INPUT_FIELDS } from './constants'
import {
    validateDescription,
    validateName,
    validateRequiredPositiveNumber,
    getCommonSelectStyle,
} from '../../../Shared'

export const validateRequestLimit = ({
    request,
    limit,
    unitsMap,
}: ValidateRequestLimitType): ValidateRequestLimitResponseType => {
    // Request <= Limit
    // Request and Limit should be numbers can be decimals
    // Request and Limit should be positive numbers
    // Both request and limit should be there
    const requestNumber = Number(request.value)
    const limitNumber = Number(limit.value)
    const requestUnit = Number(unitsMap[request.unit].conversionFactor)
    const limitUnit = Number(unitsMap[limit.unit].conversionFactor)

    const requestLimitValidationResponse: ValidateRequestLimitResponseType = {
        request: {
            isValid: true,
        },
        limit: {
            isValid: true,
        },
    }

    const isRequestValidNumber = validateRequiredPositiveNumber(request.value).isValid
    const isLimitValidNumber = validateRequiredPositiveNumber(limit.value).isValid

    if (!isRequestValidNumber) {
        requestLimitValidationResponse.request = {
            message: BUILD_INFRA_TEXT.VALIDATE_REQUEST_LIMIT.NEGATIVE_REQUEST,
            isValid: false,
        }
    }

    if (!isLimitValidNumber) {
        requestLimitValidationResponse.limit = {
            message: BUILD_INFRA_TEXT.VALIDATE_REQUEST_LIMIT.NEGATIVE_LIMIT,
            isValid: false,
        }
    }

    if (!isRequestValidNumber || !isLimitValidNumber) {
        return requestLimitValidationResponse
    }

    // TODO: Validation for big numbers
    const isSafeRequestNumber = requestNumber * requestUnit < Number.MAX_SAFE_INTEGER
    const isSafeLimitNumber = limitNumber * limitUnit < Number.MAX_SAFE_INTEGER

    if (!isSafeRequestNumber) {
        requestLimitValidationResponse.request = {
            message: BUILD_INFRA_TEXT.VALIDATE_REQUEST_LIMIT.REQUEST_TOO_BIG,
            isValid: false,
        }
    }

    if (!isSafeLimitNumber) {
        requestLimitValidationResponse.limit = {
            message: BUILD_INFRA_TEXT.VALIDATE_REQUEST_LIMIT.LIMIT_TOO_BIG,
            isValid: false,
        }
    }

    if (requestNumber * requestUnit > limitNumber * limitUnit) {
        requestLimitValidationResponse.request = {
            message: BUILD_INFRA_TEXT.VALIDATE_REQUEST_LIMIT.REQUEST_LESS_THAN_LIMIT,
            isValid: false,
        }
    }

    return requestLimitValidationResponse
}

const getInitialProfileInputErrors = (fromCreateView: boolean): ProfileInputErrorType => {
    if (fromCreateView) {
        const initialProfileInputErrors = { ...PROFILE_INPUT_ERROR_FIELDS }
        REQUIRED_INPUT_FIELDS.forEach((field) => {
            initialProfileInputErrors[field] = ''
        })
        return initialProfileInputErrors
    }

    return {
        ...PROFILE_INPUT_ERROR_FIELDS,
    }
}

export const useBuildInfraForm = ({
    name,
    editProfile,
    handleSuccessRedirection,
}: UseBuildInfraFormProps): UseBuildInfraFormResponseType => {
    const fromCreateView = !name

    const [isLoading, profileResponse, responseError, reloadRequest] = useAsync(
        () =>
            getBuildInfraProfileByName({
                name: name ?? DEFAULT_PROFILE_NAME,
                fromCreateView,
            }),
        [name],
    )
    // If configuration is existing and is active then use it else use default from profileResponse
    const [profileInput, setProfileInput] = useState<BuildInfraProfileData>(null)
    const [profileInputErrors, setProfileInputErrors] = useState<ProfileInputErrorType>({
        ...PROFILE_INPUT_ERROR_FIELDS,
    })
    const [loadingActionRequest, setLoadingActionRequest] = useState<boolean>(false)

    useEffect(() => {
        if (!isLoading && profileResponse?.configurationUnits && profileResponse?.profile) {
            setProfileInput({
                ...profileResponse.profile,
            })

            setProfileInputErrors(getInitialProfileInputErrors(fromCreateView))
        }
    }, [profileResponse, isLoading])

    const handleProfileInputChange = ({ action, data }: HandleProfileInputChangeType) => {
        const currentInput = { ...profileInput }
        const currentInputErrors = { ...profileInputErrors }
        const lastSavedConfiguration = profileResponse.profile.configurations
        const currentConfiguration = currentInput.configurations
        const { value, unit } = data ?? { value: null, unit: null }

        switch (action) {
            case BuildInfraMetaConfigTypes.DESCRIPTION:
                currentInput.description = value
                currentInputErrors.description = validateDescription(value).message
                break

            case BuildInfraMetaConfigTypes.NAME:
                currentInput.name = value
                currentInputErrors.name = validateName(value).message
                break

            case BuildInfraConfigTypes.CPU_LIMIT: {
                currentConfiguration[BuildInfraConfigTypes.CPU_LIMIT] = {
                    ...currentConfiguration[BuildInfraConfigTypes.CPU_LIMIT],
                    value,
                    unit,
                }
                const { request, limit } = validateRequestLimit({
                    request: {
                        value: currentConfiguration[BuildInfraConfigTypes.CPU_REQUEST].value,
                        unit: currentConfiguration[BuildInfraConfigTypes.CPU_REQUEST].unit,
                    },
                    limit: {
                        value,
                        unit,
                    },
                    unitsMap: profileResponse.configurationUnits[BuildInfraConfigTypes.CPU_LIMIT],
                })
                currentInputErrors[BuildInfraConfigTypes.CPU_LIMIT] = limit.message
                currentInputErrors[BuildInfraConfigTypes.CPU_REQUEST] = request.message
                break
            }
            case BuildInfraConfigTypes.CPU_REQUEST: {
                currentConfiguration[BuildInfraConfigTypes.CPU_REQUEST] = {
                    ...currentConfiguration[BuildInfraConfigTypes.CPU_REQUEST],
                    value,
                    unit,
                }
                const { request, limit } = validateRequestLimit({
                    request: {
                        value,
                        unit,
                    },
                    limit: {
                        value: currentConfiguration[BuildInfraConfigTypes.CPU_LIMIT].value,
                        unit: currentConfiguration[BuildInfraConfigTypes.CPU_LIMIT].unit,
                    },
                    unitsMap: profileResponse.configurationUnits[BuildInfraConfigTypes.CPU_LIMIT],
                })
                currentInputErrors[BuildInfraConfigTypes.CPU_LIMIT] = limit.message
                currentInputErrors[BuildInfraConfigTypes.CPU_REQUEST] = request.message
                break
            }

            case BuildInfraConfigTypes.MEMORY_LIMIT: {
                currentConfiguration[BuildInfraConfigTypes.MEMORY_LIMIT] = {
                    ...currentConfiguration[BuildInfraConfigTypes.MEMORY_LIMIT],
                    value,
                    unit,
                }
                const { request, limit } = validateRequestLimit({
                    request: {
                        value: currentConfiguration[BuildInfraConfigTypes.MEMORY_REQUEST].value,
                        unit: currentConfiguration[BuildInfraConfigTypes.MEMORY_REQUEST].unit,
                    },
                    limit: {
                        value,
                        unit,
                    },
                    unitsMap: profileResponse.configurationUnits[BuildInfraConfigTypes.MEMORY_LIMIT],
                })
                currentInputErrors[BuildInfraConfigTypes.MEMORY_LIMIT] = limit.message
                currentInputErrors[BuildInfraConfigTypes.MEMORY_REQUEST] = request.message
                break
            }

            case BuildInfraConfigTypes.MEMORY_REQUEST: {
                currentConfiguration[BuildInfraConfigTypes.MEMORY_REQUEST] = {
                    ...currentConfiguration[BuildInfraConfigTypes.MEMORY_REQUEST],
                    value,
                    unit,
                }
                const { request, limit } = validateRequestLimit({
                    request: {
                        value,
                        unit,
                    },
                    limit: {
                        value: currentConfiguration[BuildInfraConfigTypes.MEMORY_LIMIT].value,
                        unit: currentConfiguration[BuildInfraConfigTypes.MEMORY_LIMIT].unit,
                    },
                    unitsMap: profileResponse.configurationUnits[BuildInfraConfigTypes.MEMORY_LIMIT],
                })
                currentInputErrors[BuildInfraConfigTypes.MEMORY_LIMIT] = limit.message
                currentInputErrors[BuildInfraConfigTypes.MEMORY_REQUEST] = request.message
                break
            }

            case BuildInfraConfigTypes.BUILD_TIMEOUT: {
                currentConfiguration[BuildInfraConfigTypes.BUILD_TIMEOUT] = {
                    ...currentConfiguration[BuildInfraConfigTypes.BUILD_TIMEOUT],
                    value,
                    unit,
                }

                currentInputErrors[BuildInfraConfigTypes.BUILD_TIMEOUT] = validateRequiredPositiveNumber(value).message
                break
            }

            case BuildInfraInheritActions.ACTIVATE_CPU:
                currentConfiguration[BuildInfraConfigTypes.CPU_LIMIT] = {
                    ...lastSavedConfiguration[BuildInfraConfigTypes.CPU_LIMIT],
                    value: lastSavedConfiguration[BuildInfraConfigTypes.CPU_LIMIT].value,
                    unit: lastSavedConfiguration[BuildInfraConfigTypes.CPU_LIMIT].unit,
                    active: true,
                }
                currentConfiguration[BuildInfraConfigTypes.CPU_REQUEST] = {
                    ...lastSavedConfiguration[BuildInfraConfigTypes.CPU_REQUEST],
                    value: lastSavedConfiguration[BuildInfraConfigTypes.CPU_REQUEST].value,
                    unit: lastSavedConfiguration[BuildInfraConfigTypes.CPU_REQUEST].unit,
                    active: true,
                }

                currentInputErrors[BuildInfraConfigTypes.CPU_LIMIT] = null
                currentInputErrors[BuildInfraConfigTypes.CPU_REQUEST] = null
                break

            case BuildInfraInheritActions.ACTIVATE_MEMORY:
                currentConfiguration[BuildInfraConfigTypes.MEMORY_LIMIT] = {
                    ...lastSavedConfiguration[BuildInfraConfigTypes.MEMORY_LIMIT],
                    value: lastSavedConfiguration[BuildInfraConfigTypes.MEMORY_LIMIT].value,
                    unit: lastSavedConfiguration[BuildInfraConfigTypes.MEMORY_LIMIT].unit,
                    active: true,
                }
                currentConfiguration[BuildInfraConfigTypes.MEMORY_REQUEST] = {
                    ...lastSavedConfiguration[BuildInfraConfigTypes.MEMORY_REQUEST],
                    value: lastSavedConfiguration[BuildInfraConfigTypes.MEMORY_REQUEST].value,
                    unit: lastSavedConfiguration[BuildInfraConfigTypes.MEMORY_REQUEST].unit,
                    active: true,
                }
                currentInputErrors[BuildInfraConfigTypes.MEMORY_LIMIT] = null
                currentInputErrors[BuildInfraConfigTypes.MEMORY_REQUEST] = null
                break

            case BuildInfraInheritActions.ACTIVATE_BUILD_TIMEOUT:
                currentConfiguration[BuildInfraConfigTypes.BUILD_TIMEOUT] = {
                    ...lastSavedConfiguration[BuildInfraConfigTypes.BUILD_TIMEOUT],
                    value: lastSavedConfiguration[BuildInfraConfigTypes.BUILD_TIMEOUT].value,
                    unit: lastSavedConfiguration[BuildInfraConfigTypes.BUILD_TIMEOUT].unit,
                    active: true,
                }
                currentInputErrors[BuildInfraConfigTypes.BUILD_TIMEOUT] = null
                break

            case BuildInfraInheritActions.DE_ACTIVATE_BUILD_TIMEOUT:
                // Reverting the value and unit to defaultValues
                currentConfiguration[BuildInfraConfigTypes.BUILD_TIMEOUT] = {
                    ...currentConfiguration[BuildInfraConfigTypes.BUILD_TIMEOUT],
                    value: lastSavedConfiguration[BuildInfraConfigTypes.BUILD_TIMEOUT].defaultValue.value,
                    unit: lastSavedConfiguration[BuildInfraConfigTypes.BUILD_TIMEOUT].defaultValue.unit,
                    active: false,
                }
                currentInputErrors[BuildInfraConfigTypes.BUILD_TIMEOUT] = null
                break

            case BuildInfraInheritActions.DE_ACTIVATE_CPU:
                currentConfiguration[BuildInfraConfigTypes.CPU_LIMIT] = {
                    ...currentConfiguration[BuildInfraConfigTypes.CPU_LIMIT],
                    value: lastSavedConfiguration[BuildInfraConfigTypes.CPU_LIMIT].defaultValue.value,
                    unit: lastSavedConfiguration[BuildInfraConfigTypes.CPU_LIMIT].defaultValue.unit,
                    active: false,
                }
                currentConfiguration[BuildInfraConfigTypes.CPU_REQUEST] = {
                    ...currentConfiguration[BuildInfraConfigTypes.CPU_REQUEST],
                    value: lastSavedConfiguration[BuildInfraConfigTypes.CPU_REQUEST].defaultValue.value,
                    unit: lastSavedConfiguration[BuildInfraConfigTypes.CPU_REQUEST].defaultValue.unit,
                    active: false,
                }
                currentInputErrors[BuildInfraConfigTypes.CPU_LIMIT] = null
                currentInputErrors[BuildInfraConfigTypes.CPU_REQUEST] = null
                break

            case BuildInfraInheritActions.DE_ACTIVATE_MEMORY:
                currentConfiguration[BuildInfraConfigTypes.MEMORY_LIMIT] = {
                    ...currentConfiguration[BuildInfraConfigTypes.MEMORY_LIMIT],
                    value: lastSavedConfiguration[BuildInfraConfigTypes.MEMORY_LIMIT].defaultValue.value,
                    unit: lastSavedConfiguration[BuildInfraConfigTypes.MEMORY_LIMIT].defaultValue.unit,
                    active: false,
                }
                currentConfiguration[BuildInfraConfigTypes.MEMORY_REQUEST] = {
                    ...currentConfiguration[BuildInfraConfigTypes.MEMORY_REQUEST],
                    value: lastSavedConfiguration[BuildInfraConfigTypes.MEMORY_REQUEST].defaultValue.value,
                    unit: lastSavedConfiguration[BuildInfraConfigTypes.MEMORY_REQUEST].defaultValue.unit,
                    active: false,
                }
                currentInputErrors[BuildInfraConfigTypes.MEMORY_LIMIT] = null
                currentInputErrors[BuildInfraConfigTypes.MEMORY_REQUEST] = null
                break

            default:
                throw new Error(BUILD_INFRA_TEXT.getInvalidActionMessage(action))
        }

        setProfileInput(currentInput)
        setProfileInputErrors(currentInputErrors)
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoadingActionRequest(true)
        try {
            if (editProfile) {
                await updateBuildInfraProfile({ name, profileInput })
            } else {
                await createBuildInfraProfile({ profileInput })
            }
            setLoadingActionRequest(false)
            toast.success(BUILD_INFRA_TEXT.getSubmitSuccessMessage(profileInput.name, editProfile))

            if (handleSuccessRedirection) {
                handleSuccessRedirection()
            } else {
                reloadRequest()
            }
        } catch (err) {
            showError(err)
            setLoadingActionRequest(false)
        }
    }

    return {
        isLoading,
        profileResponse,
        responseError,
        reloadRequest,
        profileInput,
        profileInputErrors,
        handleProfileInputChange,
        loadingActionRequest,
        handleSubmit,
    }
}

const getOptionBackgroundColor = (isFocused: boolean, isSelected: boolean): string => {
    if (isSelected) {
        return 'var(--B100)'
    }

    if (isFocused) {
        return 'var(--N50)'
    }
    return 'var(--white)'
}

export const unitSelectorStyles = () =>
    getCommonSelectStyle({
        menuList: (base) => ({
            ...base,
            position: 'relative',
            paddingTop: 0,
            paddingBottom: '4px',
            width: '124px',
            maxHeight: '250px',
            cursor: 'pointer',
        }),
        control: (base) => ({
            ...base,
            borderRadius: 0,
            backgroundColor: 'var(--N0)',
            borderLeft: '1px solid var(--N200)',
            gap: '8px',
            padding: '0 8px',
            alignItems: 'center',
            cursor: 'pointer',
            borderTopRightRadius: '4px',
            borderBottomRightRadius: '4px',
        }),
        indicatorContainer: (base) => ({
            ...base,
            padding: '0px',
        }),
        dropdownIndicator: (base, state) => ({
            ...base,
            color: 'var(--N600)',
            transition: 'all .2s ease',
            transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        }),
        option: (base, state) => ({
            ...base,
            padding: '4px 12px',
            backgroundColor: getOptionBackgroundColor(state.isFocused, state.isSelected),
            color: 'var(--N900)',
            cursor: 'pointer',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            height: '36px',
        }),
        valueContainer: (base) => ({
            ...base,
            padding: '2px 0px 2px 8px',
            display: 'flex',
            height: '36px',
        }),
    })

// Export options with Tippy

// TODO: ADD Tippy
export const UnitSelectorValueContainer = ({ selectProps, children, ...restProps }: any) => {
    const valueContainerProps = {
        selectProps,
        children,
        ...restProps,
    }

    return (
        <components.ValueContainer {...valueContainerProps}>
            <span className="cn-9 fs-13 dc__ellipsis-right m-0 flex dc__align-items-center">
                {selectProps?.value?.label}
            </span>
            {cloneElement(children[1])}
        </components.ValueContainer>
    )
}
