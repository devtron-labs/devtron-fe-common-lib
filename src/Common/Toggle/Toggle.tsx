import { useState } from 'react'
import { useEffectAfterMount } from '../Helper'
import './Toggle.scss'

const Toggle = ({
    selected = false,
    onSelect = null,
    color = '#36b37e',
    rootClassName = '',
    disabled = false,
    dataTestId = 'handle-toggle-button',
    Icon = null,
    iconClass = '',
    ...props
}) => {
    const [active, setActive] = useState(selected)

    useEffectAfterMount(() => {
        if (typeof onSelect === 'function') {
            if (active !== selected) {
                onSelect(active)
            }
        }
    }, [active])

    useEffectAfterMount(() => {
        setActive(selected)
    }, [selected])

    function handleClick(e) {
        if (!disabled) {
            setActive((active) => !active)
        }
    }

    return (
        <label
            {...props}
            className={`${rootClassName} toggle__switch ${disabled ? 'disabled' : ''}`}
            style={{ ['--color' as any]: color }}
        >
            <input type="checkbox" checked={!!active} onChange={handleClick} className="toggle__input" />
            <span className={`toggle__slider ${Icon ? 'with-icon br-4 dc__border' : 'round'}`} data-testid={dataTestId}>
                {Icon && <Icon className={`icon-dim-20 br-4 p-2 ${iconClass}`} />}
            </span>
        </label>
    )
}

export default Toggle
