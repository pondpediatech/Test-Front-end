import { getMeUser } from '../../_utilities/getMeUser'
import MessagesPage from './messages/page'

export default async function Assistant() {
  const nullUserRedirect = '/login?error=' + encodeURIComponent('You must be logged in to access your account.') + '&redirect=' + encodeURIComponent('/users');
  const validUserRedirect = "/users/assistants/messages";
  
  await getMeUser({ nullUserRedirect, validUserRedirect });
}