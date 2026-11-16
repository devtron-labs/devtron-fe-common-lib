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

import { useMemo, useState } from 'react'

import { ComponentSizeType } from '@Shared/constants'
import { validateEmail } from '@Shared/validations'

import { SelectPicker, SelectPickerOptionType } from '../SelectPicker'
import { NOTIFICATION_EMAIL_RECIPIENT_KEY_PREFIX, NOTIFICATION_NON_EMAIL_DEST_ORDER } from './constants'
import { NotificationChannelSelectProps } from './types'
import {
    getNotificationChannelGroupedOptions,
    getNotificationChannelKey,
    getNotificationDestinationKey,
    isNotificationEmailRecipient,
} from './utils'

/**
 * Multi-select over every configured notification destination (Slack, Webhook,
 * SES, SMTP), grouped by provider. With `allowEmailRecipients`, a valid email
 * address can also be typed in, mirroring the CI/CD notification flow.
 *
 * Lives here rather than in a consumer so both the dashboard's CI/CD flow and
 * the enterprise audit log flow can share one picker — the enterprise library
 * cannot import dashboard code.
 */
const NotificationChannelSelect = ({
    value,
    onChange,
    options,
    isLoading,
    optionListError,
    reloadOptionList,
    required,
    error,
    allowEmailRecipients = false,
    label = 'Send notification to',
    placeholder = allowEmailRecipients ? 'Select a channel or type an email address' : 'Select a destination',
    inputId = 'notification-channel-select',
}: NotificationChannelSelectProps) => {
    // Typing is validated on create, so the message belongs to the input rather
    // than to the form as a whole
    const [emailError, setEmailError] = useState<string>('')

    const groupedOptions = useMemo(
        () =>
            getNotificationChannelGroupedOptions(
                options,
                allowEmailRecipients ? NOTIFICATION_NON_EMAIL_DEST_ORDER : undefined,
            ),
        [options, allowEmailRecipients],
    )

    // Keyed by `dest-configId` so a selection can be mapped back to its full config
    const configByKey = useMemo(
        () => new Map(options.map((config) => [getNotificationChannelKey(config), config])),
        [options],
    )

    const selectedOptions = useMemo(
        () =>
            value
                .map((destination) => {
                    if (isNotificationEmailRecipient(destination)) {
                        return { label: destination.recipient, value: getNotificationDestinationKey(destination) }
                    }

                    const key = getNotificationChannelKey(destination)
                    const matchedConfig = configByKey.get(key)

                    return { label: matchedConfig?.name ?? destination.name, value: key }
                })
                .filter(({ label: optionLabel }) => !!optionLabel),
        [value, configByKey],
    )

    const handleChange = (selected: readonly SelectPickerOptionType<string>[]) => {
        setEmailError('')
        onChange(
            (selected ?? [])
                .map(({ value: key }) =>
                    key.startsWith(NOTIFICATION_EMAIL_RECIPIENT_KEY_PREFIX)
                        ? { recipient: key.slice(NOTIFICATION_EMAIL_RECIPIENT_KEY_PREFIX.length) }
                        : configByKey.get(key),
                )
                .filter(Boolean),
        )
    }

    const handleCreateOption = (inputValue: string) => {
        const { isValid, message } = validateEmail(inputValue)

        if (!isValid) {
            setEmailError(message)
            return
        }

        setEmailError('')

        // The create option stays on offer for an address already added, since
        // the option values are prefixed and so never match the raw input
        if (
            value.some(
                (destination) => isNotificationEmailRecipient(destination) && destination.recipient === inputValue,
            )
        ) {
            return
        }

        onChange([...value, { recipient: inputValue }])
    }

    return (
        <SelectPicker<string, true>
            inputId={inputId}
            label={label}
            placeholder={placeholder}
            isMulti
            required={required}
            error={error || emailError}
            options={groupedOptions}
            value={selectedOptions}
            onChange={handleChange}
            isLoading={isLoading}
            optionListError={optionListError}
            reloadOptionList={reloadOptionList}
            size={ComponentSizeType.large}
            closeMenuOnSelect={false}
            showSelectedOptionIcon={false}
            fullWidth
            isCreatable={allowEmailRecipients}
            {...(allowEmailRecipients
                ? {
                      onCreateOption: handleCreateOption,
                      formatCreateLabel: (inputValue: string) => `Send to email: ${inputValue}`,
                  }
                : {})}
        />
    )
}

export default NotificationChannelSelect
