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
    const URL = (!imageTag) ? `app/cd-pipeline/${cdMaterialId}/material?stage=${stageType}` : `app/cd-pipeline/${cdMaterialId}/material?stage=APPROVAL&search=${imageTag}`

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
                    showSourceInfo: false,
                    deployed: material.deployed || false,
                    latest: material.latest || false,
                    vulnerabilitiesLoading: true,
                    scanned: material.scanned,
                    scanEnabled: material.scanEnabled,
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
                                author: mat.author || '',
                                message: mat.message || '',
                                revision: mat.revision || '',
                                tag: mat.tag || '',
                                webhookData: mat.webhookData || '',
                                url: mat.url || '',
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