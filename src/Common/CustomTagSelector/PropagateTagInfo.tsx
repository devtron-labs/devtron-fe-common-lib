import React from 'react'
import { ReactComponent as InjectTag } from '../../Assets/Icon/inject-tag.svg'
import { ReactComponent as Help } from '../../Assets/Icon/ic-help-outline.svg'
import { TippyCustomized } from '../TippyCustomized'
import { TippyTheme } from '../Types'

export default function PropagateTagInfo() {
    const additionalInfo = () => {
        return (
            <div className="p-12 fs-13">
                Use these tags to filter/identify resources via CLI or in other Kubernetes tools.
            </div>
        )
    }
    return (
        <TippyCustomized
            theme={TippyTheme.white}
            className="w-300"
            placement="top"
            Icon={InjectTag}
            heading={'Propagate tags to K8s resources'}
            infoText={`Add a tag and click on the ⬡ icon to propagate tags as labels to Kubernetes resources.`}
            additionalContent={additionalInfo()}
            showCloseButton={true}
            trigger="click"
            interactive={true}
            documentationLink={''}
            documentationLinkText={'View Documentation'}
        >
            <div className="flexbox">
                <InjectTag className="icon-dim-16 mt-2 mr-4" />
                <span>Propagate tags</span>
                <Help className="icon-dim-16 mt-2 ml-4 cursor" />
            </div>
        </TippyCustomized>
    )
}
