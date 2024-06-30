import { PluginTagsContainerProps } from './types'

const PluginTagsContainer = ({ tags }: PluginTagsContainerProps) => {
    if (!tags?.length) {
        return null
    }

    return (
        <div className="flexbox dc__gap-6 flex-wrap">
            {tags.map((tag) => (
                <div className="flexbox px-6 br-4 bcn-1 dc__align-items-center dc__mxw-160" key={tag}>
                    <span className="dc__mxw-160 dc__truncate cn-8 fs-11 fw-4 lh-20">{tag}</span>
                </div>
            ))}
        </div>
    )
}

export default PluginTagsContainer
