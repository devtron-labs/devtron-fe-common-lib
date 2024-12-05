import { ChangeEvent } from 'react'

import { ReactComponent as ICCloudUpload } from '@Icons/ic-cloud-upload.svg'
import { ReactComponent as ICClose } from '@Icons/ic-close.svg'
import { Tooltip } from '@Common/Tooltip'

import { FileUploadProps } from './types'

export const FileUpload = ({
    label,
    fileName = '',
    multiple = false,
    fileTypes = [],
    className,
    onUpload,
}: FileUploadProps) => {
    // METHODS
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const filesArray = Array.from(event.target.files)
            onUpload(filesArray)
        }
    }

    return (
        <div className={className || ''}>
            {fileName ? (
                <div className="dc__border br-4 dc__overflow-hidden flexbox">
                    <div className="flexbox dc__align-items-center dc__gap-8 px-8 py-4 min-w-0">
                        <ICCloudUpload className="icon-dim-16 dc__no-shrink" />
                        <Tooltip content={fileName}>
                            <span className="fs-12 lh-20 dc__ellipsis-right">{fileName}</span>
                        </Tooltip>
                    </div>
                    <button
                        type="button"
                        className="dc__transparent flex p-6 dc__hover-n50"
                        onClick={() => onUpload([])}
                    >
                        <ICClose className="icon-dim-16 fcn-6" />
                    </button>
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
