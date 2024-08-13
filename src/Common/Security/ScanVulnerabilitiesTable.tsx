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

import React from 'react'
import DOMPurify from 'dompurify'
import { ScanVulnerabilitiesTableProps, VulnerabilityType } from '../Types'
import './scanVulnerabilities.css'

export default function ScanVulnerabilitiesTable({
    vulnerabilities,
    hidePolicy,
    shouldStick,
}: ScanVulnerabilitiesTableProps) {
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
                <span className={`dc__fill-${vulnerability.severity?.toLowerCase()}`}>{vulnerability.severity}</span>
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
                    <th className="security-cell-header security-tab__cell-severity">Severity</th>
                    <th className="security-cell-header security-tab__cell-package">Package</th>
                    <th className="security-cell-header security-tab__cell-current-ver">Current Version</th>
                    <th className="security-cell-header security-tab__cell-fixed-ver">Fixed In Version</th>
                    {!hidePolicy && <th className="security-cell-header security-tab__cell-policy">Policy</th>}
                </tr>
                {vulnerabilities.map((vulnerability) => renderRow(vulnerability))}
            </tbody>
        </table>
    )
}
