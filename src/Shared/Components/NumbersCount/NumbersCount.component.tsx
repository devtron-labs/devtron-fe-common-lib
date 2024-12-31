import { ReactComponent as ICTilde } from '@Icons/ic-tilde.svg'
import { NumbersCountProps } from './types'

const NumbersCount = ({ count, isApprox, isSelected }: NumbersCountProps) => (
    <div
        className={`flex dc__no-shrink br-12 dc__gap-2 px-6 ${isSelected ? 'bcb-5 cn-0' : 'bcn-1 cn-7'} fs-13 fw-6 lh-20`}
    >
        {isApprox && <ICTilde className="dc__no-shrink icon-dim-12 scn-0" />}
        <span>{count}</span>
    </div>
)

export default NumbersCount
