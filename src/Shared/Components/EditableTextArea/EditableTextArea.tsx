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

import { useState } from 'react'
import { ComponentSizeType } from '@Shared/constants'
import { ReactComponent as EditIcon } from '../../../Assets/Icon/ic-pencil.svg'
import type { EditableTextAreaProps, Error } from './types'
import { Textarea } from '../Textarea'
import { Button, ButtonStyleType, ButtonVariantType } from '../Button'

const TextArea = (
    props: Omit<EditableTextAreaProps, 'emptyState'> & {
        setIsEditable: (boolean) => void
    },
) => {
    const { placeholder, initialText, setIsEditable, updateContent, validations } = props
    const [text, setText] = useState<EditableTextAreaProps['initialText']>(initialText)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error>({ isValid: true, message: '' })

    const handleCancelEdit = () => {
        setText(initialText)
        setIsEditable(false)
    }

    const handleSaveContent = () => {
        setIsLoading(true)
        updateContent(text.trim())
            .then(() => {
                setIsEditable(false)
                setIsLoading(false)
            })
            .catch(() => {
                // keep editable true
                setIsLoading(false)
            })
    }

    const validateInput = (value: string): Error => {
        if (validations) {
            const trimmedValue = value.trim()
            const { maxLength } = validations

            if (!!maxLength && trimmedValue.length > maxLength.value) {
                return {
                    isValid: false,
                    message: maxLength.message,
                }
            }
        }
        return {
            isValid: true,
            message: '',
        }
    }

    const handleChange = (e) => {
        const value = e.target.value ?? ''
        setText(value)
        setError(validateInput(value))
    }

    return (
        <div className="flexbox-col flex-grow-1 dc__gap-12">
            <Textarea
                placeholder={placeholder}
                value={text}
                onChange={handleChange}
                name="editable-description"
                error={!error.isValid && error.message}
            />
            <div className="flex dc__gap-12 ml-auto">
                <Button
                    size={ComponentSizeType.small}
                    style={ButtonStyleType.neutral}
                    variant={ButtonVariantType.secondary}
                    disabled={isLoading}
                    onClick={handleCancelEdit}
                    text="Cancel"
                    dataTestId="cancel-edit-text-area"
                />
                <Button
                    size={ComponentSizeType.small}
                    onClick={handleSaveContent}
                    disabled={!error.isValid}
                    isLoading={isLoading}
                    text="Save"
                    dataTestId="save-edit-text-area"
                />
            </div>
        </div>
    )
}

const EditableTextArea = (props: EditableTextAreaProps) => {
    const { initialText = '', emptyState, ...rest } = props
    const [isEditable, setIsEditable] = useState<boolean>(false)

    if (isEditable) {
        return <TextArea {...rest} initialText={initialText} setIsEditable={setIsEditable} />
    }
    return (
        <div className="flexbox flex-justify dc__gap-10">
            <div className="fs-13 fw-4 lh-20 cn-9 dc__word-break">{initialText || emptyState}</div>
            <EditIcon className="icon-dim-16 cursor mw-16" onClick={() => setIsEditable(!isEditable)} />
        </div>
    )
}

export default EditableTextArea
