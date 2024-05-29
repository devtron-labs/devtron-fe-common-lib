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

import moment from 'moment'
import { DATE_TIME_FORMAT_STRING } from '../../constants'
import { ZERO_TIME_STRING, sortCallback } from '../../../Common'
import { LastExecutionResponseType, LastExecutionResultType, Severity } from '../../types'

export const getParsedScanResult = (scanResult): LastExecutionResultType => {
    const vulnerabilities = scanResult?.vulnerabilities || []
    const critical = vulnerabilities
        .filter((v) => v.severity === Severity.CRITICAL)
        .sort((a, b) => sortCallback('cveName', a, b))
    const moderate = vulnerabilities
        .filter((v) => v.severity === Severity.MODERATE)
        .sort((a, b) => sortCallback('cveName', a, b))
    const low = vulnerabilities.filter((v) => v.severity === Severity.LOW).sort((a, b) => sortCallback('cveName', a, b))
    const sortedVulnerabilities = critical.concat(moderate, low)

    return {
        ...(scanResult || {}),
        lastExecution:
            scanResult?.executionTime && scanResult.executionTime !== ZERO_TIME_STRING
                ? moment(scanResult.executionTime).utc(false).format(DATE_TIME_FORMAT_STRING)
                : '',
        severityCount: {
            critical: scanResult?.severityCount?.high,
            moderate: scanResult?.severityCount?.moderate,
            low: scanResult?.severityCount?.low,
        },
        vulnerabilities: sortedVulnerabilities.map((cve) => ({
            name: cve.cveName,
            severity: cve.severity,
            package: cve.package,
            version: cve.currentVersion,
            fixedVersion: cve.fixedVersion,
            policy: cve.permission,
        })),
    }
}

export const parseLastExecutionResponse = (response): LastExecutionResponseType => ({
    ...response,
    result: getParsedScanResult(response.result),
})
