import { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../src/components/Header";
import { db } from "../services/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { sendInviteEmail } from "../src/utils/sendInviteEmail";
import { useAuthStore } from "../store/userStore";

export default function TripAccessPage() {
  const { id } = useParams<{ id?: string }>();
  const { user } = useAuthStore();

  const [collEmail, setCollEmail] = useState("");
  const [collError, setCollError] = useState<string | null>(null);
  const [collLoading, setCollLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!id) return <p>Невірний маршрут: id подорожі відсутній</p>;

  const handleAddCollaborator = async () => {
    setCollError(null);
    setSuccessMsg(null);

    const email = collEmail.trim().toLowerCase();

    if (!email) return setCollError("Введіть email");
    if (email === user?.email) return setCollError("Не можна запросити себе");

    try {
      setCollLoading(true);

      // Перевіряємо, чи вже є активне запрошення
      const q = query(
        collection(db, "invites"),
        where("email", "==", email),
        where("tripId", "==", id),
        
      );
      const existing = await getDocs(q);
      if (!existing.empty) {
        setCollError("Вже є активне запрошення для цього email");
        setCollLoading(false);
        return;
      }

      // Генеруємо токен
      const token = crypto.randomUUID();

      // Додаємо документ у Firestore
      await addDoc(collection(db, "invites"), {
        email,
        tripId: id,
        token,
        accepted: false,
        createdAt: serverTimestamp(),
      });


      await sendInviteEmail(email, id, token);

      setSuccessMsg(`Інвайт надіслано на ${email}`);
      setCollEmail("");
    } catch (e: any) {
      console.error("add collaborator error", e);
      setCollError(e?.message ?? "Не вдалося надіслати запрошення");
    } finally {
      setCollLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <main className="p-4 max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">Запросити колаборатора</h2>

        <div className="border p-3 rounded mb-4 bg-white">
          <label className="block text-sm font-medium mb-1">Email</label>
          <div className="flex gap-2">
            <input
              value={collEmail}
              onChange={(e) => setCollEmail(e.target.value)}
              className="border p-2 w-full"
              placeholder="user@example.com"
            />
            <button
              onClick={handleAddCollaborator}
              disabled={collLoading}
              className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
              {collLoading ? "Adding..." : "Add"}
            </button>
          </div>
          {collError && <div className="text-red-600 mt-2">{collError}</div>}
          {successMsg && <div className="text-green-600 mt-2">{successMsg}</div>}
        </div>
      </main>
    </div>
  );
}
