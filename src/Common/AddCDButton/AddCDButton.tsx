import React from 'react'
import { AddCDButtonProps } from './types'
import { AddCDPositions } from '../Types'

export default function AddCDButton({
    position,
    addCDButtons,
    endNode,
    startNode,
    handleAddCD,
}: Readonly<AddCDButtonProps>) {
    const referenceNode = position === AddCDPositions.RIGHT ? endNode : startNode
    const handleAddCDClick = () => {
        handleAddCD(position)
    }

    if (addCDButtons?.includes(position)) {
        return (
            <svg
                x={referenceNode.x + (position === AddCDPositions.RIGHT ? -20 - 5 : referenceNode.width + 5)}
                // Here 10 is the height of the button / 2
                y={referenceNode.y + referenceNode.height / 2 - 10}
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                data-testid={`add-cd-to-${position}`}
                onClick={handleAddCDClick}
            >
                <rect width="20" height="20" rx="10" fill="#664BEE" className="add-cd-edge-btn" />
                <path
                    d="M6.5 10H13.5M10 6.5V13.5"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        )
    }

    return null
}
