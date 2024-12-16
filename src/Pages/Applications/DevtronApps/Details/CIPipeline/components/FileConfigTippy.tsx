import Tippy from '@tippyjs/react'

import { ReactComponent as ICInfoOutline } from '@Icons/ic-info-outline.svg'
import { VariableType } from '@Common/CIPipeline.Types'

export const FileConfigTippy = ({ fileMountDir }: Pick<VariableType, 'fileMountDir'>) => (
    <Tippy
        trigger="click"
        arrow={false}
        className="default-tt w-200"
        content={
            <div className="fs-12 lh-18 flexbox-col dc__gap-2 mw-none">
                <p className="m-0 fw-6 cn-0">File mount path</p>
                <p className="m-0 cn-50 flexbox-col flex-nowrap dc__word-break">
                    {fileMountDir}
                    <br />
                    <br />
                    Ensure the uploaded file name is unique to avoid conflicts or overrides.
                </p>
            </div>
        }
    >
        <div className="cursor flex">
            <ICInfoOutline className="icon-dim-18 scn-6" />
        </div>
    </Tippy>
)
