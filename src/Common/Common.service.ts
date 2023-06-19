import {get, post} from './Api';
import { ROUTES } from './Constants'
import { sortCallback } from './Helper';
import { TeamList ,ResponseType } from './Types';

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