import type { CollectionConfig } from 'payload/types'

const Thread: CollectionConfig = {
  slug: 'thread',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'assistant',
      type: 'relationship',
      relationTo: 'assistant',
      hasMany: true
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
