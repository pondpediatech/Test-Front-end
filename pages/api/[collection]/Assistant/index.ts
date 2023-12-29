import type { CollectionConfig } from 'payload/types'

type ResponseData = {
  message: string
}

const Assistant: CollectionConfig = {
  slug: 'assistant',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      hasMany: false
    },
    {
      name: 'assistantId',
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

export default Assistant
