import type { Access } from 'payload/types'

import { checkRole } from '../checkRole'

const adminsAndUser: Access = ({ req: { user } }) => {
  if (user) {
    if (checkRole(['admin'], user)) {
      return true
    }

    return {
      user: {
        equals: user.id,
      },
    }
  }

  console.log('help meeeeee',user)


  return false
}

export default adminsAndUser
