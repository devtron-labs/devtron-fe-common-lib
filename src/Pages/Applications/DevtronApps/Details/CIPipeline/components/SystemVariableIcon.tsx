import { ReactComponent as Var } from '@Icons/ic-var-initial.svg'
import { Tooltip } from '@Common/Tooltip'

const TIPPY_VAR_MSG = 'This is a variable. It will be replaced with the value during execution.'

export const SystemVariableIcon = () => (
    <Tooltip content={TIPPY_VAR_MSG} placement="left" animation="shift-away" alwaysShowTippyOnHover>
        <div className="flex">
            <Var className="icon-dim-18 icon-n4" />
        </div>
    </Tooltip>
)
