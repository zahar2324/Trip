import { useMemo } from "react";
import { useParams } from "react-router-dom";
import Header from "../src/components/Header";
import { useAuthStore } from "../store/userStore";
import { useTripDetails } from "../hooks/useTripDetails";
import PlaceForm from "../src/components/PlaceForm";
import type { Trip } from "../types/trips";

export default function TripDetailsPage() {
  const { id } = useParams<{ id?: string }>();
  const { user } = useAuthStore();


  if (!id) return (
    <div>
      <Header />
      <main className="p-4">
        <p className="text-red-600">Невірний маршрут: id подорожі відсутній</p>
      </main>
    </div>
  );

  const { trip, places, loading, error, addPlace } = useTripDetails(id);

  const userId = user?.uid;
  const isOwnerOrCollaborator = useMemo(() => {
    if (!trip || !userId) return false;
    const coll = Array.isArray(trip.collaborators) ? trip.collaborators : [];
    return trip.ownerId === userId || coll.includes(userId);
  }, [trip, userId]);

  if (loading) {
    return (
      <div>
        <Header />
        <main className="p-4">
          <p>Loading...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <main className="p-4">
          <p className="text-red-600">{error}</p>
        </main>
      </div>
    );
  }

  if (!trip) {
    return (
      <div>
        <Header />
        <main className="p-4">
          <p>Trip not found</p>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="p-4 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">{(trip as Trip).title}</h2>
        <p className="text-gray-700 mb-1">{(trip as Trip).description}</p>
        <p className="text-sm text-gray-500 mb-4">{(trip as Trip).startDate ?? "—"} — {(trip as Trip).endDate ?? "—"}</p>

        <h3 className="text-xl font-semibold mt-6 mb-2">Places</h3>

        {isOwnerOrCollaborator && (
          <PlaceForm onAdd={async (payload) => {
  const created = await addPlace(payload);
  return created;
}} />
        )}

        <ul>
          {places.map(p => (
            <li key={p.id} className="border p-3 mb-2 rounded bg-white">
              <p className="font-semibold">Day {p.dayNumber}: {p.locationName}</p>
              <p className="text-sm text-gray-700">{p.notes}</p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}