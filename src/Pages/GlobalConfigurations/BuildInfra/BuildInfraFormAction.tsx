import { FormEvent, FunctionComponent, useMemo } from 'react'
import ReactSelect from 'react-select'
import { BuildInfraFormActionProps } from './types'
import { OptionType } from '../../../Common'
import { unitSelectorStyles } from './utils'
import { BUILD_INFRA_INPUT_CONSTRAINTS } from './constants'
import { ReactComponent as ErrorIcon } from '../../../Assets/Icon/ic-warning.svg'

/**
 * In case need arise for variants break this CustomInput and Select as a separate component
 */
const BuildInfraFormAction: FunctionComponent<BuildInfraFormActionProps> = ({
    actionType,
    label,
    placeholder,
    error,
    isRequired,
    profileUnitsMap,
    handleProfileInputChange,
    currentUnitName,
    currentValue,
}) => {
    const handleUnitChange = (selectedUnit: OptionType) => {
        const data = {
            unit: selectedUnit.label,
            value: currentValue,
        }
        handleProfileInputChange({ action: actionType, data })
    }

    const handleInputChange = (e: FormEvent<HTMLInputElement>) => {
        const data = {
            unit: currentUnitName,
            value: e.currentTarget.value,
        }
        handleProfileInputChange({ action: actionType, data })
    }

    // would also sort the units in order of conversionFactor
    const { unitOptions, currentUnit } = useMemo(() => {
        const units =
            Object.values(profileUnitsMap)?.map((unit) => ({
                label: unit.name,
                value: String(unit.conversionFactor),
            })) ?? []

        const _currentUnit = units.find((unit) => unit.label === currentUnitName)
        return { unitOptions: units.sort((a, b) => Number(a.value) - Number(b.value)), currentUnit: _currentUnit }
    }, [profileUnitsMap])

    return (
        <div className="flexbox-col dc__gap-4 dc__mxw-420 w-100 dc__align-start">
            <label
                htmlFor={`${actionType}-input`}
                className={`fs-13 fw-4 lh-20 cn-7 ${isRequired ? 'dc__required-field' : ''}`}
            >
                {label}
            </label>
            <div className="w-100 flexbox dc__align-items-center">
                <div className="flex-grow-1">
                    <input
                        data-testid={actionType}
                        name={actionType}
                        type="number"
                        step={BUILD_INFRA_INPUT_CONSTRAINTS.STEP}
                        min={BUILD_INFRA_INPUT_CONSTRAINTS.MIN}
                        className="form__input dc__no-right-border dc__no-right-radius"
                        placeholder={placeholder}
                        value={currentValue}
                        onChange={handleInputChange}
                        required={isRequired}
                        autoComplete="off"
                        id={`${actionType}-input`}
                    />
                </div>

                {profileUnitsMap && (
                    <ReactSelect
                        name={`${actionType}-unit`}
                        className="bcn-0 dc__mxw-120"
                        options={unitOptions}
                        value={currentUnit}
                        onChange={handleUnitChange}
                        isSearchable={false}
                        components={{
                            IndicatorSeparator: null,
                            ClearIndicator: null,
                        }}
                        styles={unitSelectorStyles()}
                    />
                )}
            </div>

            {error && (
                <div className="form__error">
                    <ErrorIcon className="form__icon form__icon--error" />
                    {error}
                </div>
            )}
        </div>
    )
}

export default BuildInfraFormAction
