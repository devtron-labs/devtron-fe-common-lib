import { Toggle, Tooltip } from '@Common/index'
import { ReactComponent as ICViewVariableToggle } from '@Icons/ic-view-variable-toggle.svg'
import { ToggleResolveScopedVariablesProps } from './types'

const ToggleResolveScopedVariables = ({
    resolveScopedVariables,
    handleToggleScopedVariablesView,
    isDisabled = false,
    showTooltip = true,
    throttleOnChange,
}: ToggleResolveScopedVariablesProps) => (
    <Tooltip
        alwaysShowTippyOnHover={showTooltip}
        content={resolveScopedVariables ? 'Hide variables value' : 'Show variables value'}
    >
        <div className="w-28 h-18">
            <Toggle
                selected={resolveScopedVariables}
                color={resolveScopedVariables ? 'var(--B300)' : 'var(--N200)'}
                onSelect={handleToggleScopedVariablesView}
                Icon={ICViewVariableToggle}
                disabled={isDisabled}
                rootClassName="dc__toggle-square-toggle"
                throttleOnChange={throttleOnChange}
                iconClass={resolveScopedVariables ? 'scb-5 p-2-imp' : 'scn-6 p-2-imp'}
            />
        </div>
    </Tooltip>
)

export default ToggleResolveScopedVariables
