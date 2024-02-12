import React from 'react'
import Tippy from '@tippyjs/react'
import { AddCDButtonProps, TooltipContentProps } from './types'
import { AddCDPositions } from '../Types'

const TooltipContent = ({ tooltipContent }: TooltipContentProps) => {
    if (tooltipContent) {
        return (
            <div className="dc__white-space-pre-wrap">
                <p className="m-0 cn-0 fs-12 fw-6 lh-18">Click to add</p>

                {tooltipContent}
            </div>
        )
    }

    return <div className="dc__white-space-pre-wrap">Click to add here</div>
}

export default function AddCDButton({
    position,
    addCDButtons,
    endNode,
    startNode,
    handleAddCD,
    tooltipContent,
}: Readonly<AddCDButtonProps>) {
    const referenceNode = position === AddCDPositions.RIGHT ? endNode : startNode
    const handleAddCDClick = () => {
        handleAddCD(position)
    }

    if (addCDButtons?.includes(position)) {
        return (
            <Tippy
                placement="top"
                content={<TooltipContent tooltipContent={tooltipContent} />}
                className="default-tt"
                arrow={false}
            >
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
                    className="dc__outline-none-imp"
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
            </Tippy>
        )
    }

    return null
}
