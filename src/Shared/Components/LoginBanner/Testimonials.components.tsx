import { Icon } from '../Icon'
import { TestimonialCardConfig } from './types'

const TestimonialContent = ({ quote, name, designation, iconName }: TestimonialCardConfig) => (
    <>
        <div className="fs-14 fw-4 lh-1-5 cn-9 dc__truncate--clamp-4">{quote}&quot;</div>
        <div className="flex dc__content-space">
            <div>
                <div className="fs-13 fw-6 lh-1-5 cn-9">{name}</div>
                <div className="fs-12 fw-4 lh-1-5 cn-7 dc__truncate">{designation}</div>
            </div>
            {iconName && (
                <div className="dc__fill-available-space w-auto-imp h-36">
                    <Icon name={iconName} color="N900" />
                </div>
            )}
        </div>
    </>
)

export default TestimonialContent
