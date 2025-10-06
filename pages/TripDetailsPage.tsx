import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, addDoc, getDocs, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuthStore } from "../store/userStore";

type Place = {
  id: string;
  locationName: string;
  notes?: string;
  dayNumber: number;
};

export default function TripDetailsPage() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [trip, setTrip] = useState<any>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPlace, setNewPlace] = useState({ locationName: "", notes: "", dayNumber: 1 });

  // Завантаження подорожі
  useEffect(() => {
    const fetchTrip = async () => {
      if (!id) return;
      const docRef = doc(db, "trips", id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setTrip({ id: snap.id, ...snap.data() });
      }
    };
    fetchTrip();
  }, [id]);

  // Завантаження місць
  useEffect(() => {
    const fetchPlaces = async () => {
      if (!id) return;
      const querySnapshot = await getDocs(collection(db, "trips", id, "places"));
      const data = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Place))
        .sort((a, b) => a.dayNumber - b.dayNumber);
      setPlaces(data);
      setLoading(false);
    };
    fetchPlaces();
  }, [id]);

  // Додавання місця
  const handleAddPlace = async () => {
    if (!newPlace.locationName) return;
    const docRef = await addDoc(collection(db, "trips", id!, "places"), newPlace);
    setPlaces([...places, { id: docRef.id, ...newPlace }]);
    setNewPlace({ locationName: "", notes: "", dayNumber: 1 });
  };

  if (loading) return <p>Loading...</p>;
  if (!trip) return <p>Trip not found</p>;

  const isOwnerOrCollaborator =
    trip.ownerId === user?.uid || trip.collaborators?.includes(user?.uid);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{trip.title}</h2>
      <p>{trip.description}</p>
      <p>
        {trip.startDate} - {trip.endDate}
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-2">Places</h3>

      {isOwnerOrCollaborator && (
        <div className="border p-3 rounded mb-4">
          <input
            type="text"
            placeholder="Location name"
            value={newPlace.locationName}
            onChange={e => setNewPlace({ ...newPlace, locationName: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <textarea
            placeholder="Notes"
            value={newPlace.notes}
            onChange={e => setNewPlace({ ...newPlace, notes: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <input
            type="number"
            placeholder="Day number"
            min={1}
            value={newPlace.dayNumber}
            onChange={e => setNewPlace({ ...newPlace, dayNumber: +e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <button onClick={handleAddPlace} className="bg-indigo-600 text-white px-4 py-2 rounded">
            Add Place
          </button>
        </div>
      )}

      <ul>
        {places.map(place => (
          <li key={place.id} className="border p-3 mb-2 rounded">
            <p className="font-semibold">
              Day {place.dayNumber}: {place.locationName}
            </p>
            <p className="text-sm">{place.notes}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
