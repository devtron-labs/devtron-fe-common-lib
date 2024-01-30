import React from 'react'
import PropagateTagInfo from './PropagateTagInfo'
import { ReactComponent as Add } from '../../Assets/Icon/ic-add.svg'
import { DEFAULT_TAG_DATA } from '../Constants'
import { TagLabelSelectType } from './Types'
import { TagDetails } from './TagDetails'

export const TagLabelSelect = ({ isCreateApp, labelTags, setLabelTags, tabIndex = 0 }: TagLabelSelectType) => {
    const setTagData = (index, tagValue): void => {
        const _tags = [...labelTags]
        const _tagValue = tagValue
        if (_tagValue.key.startsWith('devtron.ai/')) {
            _tagValue.propagate = false
        }
        _tags[index] = _tagValue
        setLabelTags(_tags)
    }

    const addNewTag = (): void => {
        const _tags = [...labelTags]
        _tags.splice(0, 0, DEFAULT_TAG_DATA)
        setLabelTags(_tags)
    }

    const removeTag = (index: number): void => {
        const _tags = [...labelTags]
        _tags.splice(index, 1)
        setLabelTags(_tags)
    }

    return (
        <div>
            <div className="flexbox dc__content-space mb-8">
                <span>Tags</span>
                <PropagateTagInfo isCreateApp={isCreateApp} />
            </div>
            <div>
                <div
                    className="dc_width-max-content cb-5 fw-6 fs-13 flexbox mr-20 mb-8 cursor"
                    onClick={addNewTag}
                    data-testid="add-tag-button"
                >
                    <Add className="icon-dim-20 fcb-5" /> Add tag
                </div>
                <div className="mb-8" data-testid="tag-rows-container">
                    {labelTags?.map((tagData, index) => (
                        <TagDetails
                            key={`tag-${index}`}
                            index={index}
                            tagData={tagData}
                            setTagData={setTagData}
                            removeTag={removeTag}
                            tabIndex={tabIndex + (index + 2)}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
