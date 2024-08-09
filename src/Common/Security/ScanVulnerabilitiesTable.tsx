/*
 * Copyright (c) 2024. Devtron Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import DOMPurify from 'dompurify'
import { ScanVulnerabilitiesTableProps, VulnerabilityType } from '../Types'
import './scanVulnerabilities.css'
import { SortableTableHeaderCell } from '@Common/SortableTableHeaderCell'
import { useMemo } from 'react'
import { numberComparatorBySortOrder, stringComparatorBySortOrder } from '@Shared/Helpers'
import { VulnerabilitiesTableSortKeys } from './types'
import { VULNERABILITIES_SORT_PRIORITY } from '@Common/Constants'
import { useStateFilters } from '@Common/Hooks'

// To be replaced with Scan V2 Modal Table
export default function ScanVulnerabilitiesTable({
    vulnerabilities,
    hidePolicy,
    shouldStick,
}: ScanVulnerabilitiesTableProps) {
    const { sortBy, sortOrder, handleSorting } = useStateFilters<VulnerabilitiesTableSortKeys>({
        initialSortKey: VulnerabilitiesTableSortKeys.SEVERITY,
    })

    const sortedVulnerabilities = useMemo(
        () =>
            vulnerabilities.sort((a, b) => {
                if (sortBy === VulnerabilitiesTableSortKeys.PACKAGE) {
                    return stringComparatorBySortOrder(a.package, b.package, sortOrder)
                }

                return numberComparatorBySortOrder(
                    VULNERABILITIES_SORT_PRIORITY[a.severity],
                    VULNERABILITIES_SORT_PRIORITY[b.severity],
                    sortOrder,
                )
            }),
        [sortBy, sortOrder, vulnerabilities],
    )

    const triggerSeveritySorting = () => handleSorting(VulnerabilitiesTableSortKeys.SEVERITY)
    const triggerPackageSorting = () => handleSorting(VulnerabilitiesTableSortKeys.PACKAGE)

    const renderRow = (vulnerability: VulnerabilityType) => (
        <tr
            className="dc__security-tab__table-row cursor"
            onClick={(e) => {
                window.open(`https://cve.mitre.org/cgi-bin/cvename.cgi?name=${vulnerability.name}`, '_blank')
            }}
        >
            <td className="security-tab__cell-cve dc__cve-cell">
                <a
                    href={`https://cve.mitre.org/cgi-bin/cvename.cgi?name=${vulnerability.name}`}
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    {vulnerability.name}
                </a>
            </td>
            <td className="security-tab__cell-severity">
                <span
                    className={`severity-chip severity-chip--${vulnerability.severity?.toLowerCase()} dc__capitalize dc__w-fit-content`}
                >
                    {vulnerability.severity}
                </span>
            </td>
            <td className="security-tab__cell-package">{vulnerability.package}</td>
            {/* QUERY: Do we need to add DOMPurify at any other key for this table as well? */}
            <td className="security-tab__cell-current-ver">
                <p
                    className="m-0 cn-9 fs-13 fw-4"
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(vulnerability.version),
                    }}
                />
            </td>
            <td className="security-tab__cell-fixed-ver">{vulnerability.fixedVersion}</td>
            {!hidePolicy && (
                <td
                    className={`security-tab__cell-policy security-tab__cell-policy--${vulnerability.policy?.toLowerCase()}`}
                >
                    {vulnerability.policy?.toLowerCase()}
                </td>
            )}
        </tr>
    )

    return (
        <table className="security-tab__table">
            <tbody>
                <tr
                    className={`security-tab__table-header ${shouldStick ? 'dc__position-sticky bcn-0 dc__zi-4 dc__top-0' : ''}`}
                >
                    <th className="security-cell-header security-tab__cell-cve">CVE</th>
                    <th className="security-cell-header security-tab__cell-severity">
                        <SortableTableHeaderCell
                            title="Severity"
                            isSorted={sortBy === VulnerabilitiesTableSortKeys.SEVERITY}
                            isSortable
                            sortOrder={sortOrder}
                            triggerSorting={triggerSeveritySorting}
                            disabled={false}
                        />
                    </th>
                    <th className="security-cell-header security-tab__cell-package">
                        <SortableTableHeaderCell
                            title="Package"
                            isSorted={sortBy === VulnerabilitiesTableSortKeys.PACKAGE}
                            isSortable
                            sortOrder={sortOrder}
                            triggerSorting={triggerPackageSorting}
                            disabled={false}
                        />
                    </th>
                    <th className="security-cell-header security-tab__cell-current-ver">Current Version</th>
                    <th className="security-cell-header security-tab__cell-fixed-ver">Fixed In Version</th>
                    {!hidePolicy && <th className="security-cell-header security-tab__cell-policy">Policy</th>}
                </tr>
                {sortedVulnerabilities.map((vulnerability) => renderRow(vulnerability))}
            </tbody>
        </table>
    )
}
