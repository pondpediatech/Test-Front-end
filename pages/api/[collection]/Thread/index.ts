import type { CollectionConfig } from 'payload/types'
import { admins } from '../access/admins'
import { anyone } from '../access/anyone'
import adminsAndUser from './access/adminsAndUser'
import { checkRole } from './checkRole'

const Thread: CollectionConfig = {
  slug: 'thread',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: adminsAndUser,
    create: adminsAndUser,
    update: adminsAndUser,
    delete: adminsAndUser,
    admin: ({ req: { user } }) => checkRole(['admin'], user),
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true
    },
    {
      name: 'assistantId',
      type: 'text',
      required: true
    },
    {
      name: 'threadId',
      type: 'text',
      required: true
    },
    {
      name: 'name',
      type: 'text',
      required: true
    },
  ],
}

export default Thread
