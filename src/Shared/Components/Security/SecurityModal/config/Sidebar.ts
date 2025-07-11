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

import { TreeItem, TreeViewProps } from '@Shared/Components/TreeView'

import { GetSidebarDataParamsType } from '../../types'
import { CATEGORY_LABELS, SUB_CATEGORY_LABELS } from '../constants'
import { CATEGORIES, SeveritiesDTO, SidebarDataChildType, SUB_CATEGORIES } from '../types'

export const getSecurityModalSidebarId = ({ category, subCategory }: SidebarDataChildType['value']): string =>
    JSON.stringify({ category, subCategory })

export const getSecurityModalSidebarChildFromId = (id: string): SidebarDataChildType['value'] => {
    const parsedId = JSON.parse(id)
    return {
        category: parsedId.category,
        subCategory: parsedId.subCategory,
    }
}

export const getSidebarData = ({
    imageScan,
    codeScan,
    kubernetesManifest,
    imageScanLicenseRisks,
    selectedId,
    scanResult,
}: GetSidebarDataParamsType): TreeViewProps['nodes'] => {
    const nodes: TreeViewProps['nodes'] = [
        ...(imageScan
            ? ([
                  {
                      type: 'heading',
                      title: CATEGORY_LABELS.IMAGE_SCAN,
                      id: CATEGORY_LABELS.IMAGE_SCAN,
                      items: [
                          {
                              type: 'item',
                              title: SUB_CATEGORY_LABELS.VULNERABILITIES,
                              id: getSecurityModalSidebarId({
                                  category: CATEGORIES.IMAGE_SCAN,
                                  subCategory: SUB_CATEGORIES.VULNERABILITIES,
                              }),
                          },
                          ...(imageScanLicenseRisks
                              ? ([
                                    {
                                        type: 'item',
                                        title: SUB_CATEGORY_LABELS.LICENSE,
                                        id: getSecurityModalSidebarId({
                                            category: CATEGORIES.IMAGE_SCAN,
                                            subCategory: SUB_CATEGORIES.LICENSE,
                                        }),
                                    },
                                ] satisfies TreeItem[])
                              : []),
                      ],
                  },
              ] satisfies TreeViewProps['nodes'])
            : []),
        ...(codeScan
            ? ([
                  {
                      type: 'heading',
                      title: CATEGORY_LABELS.CODE_SCAN,
                      id: CATEGORY_LABELS.CODE_SCAN,
                      items: [
                          {
                              type: 'item',
                              title: SUB_CATEGORY_LABELS.VULNERABILITIES,
                              id: getSecurityModalSidebarId({
                                  category: CATEGORIES.CODE_SCAN,
                                  subCategory: SUB_CATEGORIES.VULNERABILITIES,
                              }),
                          },
                          {
                              type: 'item',
                              title: SUB_CATEGORY_LABELS.LICENSE,
                              id: getSecurityModalSidebarId({
                                  category: CATEGORIES.CODE_SCAN,
                                  subCategory: SUB_CATEGORIES.LICENSE,
                              }),
                          },
                          {
                              type: 'item',
                              title: SUB_CATEGORY_LABELS.MISCONFIGURATIONS,
                              id: getSecurityModalSidebarId({
                                  category: CATEGORIES.CODE_SCAN,
                                  subCategory: SUB_CATEGORIES.MISCONFIGURATIONS,
                              }),
                          },
                          {
                              type: 'item',
                              title: SUB_CATEGORY_LABELS.EXPOSED_SECRETS,
                              id: getSecurityModalSidebarId({
                                  category: CATEGORIES.CODE_SCAN,
                                  subCategory: SUB_CATEGORIES.EXPOSED_SECRETS,
                              }),
                          },
                      ],
                  },
              ] satisfies TreeViewProps['nodes'])
            : []),
        ...(kubernetesManifest
            ? ([
                  {
                      type: 'heading',
                      title: CATEGORY_LABELS.KUBERNETES_MANIFEST,
                      id: CATEGORY_LABELS.KUBERNETES_MANIFEST,
                      items: [
                          {
                              type: 'item',
                              title: SUB_CATEGORY_LABELS.MISCONFIGURATIONS,
                              id: getSecurityModalSidebarId({
                                  category: CATEGORIES.KUBERNETES_MANIFEST,
                                  subCategory: SUB_CATEGORIES.MISCONFIGURATIONS,
                              }),
                          },
                          {
                              type: 'item',
                              title: SUB_CATEGORY_LABELS.EXPOSED_SECRETS,
                              id: getSecurityModalSidebarId({
                                  category: CATEGORIES.KUBERNETES_MANIFEST,
                                  subCategory: SUB_CATEGORIES.EXPOSED_SECRETS,
                              }),
                          },
                      ],
                  },
              ] satisfies TreeViewProps['nodes'])
            : []),
    ] satisfies TreeViewProps['nodes']

    // Not implementing complete dfs since its not nested, traversing
    const parsedNodes = nodes.map<(typeof nodes)[number]>((node) => {
        if (node.type === 'heading') {
            const items = node.items.map<(typeof node.items)[number]>((item) => {
                if (item.type === 'heading') {
                    throw new Error(
                        'Broken assumption: Heading should not have nested headings in security sidebar, Please implement dfs based handling for nested headings in security sidebar',
                    )
                }

                const { category, subCategory } = getSecurityModalSidebarChildFromId(item.id)
                const subCategoryResult = scanResult[category]?.[subCategory]

                const severities: Partial<Record<SeveritiesDTO, number>> =
                    subCategoryResult?.summary?.severities || subCategoryResult?.misConfSummary?.status

                const threatCount: number = Object.keys(severities || {}).reduce((acc, key) => {
                    if (key === SeveritiesDTO.SUCCESSES) {
                        return acc
                    }
                    return acc + severities[key]
                }, 0)

                return {
                    ...item,
                    trailingItem: threatCount
                        ? {
                              type: 'counter',
                              config: {
                                  value: threatCount,
                                  isSelected: selectedId === item.id,
                              },
                          }
                        : null,
                }
            })

            return {
                ...node,
                items,
            }
        }

        return node
    })

    return parsedNodes
}
