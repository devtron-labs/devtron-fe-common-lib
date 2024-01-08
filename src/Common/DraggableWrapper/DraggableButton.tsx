import React from 'react'
import { ReactComponent as ICDrag } from '../../Assets/Icon/ic-drag.svg'
import { DraggableButtonProps } from './types'

export default function DraggableButton({ dragClassName }: DraggableButtonProps) {
    return (
        <button
            type="button"
            className={`${dragClassName} dc__outline-none-imp dc__no-border p-0 dc__transparent h-20`}
        >
            <ICDrag className="dc__grabbable icon-dim-20 fcn-6" />
        </button>
    )
}
