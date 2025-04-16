import { useState } from 'react'

import { ButtonProps } from './types'

const useTriggerAutoClickTimestamp = () => {
    const [triggerAutoClickTimestamp, setTriggerAutoClickTimestamp] =
        useState<ButtonProps['triggerAutoClickTimestamp']>(null)

    const setTriggerAutoClickTimestampToNow = () => {
        setTriggerAutoClickTimestamp(Date.now())
    }

    const resetTriggerAutoClickTimestamp = () => {
        setTriggerAutoClickTimestamp(null)
    }

    return {
        triggerAutoClickTimestamp,
        setTriggerAutoClickTimestampToNow,
        resetTriggerAutoClickTimestamp,
    }
}

export default useTriggerAutoClickTimestamp
