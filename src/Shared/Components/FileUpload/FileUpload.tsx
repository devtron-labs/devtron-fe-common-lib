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

import { ChangeEvent } from 'react'

import { ReactComponent as ICCross } from '@Icons/ic-cross.svg'
import { ReactComponent as ICFileText } from '@Icons/ic-file-text.svg'
import { ReactComponent as ICUploadArrowAnimated } from '@Icons/ic-upload-arrow-animated.svg'
import { Tooltip } from '@Common/Tooltip'
import { ComponentSizeType } from '@Shared/constants'

import { Button, ButtonStyleType, ButtonVariantType } from '../Button'
import { FileUploadProps } from './types'

import './styles.scss'

export const FileUpload = ({
    isLoading,
    label,
    fileName = '',
    multiple = false,
    fileTypes = [],
    onUpload,
}: FileUploadProps) => {
    // METHODS
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const filesArray = Array.from(event.target.files)
            onUpload(filesArray)
        }
        // Clearing value otherwise we can't upload the same file again.
        const e = event
        e.target.value = ''
    }

    const onClearUpload = () => {
        onUpload([])
    }

    return (
        <div className="file-upload mw-none">
            {isLoading || fileName ? (
                <div className="dc__border br-4 dc__overflow-hidden flexbox">
                    <div className="flexbox dc__align-items-center dc__gap-8 px-8 py-4 mw-none">
                        {isLoading ? (
                            <>
                                <ICUploadArrowAnimated className="icon-dim-16 dc__no-shrink scb-5" />
                                <span className="fs-12 lh-20">Uploading...</span>
                            </>
                        ) : (
                            <>
                                <ICFileText className="icon-dim-16 dc__no-shrink scb-5" />
                                <Tooltip content={fileName}>
                                    <span className="fs-12 lh-20 dc__ellipsis-right">{fileName}</span>
                                </Tooltip>
                            </>
                        )}
                    </div>
                    {!isLoading && (
                        <div className="file-upload__remove-file">
                            <Button
                                dataTestId="file-upload-remove-file-button"
                                ariaLabel="Remove File"
                                showAriaLabelInTippy={false}
                                icon={<ICCross />}
                                onClick={onClearUpload}
                                variant={ButtonVariantType.borderLess}
                                style={ButtonStyleType.negativeGrey}
                                size={ComponentSizeType.small}
                            />
                        </div>
                    )}
                </div>
            ) : (
                <div className="dc__position-rel flex">
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                    <label htmlFor="fileInput" className="m-0 fw-4 cb-5 fs-13 lh-20 flex-grow-1 cursor">
                        {label || 'Upload file…'}
                    </label>
                    <input
                        id="fileInput"
                        type="file"
                        className="dc__visibility-hidden dc__position-abs dc__top-0 dc__right-0 dc__bottom-0 dc__left-0"
                        onChange={handleFileChange}
                        multiple={multiple}
                        accept={fileTypes.join(',')}
                    />
                </div>
            )}
        </div>
    )
}
