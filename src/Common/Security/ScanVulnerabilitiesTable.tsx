import React from 'react'
import { ScanVulnerabilitiesTableProps, VulnerabilityType } from '../Types'
import './scanVulnerabilities.css'
import * as DOMPurify from 'dompurify';
import { marked } from 'marked'

export default function ScanVulnerabilitiesTable({ vulnerabilities }: ScanVulnerabilitiesTableProps) {
    // function MarkDown({ markdown = '', className = '', breaks = false, ...props }) {
    //     const renderer = new marked.Renderer()

    
    //     renderer.table = function (header, body) {
    //         return `
    //         <div class="table-container">
    //             <table>
    //                 ${header}
    //                 ${body}
    //             </table>
    //         </div>
    //         `
    //     }
    
    //     renderer.heading = function (text, level) {
    //         const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-')
    
    //         return `
    //           <a name="${escapedText}" rel="noreferrer noopener" class="anchor" href="#${escapedText}">
    //                 <h${level} data-testid="deployment-template-readme-version">
    //               <span class="header-link"></span>
    //               ${text}
    //               </h${level}>
    //             </a>`
    //     }
    
    //     marked.setOptions({
    //         renderer,
    //         gfm: true,
    //         smartLists: true,
    //         ...(breaks && { breaks: true }),
    //     })
    
    //     function createMarkup() {
    //         return { __html: DOMPurify.sanitize(marked(markdown), { USE_PROFILES: { html: true } }) }
    //     }
    //     return (
    //         <article
    //             {...props}
    //             className={`deploy-chart__readme-markdown ${className}`}
    //             dangerouslySetInnerHTML={createMarkup()}
    //             data-testid="article-for-bulk-edit"
    //         />
    //     )
    // }
    const renderRow = (vulnerability: VulnerabilityType) => {
        function createMarkup() {
            return { __html: DOMPurify.sanitize(marked(''), { USE_PROFILES: { html: true } }) }
        }
        return (
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
                <td className="security-tab__cell-package" >{vulnerability.package}</td>
                <td className="security-tab__cell-current-ver" dangerouslySetInnerHTML={createMarkup()}>{vulnerability.version}</td>
                <td className="security-tab__cell-fixed-ver" dangerouslySetInnerHTML={createMarkup()}>{vulnerability.fixedVersion}</td>
                <td
                    className={`security-tab__cell-policy security-tab__cell-policy--${vulnerability.policy?.toLowerCase()}`}
                >
                    {vulnerability.policy?.toLowerCase()}
                </td>
            </tr>
        )
    }

    return (
        <table className="security-tab__table">
            <tbody>
                <tr className="security-tab__table-header">
                    <th className="security-cell-header security-tab__cell-cve">CVE</th>
                    <th className="security-cell-header security-tab__cell-severity">Severity</th>
                    <th className="security-cell-header security-tab__cell-package">Package</th>
                    <th className="security-cell-header security-tab__cell-current-ver">Current Version</th>
                    <th className="security-cell-header security-tab__cell-fixed-ver">Fixed In Version</th>
                    <th className="security-cell-header security-tab__cell-policy">Policy</th>
                </tr>
                {vulnerabilities.map((vulnerability) => {
                    return renderRow(vulnerability)
                })}
            </tbody>
        </table>
    )
}
