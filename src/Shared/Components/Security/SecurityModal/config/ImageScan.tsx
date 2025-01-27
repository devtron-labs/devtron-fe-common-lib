/*
 * Copyright (c) 2024. Devtron Inc.
 */

import dayjs from 'dayjs'
import { Progressing } from '@Common/Progressing'
import { ReactComponent as ICError } from '@Icons/ic-error-cross.svg'
import { ReactComponent as ICSuccess } from '@Icons/ic-success.svg'
import { ZERO_TIME_STRING, DATE_TIME_FORMATS } from '../../../../../Common/Constants'
import {
    DetailViewDataType,
    ImageScanVulnerabilityListType,
    ImageScan,
    SUB_CATEGORIES,
    SecurityModalStateType,
    TablePropsType,
    StatusType,
    InfoCardPropsType,
    ImageScanLicenseListType,
    EmptyStateType,
    ScanResultDTO,
    CATEGORIES,
    OpenDetailViewButtonProps,
} from '../types'
import {
    compareSeverities,
    compareSeverity,
    getScanCompletedEmptyState,
    groupByTarget,
    mapSeveritiesToSegmentedBarChartEntities,
    stringifySeverities,
} from '../utils'
import { SCAN_FAILED_EMPTY_STATE, SCAN_IN_PROGRESS_EMPTY_STATE, SEVERITY_DEFAULT_SORT_ORDER } from '../constants'
import { getCodeScanVulnerabilities } from './CodeScan'
import { OpenDetailViewButton } from '../components'

const getVulnerabilitiesDetailBaseData = (element: ImageScanVulnerabilityListType) => ({
    titlePrefix: 'Image',
    title: element.image,
    entities: mapSeveritiesToSegmentedBarChartEntities(element.summary.severities),
    lastScanTimeString: element.StartedOn,
    scanToolName: element.scanToolName,
    scanToolUrl: element.scanToolUrl,
    status: element.status,
})

const getGroupedVulnerabilitiesDetailData = (
    element: ImageScanVulnerabilityListType,
    setDetailViewData: OpenDetailViewButtonProps['setDetailViewData'],
    hidePolicy: boolean,
) => {
    const list = !element?.list?.length ? null : groupByTarget(element.list)

    return {
        ...getVulnerabilitiesDetailBaseData(element),
        headers: [
            { headerText: 'source', isSortable: false, width: 428 },
            {
                headerText: 'vulnerability',
                isSortable: true,
                width: 300,
                compareFunc: compareSeverities,
            },
        ],
        rows: !list?.length
            ? null
            : list.map((child, index) => ({
                  id: index,
                  expandableComponent: null,
                  cells: [
                      {
                          component: (
                              <OpenDetailViewButton
                                  detailViewData={{
                                      ...getVulnerabilitiesDetailBaseData({
                                          ...element,
                                          image: child.source,
                                          summary: child.summary,
                                      }),
                                      titlePrefix: 'Source',
                                      ...getCodeScanVulnerabilities(child, hidePolicy),
                                  }}
                                  setDetailViewData={setDetailViewData}
                              >
                                  <span className="cb-5 fw-4 cursor">{child.source}</span>
                              </OpenDetailViewButton>
                          ),
                          cellContent: child.source,
                      },
                      {
                          component: <span>{stringifySeverities(child.summary.severities)}</span>,
                          cellContent: child.summary.severities,
                      },
                  ],
              })),
    }
}

const getVulnerabilitiesDetailData = (
    element: ImageScanVulnerabilityListType,
    setDetailViewData: OpenDetailViewButtonProps['setDetailViewData'],
    hidePolicy: boolean,
) => {
    const shouldGroupByTarget = element.list?.every((item) => !!item.target)
    if (!shouldGroupByTarget) {
        return {
            ...getVulnerabilitiesDetailBaseData(element),
            ...getCodeScanVulnerabilities(element, hidePolicy),
        }
    }
    return getGroupedVulnerabilitiesDetailData(element, setDetailViewData, hidePolicy)
}

export const getProgressingStateForStatus = (status: StatusType['status']) => {
    switch (status) {
        case 'Completed':
            return <ICSuccess className="icon-dim-16 dc__no-shrink" />
        case 'Failed':
            return <ICError className="icon-dim-16 ic-error-cross-red dc__no-shrink" />
        case 'Progressing':
            return (
                <Progressing
                    fillColor="var(--Y500)"
                    styles={{
                        width: '20px',
                        height: '20px',
                    }}
                />
            )
        default:
            return null
    }
}

const getTimeString = (timeString: string, status: StatusType['status']) => {
    if (timeString && timeString !== ZERO_TIME_STRING && status === 'Completed') {
        return dayjs(timeString).format(DATE_TIME_FORMATS.TWELVE_HOURS_FORMAT)
    }
    if (status === 'Progressing') {
        return 'Scan in progress'
    }
    return null
}

const getVulnerabilitiesData = (
    data: ImageScan['vulnerability'],
    setDetailViewData: OpenDetailViewButtonProps['setDetailViewData'],
    hidePolicy: boolean,
) => ({
    headers: [
        { headerText: 'image', isSortable: false, width: 256 },
        { headerText: 'vulnerability', isSortable: false, width: 256 },
        { headerText: 'last scanned on', isSortable: false, width: 200 },
    ],
    rows: !data?.list?.length
        ? null
        : data.list.map((element, index) => ({
              id: index,
              expandableComponent: null,
              cells: [
                  {
                      component: (
                          <OpenDetailViewButton
                              detailViewData={getVulnerabilitiesDetailData(element, setDetailViewData, hidePolicy)}
                              setDetailViewData={setDetailViewData}
                          >
                              <span className="cb-5 fw-4 cursor">{element.image}</span>
                          </OpenDetailViewButton>
                      ),
                      cellContent: element.image,
                  },
                  {
                      component: null,
                      cellContent:
                          stringifySeverities(element.summary.severities) ||
                          (element.status === 'Completed' ? 'No vulnerability found' : '-'),
                  },
                  {
                      component: (
                          <div className="flexbox dc__align-items-center dc__gap-4">
                              {getProgressingStateForStatus(element.status)}
                              <span>{getTimeString(element.StartedOn, element.status)}</span>
                          </div>
                      ),
                      cellContent: element.status,
                  },
              ],
          })),
})

const getLicenseDetailData = (element: ImageScanLicenseListType) => ({
    titlePrefix: 'Image',
    title: element.image,
    headers: [
        { headerText: 'classification', isSortable: false, width: 150 },
        {
            headerText: 'severity',
            isSortable: true,
            width: 100,
            compareFunc: compareSeverity,
            defaultSortOrder: SEVERITY_DEFAULT_SORT_ORDER,
        },
        { headerText: 'license', isSortable: false, width: 150 },
        { headerText: 'package', isSortable: true, width: 296 },
    ],
    rows: !element?.list?.length
        ? null
        : element.list.map((child, index) => ({
              id: index,
              expandableComponent: null,
              cells: [
                  {
                      component: (
                          <span className={child.classification.toLowerCase() === 'restricted' ? 'cr-5' : ''}>
                              {child.classification}
                          </span>
                      ),
                      cellContent: child.classification,
                  },
                  {
                      component: (
                          <span className={`severity-chip severity-chip--${child.severity?.toLowerCase()}`}>
                              {child.severity}
                          </span>
                      ),
                      cellContent: child.severity,
                  },
                  {
                      component: null,
                      cellContent: child.license,
                  },
                  {
                      component: null,
                      cellContent: child.package || child.source,
                  },
              ],
          })),
    defaultSortIndex: 1,
    entities: mapSeveritiesToSegmentedBarChartEntities(element.summary.severities),
    lastScanTimeString: element.StartedOn,
    scanToolName: element.scanToolName,
    scanToolUrl: element.scanToolUrl,
    status: element.status,
})

const getLicenseData = (
    data: ImageScan['license'],
    setDetailViewData: OpenDetailViewButtonProps['setDetailViewData'],
) => ({
    headers: [
        { headerText: 'image', isSortable: false, width: 256 },
        { headerText: 'risks detected', isSortable: false, width: 256 },
        { headerText: 'last scanned on', isSortable: false, width: 200 },
    ],
    rows: !data?.list?.length
        ? null
        : data.list.map((element, index) => ({
              id: index,
              expandableComponent: null,
              cells: [
                  {
                      component: (
                          <OpenDetailViewButton
                              detailViewData={getLicenseDetailData(element)}
                              setDetailViewData={setDetailViewData}
                          >
                              <span className="cb-5 fw-4 cursor">{element.image}</span>
                          </OpenDetailViewButton>
                      ),
                      cellContent: element.image,
                  },
                  {
                      component: null,
                      cellContent:
                          stringifySeverities(element.summary.severities) ||
                          (element.status === 'Completed' ? 'No license risk found' : '-'),
                  },
                  {
                      component: (
                          <div className="flexbox dc__align-items-center dc__gap-4">
                              {getProgressingStateForStatus(element.status)}
                              <span>{getTimeString(element.StartedOn, element.status)}</span>
                          </div>
                      ),
                      cellContent: element.status,
                  },
              ],
          })),
})

export const getImageScanTableData = (
    data: ImageScan,
    subCategory: SecurityModalStateType['subCategory'],
    setDetailViewData: OpenDetailViewButtonProps['setDetailViewData'],
    hidePolicy: boolean,
): TablePropsType => {
    switch (subCategory) {
        case SUB_CATEGORIES.VULNERABILITIES:
            return getVulnerabilitiesData(data[subCategory], setDetailViewData, hidePolicy)
        case SUB_CATEGORIES.LICENSE:
            return getLicenseData(data[subCategory], setDetailViewData)
        default:
            return null
    }
}

export const getImageScanInfoCardData = (
    data: ImageScan,
    subCategory: SecurityModalStateType['subCategory'],
): InfoCardPropsType => {
    const image = data[subCategory]?.list?.[0]
    const scanInfo: Pick<InfoCardPropsType, 'scanToolName' | 'scanToolUrl'> = {
        scanToolName: image?.scanToolName,
        scanToolUrl: image?.scanToolUrl,
    }

    switch (subCategory) {
        case SUB_CATEGORIES.VULNERABILITIES:
            return {
                entities: mapSeveritiesToSegmentedBarChartEntities(data[subCategory]?.summary.severities),
                ...scanInfo,
            }
        case SUB_CATEGORIES.LICENSE:
            return {
                entities: mapSeveritiesToSegmentedBarChartEntities(data[subCategory]?.summary.severities),
                ...scanInfo,
            }
        default:
            return null
    }
}

const getCompletedEmptyState = (
    subCategory: SecurityModalStateType['subCategory'],
    detailViewData: NonNullable<DetailViewDataType>,
) => {
    /**
     * NOTE: show empty state only when we don't have any data to show;
     * ImageScan can only have empty state in detailView */
    if (detailViewData.rows) {
        return null
    }

    const detailViewTitleText = `${detailViewData.titlePrefix}: ${detailViewData.title}`

    const scanCompletedState = getScanCompletedEmptyState(detailViewData.scanToolName, detailViewData.scanToolUrl)

    switch (subCategory) {
        case SUB_CATEGORIES.VULNERABILITIES:
            return {
                ...scanCompletedState,
                subTitle: `No security vulnerability found in ${detailViewTitleText}`,
            }
        case SUB_CATEGORIES.LICENSE:
            return {
                ...scanCompletedState,
                subTitle: `No license risk found in ${detailViewTitleText}`,
            }
        default:
            return null
    }
}

export const getImageScanEmptyState = (
    data: ScanResultDTO,
    subCategory: SecurityModalStateType['subCategory'],
    detailViewData: DetailViewDataType,
): EmptyStateType => {
    /**
     * NOTE: handling for resourceScan in ResourceBrowser
     * TODO: handle properly */
    if (!data[CATEGORIES.IMAGE_SCAN]?.[subCategory]?.list?.length) {
        return SCAN_IN_PROGRESS_EMPTY_STATE
    }

    if (!detailViewData) {
        return null
    }

    switch (detailViewData.status) {
        case 'Failed':
            return SCAN_FAILED_EMPTY_STATE
        case 'Completed':
            return getCompletedEmptyState(subCategory, detailViewData)
        case 'Progressing':
        case 'Running':
        default:
            return SCAN_IN_PROGRESS_EMPTY_STATE
    }
}
