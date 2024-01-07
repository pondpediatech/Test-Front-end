import { getMeUser } from '../../_utilities/getMeUser'

export default async function Assistant() {
  await getMeUser({
    nullUserRedirect: `/login?error=${encodeURIComponent(
      'You must be logged in to access your account.',
    )}&redirect=${encodeURIComponent('/users')}`,
  })

  await getMeUser({
    validUserRedirect: "/users/assistants/messages",
  });
}
