/*
 * Copyright (c) 2024. Devtron Inc.
 */

import React, { useState } from 'react'
import { ReactComponent as ICExpand } from '@Icons/ic-expand.svg'
import { SIDEBAR_DATA } from '../config'
import { SidebarPropsType, SidebarDataChildType, SidebarDataType } from '../types'
import { CATEGORY_LABELS } from '../constants'

const Sidebar: React.FC<SidebarPropsType> = ({ isHelmApp, modalState, setModalState, isExternalCI }) => {
    const [data, setData] = useState<SidebarDataType[]>(SIDEBAR_DATA)

    const getToggleHeaderCollapseHandler = (index: number) => () => {
        data[index].isExpanded = !data[index].isExpanded
        setData([...data])
    }

    const getSelectionChangeHandler = (value: SidebarDataChildType['value']) => () =>
        setModalState({ ...value, detailViewData: null })

    return (
        <div className="flexbox-col pl-8 pr-8 pt-12 pb-12 w-240">
            {data.map(
                (header, index) =>
                    (!header.hideInHelmApp || !isHelmApp) &&
                    !(isExternalCI && header.label === CATEGORY_LABELS.CODE_SCAN) && (
                        <div className="flexbox-col">
                            <button
                                type="button"
                                className="dc__unset-button-styles"
                                onClick={getToggleHeaderCollapseHandler(index)}
                                data-testid={`security-sidebar-${header.label}`}
                            >
                                <div className="flexbox dc__gap-6 p-6 h-32 dc__hover-n50 dc__border-radius-4-imp">
                                    <div className="flex">
                                        <ICExpand
                                            className="icon-dim-20 rotate"
                                            style={{
                                                ['--rotateBy' as any]: !header.isExpanded ? '-90deg' : '0deg',
                                            }}
                                        />
                                    </div>
                                    <span className="fw-6 lh-18 fs-13 cn-9">{header.label}</span>
                                </div>
                            </button>
                            {/* TODO: add css animation for dropdown */}
                            {header.isExpanded &&
                                header.children?.map((child) => {
                                    const isChildSelected =
                                        modalState.category === child.value.category &&
                                        modalState.subCategory === child.value.subCategory
                                    return (
                                        <button
                                            type="button"
                                            className="dc__unset-button-styles"
                                            onClick={getSelectionChangeHandler(child.value)}
                                            data-testid={`security-sidebar-${header.label}-${child.label}`}
                                        >
                                            <div className="flexbox dc__gap-8 h-32">
                                                <div className="ml-16 dc__border-right" />
                                                <span
                                                    className={`pl-8 pr-8 pt-6 pb-6 fs-13 lh-20 dc__border-radius-4-imp w-100 dc__align-left dc__hover-n50 ${isChildSelected ? 'bcb-1 cb-5 fw-6' : 'bcn-0 fw-4 cn-9'}`}
                                                >
                                                    {child.label}
                                                </span>
                                            </div>
                                        </button>
                                    )
                                })}
                        </div>
                    ),
            )}
        </div>
    )
}

export default Sidebar
