import { get } from './Api';
import { ROUTES } from './Constants'
import { sortCallback } from './Helper';
import { TeamList } from './Types';

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