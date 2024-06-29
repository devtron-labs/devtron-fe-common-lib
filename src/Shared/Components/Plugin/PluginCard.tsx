import { Checkbox, CHECKBOX_VALUE } from '../../../Common'
import { ImageWithFallback } from '../ImageWithFallback'
import { PluginCardProps } from './types'
import { ReactComponent as ICLegoBlock } from '../../../Assets/Icon/ic-lego-block.svg'

const PluginCard = ({
    isSelectable,
    pluginDataStore,
    handlePluginSelection,
    parentPluginId,
    isSelected,
    showCardBorder,
}: PluginCardProps) => {
    const latestPluginId = pluginDataStore.parentPluginStore[parentPluginId].latestVersionId
    const { icon, name, description, tags, pluginVersion, updatedBy } =
        pluginDataStore.pluginVersionStore[latestPluginId]

    const handleSelection = () => {
        handlePluginSelection(parentPluginId)
    }

    return (
        <div
            className={`p-12 flexbox dc__gap-16 dc__tab-focus dc__visible-hover dc__visible-hover--parent ${showCardBorder ? 'dc__border br-4 dc__hover-n50' : ''}`}
            role="button"
            tabIndex={0}
            onClick={handleSelection}
        >
            {isSelectable && (
                <div className={`dc__no-shrink icon-dim-40 p-8 ${!isSelected ? 'dc__visible-hover--child' : ''}`}>
                    <Checkbox
                        isChecked={isSelected}
                        onChange={handleSelection}
                        rootClassName="icon-dim-40 p-8 w-100 mb-0 dc__no-shrink"
                        value={CHECKBOX_VALUE.CHECKED}
                    />
                </div>
            )}

            {/* TODO: Test multiple cards with fallback since has if in LegoBlock */}
            {!isSelected && (
                <ImageWithFallback
                    fallbackImage={<ICLegoBlock className="dc__no-shrink dc__visible-hover--hide-child icon-dim-40" />}
                    imageProps={{
                        src: icon,
                        alt: `${name} logo`,
                        width: 40,
                        height: 40,
                        className: 'p-4 dc__no-shrink dc__visible-hover--hide-child',
                    }}
                />
            )}

            <div className="flexbox-col dc__gap-12">
                <div className="flexbox-col dc__gap-8">
                    <div className="flexbox-col dc__gap-4">
                        <div className="flexbox dc__gap-4">
                            <h4 className="m-0 dc__truncate cn-9 fs-13 fw-6 lh-20">{name}</h4>
                            {!isSelectable && (
                                <span className="dc__truncate cn-7 fs-12 fw-4 lh-20">({pluginVersion})</span>
                            )}
                        </div>

                        <span className="dc__truncate cn-7 fs-12 fw-4 lh-16">By {updatedBy || 'Devtron'}</span>
                    </div>

                    {/* Plugin description */}
                    {description && <p className="m-0 cn-7 fs-12 fw-4 lh-16 dc__truncate--clamp-3">{description}</p>}
                </div>

                {/* Tag container */}
                {/* TODO: Make component since re-usable */}
                <div className="flexbox dc__gap-6 flex-wrap">
                    {tags.map((tag) => (
                        <div className="flexbox px-6 br-4 bcn-1 dc__align-items-center dc__mxw-160" key={tag}>
                            <span className="dc__mxw-160 dc__truncate cn-8 fs-11 fw-4 lh-20">{tag}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default PluginCard
