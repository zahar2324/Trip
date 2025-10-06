import { getAuth, sendSignInLinkToEmail } from "firebase/auth";

export async function sendInviteEmail(email: string, tripId: string, token: string) {
  const auth = getAuth();


  const actionCodeSettings = {
    url: `${window.location.origin}/accept-invite?tripId=${tripId}`,
    handleCodeInApp: true, 
  };
const link = `${window.location.origin}/accept-invite?token=${token}`;
  console.log(`Send this link to ${email}: ${link}`);
  await sendSignInLinkToEmail(auth, email, actionCodeSettings);


  window.localStorage.setItem("inviteEmailForSignIn", email);
}
