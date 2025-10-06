import { getAuth, sendSignInLinkToEmail } from "firebase/auth";

export async function sendInviteEmail(email: string, tripId: string, token: string) {
  const auth = getAuth();

  // URL, куди користувач перейде з листа
  const actionCodeSettings = {
    url: `${window.location.origin}/accept-invite?tripId=${tripId}`,
    handleCodeInApp: true, // обов'язково
  };
const link = `${window.location.origin}/accept-invite?token=${token}`;
  console.log(`Send this link to ${email}: ${link}`);
  await sendSignInLinkToEmail(auth, email, actionCodeSettings);

  // Можна зберегти email у localStorage, щоб потім використати при підтвердженні
  window.localStorage.setItem("inviteEmailForSignIn", email);
}
