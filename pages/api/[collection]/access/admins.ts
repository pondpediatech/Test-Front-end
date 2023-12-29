import type { AccessArgs } from 'payload/config'

import { checkRole } from '../Users/checkRole'
import type { User } from '../../../../app/payload-types'

type isAdmin = (args: AccessArgs<unknown, User>) => boolean

export const admins: isAdmin = ({ req: { user } }) => {
  return checkRole(['admin'], user)
}
