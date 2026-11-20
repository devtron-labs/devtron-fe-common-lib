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

import { useMemo } from 'react'

import { ComponentSizeType } from '@Shared/constants'

import { SelectPicker, SelectPickerOptionType } from '../SelectPicker'
import { NOTIFICATION_EMAIL_AGENT_DEST_ORDER } from './constants'
import { NotificationEmailAgentSelectProps } from './types'
import { getNotificationChannelGroupedOptions, getNotificationChannelKey } from './utils'

/**
 * Picks the SES or SMTP account that typed email addresses are delivered
 * through. An address on its own is not a destination — the account supplies
 * the credentials and the from-address.
 *
 * The CI/CD flow splits this into an SES/SMTP radio plus an account dropdown;
 * one grouped list says the same thing in a single control.
 */
const NotificationEmailAgentSelect = ({
    value,
    onChange,
    options,
    isLoading,
    optionListError,
    reloadOptionList,
    required = true,
    error,
    label = 'Send emails using',
    placeholder = 'Select an email account',
    helperText = 'Email addresses entered above are sent through this account.',
    inputId = 'notification-email-agent-select',
}: NotificationEmailAgentSelectProps) => {
    const emailConfigs = useMemo(
        () => options.filter(({ dest }) => NOTIFICATION_EMAIL_AGENT_DEST_ORDER.includes(dest)),
        [options],
    )

    const groupedOptions = useMemo(
        () => getNotificationChannelGroupedOptions(emailConfigs, NOTIFICATION_EMAIL_AGENT_DEST_ORDER),
        [emailConfigs],
    )

    const configByKey = useMemo(
        () => new Map(emailConfigs.map((config) => [getNotificationChannelKey(config), config])),
        [emailConfigs],
    )

    const selectedOption = useMemo(() => {
        if (!value) {
            return null
        }

        const key = getNotificationChannelKey(value)

        return { label: configByKey.get(key)?.name ?? value.name, value: key }
    }, [value, configByKey])

    const handleChange = (selected: SelectPickerOptionType<string>) => {
        const config = configByKey.get(selected?.value)

        if (config) {
            onChange(config)
        }
    }

    return (
        <SelectPicker<string, false>
            inputId={inputId}
            label={label}
            placeholder={placeholder}
            helperText={helperText}
            required={required}
            error={error}
            options={groupedOptions}
            value={selectedOption}
            onChange={handleChange}
            isLoading={isLoading}
            optionListError={optionListError}
            reloadOptionList={reloadOptionList}
            size={ComponentSizeType.large}
            fullWidth
        />
    )
}

export default NotificationEmailAgentSelect
