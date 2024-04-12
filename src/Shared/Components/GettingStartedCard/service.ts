import { post, ROUTES } from '../../../Common'
import { LoginCountType } from './types'

const updateLoginCount = (payload): Promise<LoginCountType> =>
    post(`${ROUTES.ATTRIBUTES_USER}/${ROUTES.UPDATE}`, payload)

export default updateLoginCount
