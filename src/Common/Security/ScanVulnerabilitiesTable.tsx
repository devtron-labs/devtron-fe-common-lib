import React from 'react'
import { ScanVulnerabilitiesTableProps, VulnerabilityType } from '../Types'
import './scanVulnerabilities.css'

export default function ScanVulnerabilitiesTable({ vulnerabilities, hidePolicy }: ScanVulnerabilitiesTableProps) {
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
                <span className={`fill-${vulnerability.severity?.toLowerCase()}`}>{vulnerability.severity}</span>
            </td>
            <td className="security-tab__cell-package">{vulnerability.package}</td>
            <td className="security-tab__cell-current-ver">{vulnerability.version}</td>
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
                <tr className="security-tab__table-header">
                    <th className="security-cell-header security-tab__cell-cve">CVE</th>
                    <th className="security-cell-header security-tab__cell-severity">Severity</th>
                    <th className="security-cell-header security-tab__cell-package">Package</th>
                    <th className="security-cell-header security-tab__cell-current-ver">Current Version</th>
                    <th className="security-cell-header security-tab__cell-fixed-ver">Fixed In Version</th>
                    {!hidePolicy && (
                        <th className="security-cell-header security-tab__cell-policy">Policy</th>
                    )}
                </tr>
                {vulnerabilities.map((vulnerability) => renderRow(vulnerability))}
            </tbody>
        </table>
    )
}
