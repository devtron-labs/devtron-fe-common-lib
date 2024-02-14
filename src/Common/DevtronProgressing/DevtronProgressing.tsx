import React from 'react'
import { ReactComponent as ICRotateDevtron } from '../../Assets/Icon/ic-rotate-devtron.svg'
import { DevtronProgressingProps } from './types'

export const DevtronProgressing = ({ classes, parentClasses }: DevtronProgressingProps): JSX.Element => (
    <div className={parentClasses || ''}>
        <ICRotateDevtron className={classes || ''} />
    </div>
)
