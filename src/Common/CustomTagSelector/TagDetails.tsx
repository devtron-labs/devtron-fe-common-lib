import React from 'react'
import { ReactComponent as DeleteCross } from '../../Assets/Icon/ic-close.svg'
import { ReactComponent as InjectTag } from '../../Assets/Icon/inject-tag.svg'
import { TagType } from '../Types'
import { TagLabelValueSelector } from './TagLabelValueSelector'

export default function TagDetails({
    index,
    tagData,
    setTagData,
    removeTag,
}: {
    index: number
    tagData: TagType
    setTagData: (index: number, tagData: TagType) => void
    removeTag: (index: number) => void
}) {
    const deleteTag = (): void => {
        removeTag(index)
    }
    const propagateTagToResource = (): void => {
        const _tagData = { ...tagData }
        _tagData.propagate = !_tagData.propagate
        setTagData(index, _tagData)
    }
    return (
        <div className="flexbox mb-8">
            <div
                className={`dc__border pl-4 pr-4 br-4 mr-8 pointer ${tagData.propagate ? 'bcn-7' : ''}`}
                onClick={propagateTagToResource}
            >
                <InjectTag className={`icon-dim-20 mt-4 ${tagData.propagate ? 'scn-0' : ''}`} />
            </div>
            <TagLabelValueSelector selectedTagIndex={index} tagData={tagData} setTagData={setTagData} type="key" />
            <TagLabelValueSelector selectedTagIndex={index} tagData={tagData} setTagData={setTagData} type="value" />
            <div className="dc__border pl-4 pr-4 dc__right-radius-4 pointer" onClick={deleteTag}>
                <DeleteCross className="icon-dim-20 mt-4" />
            </div>
        </div>
    )
}
