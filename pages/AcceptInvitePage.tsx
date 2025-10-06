import { useEffect, useState } from "react";
import { getAuth, signInWithEmailLink } from "firebase/auth";
import { useSearchParams } from "react-router-dom";
import { doc, updateDoc, arrayUnion, getFirestore } from "firebase/firestore";
import Header from "../src/components/Header";

export default function AcceptInvitePage() {
  const [message, setMessage] = useState("Processing...");
  const [status, setStatus] = useState<"loading" | "done" | "error">("loading");
  const [params] = useSearchParams();

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();
    const tripId = params.get("tripId");
    const email = window.localStorage.getItem("inviteEmailForSignIn");

    if (!email || !tripId) {
      setMessage("Неправильне посилання або відсутній email");
      setStatus("error");
      return;
    }

    signInWithEmailLink(auth, email, window.location.href)
      .then(async (result) => {
        const user = result.user;
        if (!user.email) throw new Error("User email missing");

        await updateDoc(doc(db, "trips", tripId), {
          collaborators: arrayUnion(user.uid),
        });

        setMessage("✅ Ви успішно приєдналися до подорожі!");
        setStatus("done");
      })
      .catch((error) => {
        console.error(error);
        setMessage("Помилка при підтвердженні інвайту");
        setStatus("error");
      });
  }, []);

  return (
    <div>
      <Header />
      <main className="p-4">
        <p className={status === "error" ? "text-red-600" : "text-green-600"}>
          {message}
        </p>
      </main>
    </div>
  );
}
