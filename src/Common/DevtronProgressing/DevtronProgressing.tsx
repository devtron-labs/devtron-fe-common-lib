import React from 'react'
import { ReactComponent as ICRotateDevtron } from '../../Assets/Icon/ic-rotate-devtron.svg'
import { DevtronProgressingProps } from './types'

export function DevtronProgressing({ classes, parentClasses }: DevtronProgressingProps): JSX.Element {
    return (
        <div className={parentClasses ? parentClasses : ''}>
            <ICRotateDevtron className={classes ? classes : ''} />
        </div>
    )
}
