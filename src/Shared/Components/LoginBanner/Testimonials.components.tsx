import { Icon } from '../Icon'
import { TestimonialCardConfig } from './types'

const TestimonialContent = ({ quote, name, designation, iconName }: TestimonialCardConfig) => (
    <>
        <p className="fs-14 fw-4 lh-1-5 cn-9 dc__truncate--clamp-4 m-0">{quote}&quot;</p>
        <div className="flex dc__content-space">
            <div>
                <span className="fs-13 fw-6 lh-1-5 cn-9">{name}</span>
                <span className="fs-12 fw-4 lh-1-5 cn-7 dc__truncate">{designation}</span>
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
