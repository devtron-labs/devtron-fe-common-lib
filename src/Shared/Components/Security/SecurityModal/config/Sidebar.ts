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

import { ScanCategoriesWithLicense } from '../../types'
import { CATEGORY_LABELS, SUB_CATEGORY_LABELS } from '../constants'
import { CATEGORIES, SUB_CATEGORIES, SidebarDataType } from '../types'

export const getSidebarData = (categoriesConfig: Record<ScanCategoriesWithLicense, boolean>): SidebarDataType[] => {
    const { imageScan, codeScan, kubernetesManifest, imageScanLicenseRisks } = categoriesConfig

    return [
        ...(imageScan
            ? [
                  {
                      label: CATEGORY_LABELS.IMAGE_SCAN,
                      isExpanded: true,
                      children: [
                          {
                              label: SUB_CATEGORY_LABELS.VULNERABILITIES,
                              value: {
                                  category: CATEGORIES.IMAGE_SCAN,
                                  subCategory: SUB_CATEGORIES.VULNERABILITIES,
                              },
                          },
                          ...(imageScanLicenseRisks
                              ? [
                                    {
                                        label: SUB_CATEGORY_LABELS.LICENSE,
                                        value: {
                                            category: CATEGORIES.IMAGE_SCAN,
                                            subCategory: SUB_CATEGORIES.LICENSE,
                                        },
                                    },
                                ]
                              : []),
                      ],
                  },
              ]
            : []),
        ...(codeScan
            ? [
                  {
                      label: CATEGORY_LABELS.CODE_SCAN,
                      isExpanded: true,
                      children: [
                          {
                              label: SUB_CATEGORY_LABELS.VULNERABILITIES,
                              value: {
                                  category: CATEGORIES.CODE_SCAN,
                                  subCategory: SUB_CATEGORIES.VULNERABILITIES,
                              },
                          },
                          {
                              label: SUB_CATEGORY_LABELS.LICENSE,
                              value: {
                                  category: CATEGORIES.CODE_SCAN,
                                  subCategory: SUB_CATEGORIES.LICENSE,
                              },
                          },
                          {
                              label: SUB_CATEGORY_LABELS.MISCONFIGURATIONS,
                              value: {
                                  category: CATEGORIES.CODE_SCAN,
                                  subCategory: SUB_CATEGORIES.MISCONFIGURATIONS,
                              },
                          },
                          {
                              label: SUB_CATEGORY_LABELS.EXPOSED_SECRETS,
                              value: {
                                  category: CATEGORIES.CODE_SCAN,
                                  subCategory: SUB_CATEGORIES.EXPOSED_SECRETS,
                              },
                          },
                      ],
                  },
              ]
            : []),
        ...(kubernetesManifest
            ? [
                  {
                      label: CATEGORY_LABELS.KUBERNETES_MANIFEST,
                      isExpanded: true,
                      children: [
                          {
                              label: SUB_CATEGORY_LABELS.MISCONFIGURATIONS,
                              value: {
                                  category: CATEGORIES.KUBERNETES_MANIFEST,
                                  subCategory: SUB_CATEGORIES.MISCONFIGURATIONS,
                              },
                          },
                          {
                              label: SUB_CATEGORY_LABELS.EXPOSED_SECRETS,
                              value: {
                                  category: CATEGORIES.KUBERNETES_MANIFEST,
                                  subCategory: SUB_CATEGORIES.EXPOSED_SECRETS,
                              },
                          },
                      ],
                  },
              ]
            : []),
    ]
}
