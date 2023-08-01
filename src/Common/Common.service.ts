import moment from 'moment';
import {get, post} from './Api';
import { ROUTES } from './Constants'
import { sortCallback } from './Helper';
import { TeamList ,ResponseType, DeploymentNodeType } from './Types';

export const getTeamListMin = (): Promise<TeamList> => {
  // ignore active field
  const URL = `${ROUTES.PROJECT_LIST_MIN}`;
  return get(URL).then(response => {
      let list = [];
      if (response && response.result && Array.isArray(response.result)) {
          list = response.result;
      }
      list = list.sort((a, b) => {
          return sortCallback('name', a, b);
      });
      return {
          code: response.code,
          status: response.status,
          result: list,
      };
  });
};

interface UserRole extends ResponseType {
    result?: {
        roles: string[]
        superAdmin: boolean
    }
}

let stageMap = {
    PRECD: 'PRE',
    CD: 'DEPLOY',
    POSTCD: 'POST',
    APPROVAL: 'APPROVAL',
}

export const SourceTypeMap = {
    BranchFixed: 'SOURCE_TYPE_BRANCH_FIXED',
    WEBHOOK: 'WEBHOOK',
    BranchRegex: 'SOURCE_TYPE_BRANCH_REGEX',
}

export type CDModalTabType = 'SECURITY' | 'CHANGES';
export declare const CDModalTab: {
    Security: CDModalTabType;
    Changes: CDModalTabType;
};

export function getUserRole(appName?: string): Promise<UserRole> {
    return get(`${ROUTES.USER_CHECK_ROLE}${appName ? `?appName=${appName}` : ''}`)
}

export function setImageTags(request, pipelineId: number, artifactId: number){
    return post(`${ROUTES.IMAGE_TAGGING}/${pipelineId}/${artifactId}`,request )
}

export const getCDMaterials = (
    cdMaterialId,
    stageType: DeploymentNodeType,
    abortSignal: AbortSignal,
    isApprovalNode?: boolean,
    imageTag?: string): Promise<any> => {
    const URL = (!imageTag) ? `app/cd-pipeline/${cdMaterialId}/material?stage=${stageMap[stageType]}` : `app/cd-pipeline/${cdMaterialId}/material?stage=${stageMap[stageType]}&search=${imageTag}`

    return get(URL, {
        signal: abortSignal,
    }).then((response) => {
        let artifacts = response.result.ci_artifacts ?? []
        if (!response.result) {
            return {
                materials: [],
            }
        }
        else {
            const materials = artifacts.map((material, index) => {
                let artifactStatusValue = ''
                return {
                    index,
                    id: material.id,
                    deployedTime: material.deployed_time
                        ? moment(material.deployed_time).format('ddd, DD MMM YYYY, hh:mm A')
                        : 'Not Deployed',
                    deployedBy: material.deployedBy,
                    wfrId: material.wfrId,
                    image: extractImage(material.image),
                    showChanges: false,
                    vulnerabilities: [],
                    buildTime: material.build_time || '',
                    tab: CDModalTab.Changes,
                    showSourceInfo: false,
                    deployed: material.deployed || false,
                    latest: material.latest || false,
                    vulnerabilitiesLoading: true,
                    scanned: material.scanned,
                    scanEnabled: material.scanEnabled,
                    isSelected: !material.vulnerable && index === 0,
                    vulnerable: material.vulnerable,
                    runningOnParentCd: material.runningOnParentCd,
                    artifactStatus: artifactStatusValue,
                    userApprovalMetadata: material.userApprovalMetadata,
                    triggeredBy: material.triggeredBy,
                    isVirtualEnvironment: material.isVirtualEnvironment,
                    imageComment: material.imageComment,
                    imageReleaseTags: material.imageReleaseTags,
                    materialInfo: material.material_info
                        ? material.material_info.map((mat) => {
                            return {
                                modifiedTime: mat.modifiedTime ? moment(mat.modifiedTime).format("ddd, DD MMM YYYY, hh:mm A") : '',
                                commitLink: createGitCommitUrl(mat.url, mat.revision),
                                author: mat.author || '',
                                message: mat.message || '',
                                revision: mat.revision || '',
                                tag: mat.tag || '',
                                webhookData: mat.webhookData || '',
                                url: mat.url || '',
                                branch:
                                    (material.ciConfigureSourceType === SourceTypeMap.WEBHOOK
                                        ? material.ciConfigureSourceValue
                                        : mat.branch) || '',
                                type: material.ciConfigureSourceType || '',
                            }
                        })
                        : [],
                }
            })
            return {
                materials: materials
            }
        }
    })
}

export function extractImage(image: string): string {
    return image ? image.split(':').pop() : ''
}

export function createGitCommitUrl(url: string, revision: string): string {
    if (!url || !revision) {
        return "NA"
    }
    if (url.indexOf("gitlab") > 0 || url.indexOf("github") > 0 || url.indexOf("azure") > 0) {
        let urlpart = url.split("@")
        if (urlpart.length > 1) {
            return "https://" + urlpart[1].split(".git")[0] + "/commit/" + revision
        }
        if (urlpart.length == 1) {
            return urlpart[0].split(".git")[0] + "/commit/" + revision
        }
    }
    if (url.indexOf("bitbucket") > 0) {
        let urlpart = url.split("@")
        if (urlpart.length > 1) {
            return "https://" + urlpart[1].split(".git")[0] + "/commits/" + revision
        }
        if (urlpart.length == 1) {
            return urlpart[0].split(".git")[0] + "/commits/" + revision
        }
    }
    return "NA"
}
