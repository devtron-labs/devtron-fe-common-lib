/*
 * Copyright (c) 2024. Devtron Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { FormEvent, FunctionComponent, useMemo } from 'react'

import { ReactComponent as ErrorIcon } from '@Icons/ic-warning.svg'
import { SelectPicker } from '@Shared/Components/SelectPicker'
import { ComponentSizeType } from '@Shared/constants'
import { isNullOrUndefined } from '@Shared/Helpers'

import { OptionType } from '../../../Common'
import { BUILD_INFRA_DEFAULT_PLATFORM_NAME, BUILD_INFRA_INPUT_CONSTRAINTS } from './constants'
import { BuildInfraFormActionProps } from './types'

import './BuildInfraUnitSelect.scss'

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
    targetPlatform = BUILD_INFRA_DEFAULT_PLATFORM_NAME,
    isDisabled = false,
    autoFocus = false,
}) => {
    const handleProfileChangeWrapper = (data: { unit: string; value: number }) => {
        handleProfileInputChange({
            action: actionType,
            data: {
                targetPlatform,
                ...data,
            },
        })
    }

    const handleUnitChange = (selectedUnit: OptionType) => {
        const data = {
            unit: selectedUnit.label,
            value: isNullOrUndefined(currentValue) ? currentValue : +currentValue,
        }

        handleProfileChangeWrapper(data)
    }

    const handleInputChange = (e: FormEvent<HTMLInputElement>) => {
        const data = {
            unit: currentUnitName,
            value: e.currentTarget.value === '' ? null : +e.currentTarget.value,
        }

        handleProfileChangeWrapper(data)
    }

    const unitOptions = useMemo(() => {
        const units =
            Object.values(profileUnitsMap)?.map((unit) => ({
                label: unit.name,
                value: String(unit.conversionFactor),
            })) ?? []
        return units.sort((a, b) => Number(a.value) - Number(b.value))
    }, [profileUnitsMap])

    const currentUnit = useMemo(
        () => unitOptions.find((unit) => unit.label === currentUnitName),
        [unitOptions, currentUnitName],
    )

    return (
        <div className="flexbox-col dc__gap-4 dc__mxw-420 w-100 dc__align-start">
            {label && (
                <label
                    htmlFor={`${actionType}-input`}
                    className={`fs-13 fw-4 lh-20 cn-7 ${isRequired ? 'dc__required-field' : ''}`}
                >
                    {label}
                </label>
            )}

            <div className="w-100 flexbox dc__align-items-center">
                <div className="flex-grow-1">
                    <input
                        data-testid={`${actionType}-input-field`}
                        name={actionType}
                        type="number"
                        step={BUILD_INFRA_INPUT_CONSTRAINTS.STEP}
                        min={BUILD_INFRA_INPUT_CONSTRAINTS.MIN}
                        className={`form__input dc__no-right-border dc__no-right-radius ${isDisabled ? 'dc__disabled' : ''}`}
                        placeholder={placeholder}
                        value={isNullOrUndefined(currentValue) ? '' : currentValue}
                        onChange={handleInputChange}
                        required={isRequired}
                        autoComplete="off"
                        disabled={isDisabled}
                        id={`${actionType}-input`}
                        // eslint-disable-next-line jsx-a11y/no-autofocus
                        autoFocus={autoFocus}
                    />
                </div>

                {profileUnitsMap && (
                    <SelectPicker
                        inputId={`${actionType}-unit`}
                        classNamePrefix="build-infra-unit-select"
                        name={`${actionType}-unit`}
                        options={unitOptions}
                        value={currentUnit}
                        onChange={handleUnitChange}
                        isSearchable={false}
                        size={ComponentSizeType.large}
                        menuSize={ComponentSizeType.small}
                        isDisabled={isDisabled}
                        shouldMenuAlignRight
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
