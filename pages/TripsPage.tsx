import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, serverTimestamp, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import Header from "../src/components/Header";
import { useAuthStore } from "../store/userStore";
import { useNavigate } from "react-router-dom";

type Trip = {
  id: string;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  ownerId: string;
  collaborators: string[];
};

export default function TripsPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuthStore();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [fetchError, setFetchError] = useState("");
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState("");

  const [editingTripId, setEditingTripId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStartDate, setEditStartDate] = useState("");
  const [editEndDate, setEditEndDate] = useState("");

  // Завантаження подорожей
  useEffect(() => {
    const fetchTrips = async () => {
      if (!user) {
        setTrips([]);
        setLoading(false);
        return;
      }

      try {
        const querySnapshot = await getDocs(collection(db, "trips"));
        const userTrips = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as Trip))
          .filter(trip => {
            const collaborators = Array.isArray(trip.collaborators) ? trip.collaborators : [];
            return trip.ownerId === user.uid || collaborators.includes(user.uid);
          });
        setTrips(userTrips);
      } catch (err: any) {
        console.error("🔥 Error fetching trips:", err?.code || err?.message || err);
        setFetchError("Не вдалося завантажити подорожі");
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [user]);

  // Створення подорожі
  const handleCreateTrip = async () => {
    setFormError("");
    if (!user) return setFormError("Зареєструйтесь або увійдіть, щоб створювати подорожі.");
    if (!title) return setFormError("Введіть назву подорожі.");
    if (startDate && endDate && startDate > endDate) return setFormError("Start date must be before end date");

    const docRef = await addDoc(collection(db, "trips"), {
      title,
      description,
      startDate: startDate || null,
      endDate: endDate || null,
      ownerId: user.uid,
      collaborators: [],
      createdAt: serverTimestamp(),
    });

    setTrips([...trips, { id: docRef.id, title, description, startDate, endDate, ownerId: user.uid, collaborators: [] }]);
    setTitle("");
    setDescription("");
    setStartDate("");
    setEndDate("");
  };

  // Почати редагування
  const startEditTrip = (trip: Trip) => {
    setEditingTripId(trip.id);
    setEditTitle(trip.title);
    setEditDescription(trip.description || "");
    setEditStartDate(trip.startDate || "");
    setEditEndDate(trip.endDate || "");
  };

  // Зберегти зміни
  const saveEditTrip = async () => {
    if (!editingTripId) return;
    try {
      const tripRef = doc(db, "trips", editingTripId);
      await updateDoc(tripRef, {
        title: editTitle,
        description: editDescription,
        startDate: editStartDate || null,
        endDate: editEndDate || null,
      });
      setTrips(trips.map(t => t.id === editingTripId ? { ...t, title: editTitle, description: editDescription, startDate: editStartDate, endDate: editEndDate } : t));
      setEditingTripId(null);
    } catch (err) {
      console.error("Error updating trip:", err);
    }
  };

  // Скасувати редагування
  const cancelEdit = () => setEditingTripId(null);

  // Видалити подорож
  const deleteTrip = async (tripId: string) => {
    try {
      await deleteDoc(doc(db, "trips", tripId));
      setTrips(trips.filter(t => t.id !== tripId));
    } catch (err) {
      console.error("Error deleting trip:", err);
    }
  };

  if (authLoading || loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div>
      <Header />
      <main className="p-4">
        <h2 className="text-xl font-bold mb-4">My Trips</h2>

        {/* Форма створення */}
        {user && (
          <div className="mb-6 border p-4 rounded">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="border p-2 w-full mb-2"
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="border p-2 w-full mb-2"
            />
            <input
              type="date"
              placeholder="Start Date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="border p-2 w-full mb-2"
            />
            <input
              type="date"
              placeholder="End Date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="border p-2 w-full mb-2"
            />
            {formError && <p className="text-red-500 mb-2">{formError}</p>}
            <button onClick={handleCreateTrip} className="bg-indigo-600 text-white px-4 py-2 rounded">
              Create Trip
            </button>
          </div>
        )}

        {/* Вивід подорожей */}
        {fetchError ? (
          <p className="text-red-500">{fetchError}</p>
        ) : trips.length === 0 ? (
          <p>Подорожей ще немає.</p>
        ) : (
          <ul>
            {trips.map(trip => (
              <li key={trip.id} className="border p-2 mb-2 rounded hover:bg-gray-100">
                {editingTripId === trip.id ? (
                  <div className="flex flex-col gap-2">
                    <input value={editTitle} onChange={e => setEditTitle(e.target.value)} className="border p-1" />
                    <input value={editDescription} onChange={e => setEditDescription(e.target.value)} className="border p-1" />
                    <input type="date" value={editStartDate} onChange={e => setEditStartDate(e.target.value)} className="border p-1" />
                    <input type="date" value={editEndDate} onChange={e => setEditEndDate(e.target.value)} className="border p-1" />
                    <div className="flex gap-2">
                      <button onClick={saveEditTrip} className="bg-green-600 text-white px-2 py-1 rounded">Save</button>
                      <button onClick={cancelEdit} className="bg-gray-400 text-white px-2 py-1 rounded">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div className="cursor-pointer" onClick={() => navigate(`/trips/${trip.id}`)}>
                      <h3 className="font-semibold">{trip.title}</h3>
                      <p>{trip.description}</p>
                      {trip.startDate && trip.endDate && <p>{trip.startDate} - {trip.endDate}</p>}
                    </div>
                    {trip.ownerId === user?.uid && (
                      <div className="flex gap-2">
                        <button onClick={() => startEditTrip(trip)} className="bg-yellow-400 text-white px-2 py-1 rounded">Edit</button>
                        <button onClick={() => deleteTrip(trip.id)} className="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
