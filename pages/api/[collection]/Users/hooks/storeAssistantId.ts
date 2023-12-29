import { CollectionAfterLoginHook } from 'payload/types'

export const storeAssistantId: CollectionAfterLoginHook = async ({
  req, // full express request
  user, // user that was logged in
  token, // user token
}) => {
  // Result will be a Post document.

  const result = await req.payload.find({
    collection: 'assistant', // required
    where: {
      user: {
        equals: user.id, // required
      }
    }
  })
  user.assistantId = result.docs[0].assistantId
}
