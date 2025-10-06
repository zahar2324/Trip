import { useMemo} from "react";
import { useParams } from "react-router-dom";
import Header from "../src/components/Header";
import { useAuthStore } from "../store/userStore";
import { useTripDetails } from "../hooks/useTripDetails";
import PlaceForm from "../src/components/PlaceForm";
import type { Place } from "../types/tripDetail";


export default function TripDetailsPage() {
  const { id } = useParams<{ id?: string }>();
  const { user } = useAuthStore();


  if (!id)
    return (
      <div>
        <Header />
        <main className="p-4">
          <p className="text-red-600">
            Невірний маршрут: id подорожі відсутній
          </p>
        </main>
      </div>
    );

  const { trip, places, collaborators, loading, error, addPlace } =
    useTripDetails(id);

  const userId = user?.uid;
  const isOwnerOrCollaborator = useMemo(() => {
    if (!trip || !userId) return false;
    const coll = Array.isArray(trip.collaborators)
      ? trip.collaborators
      : [];
    return trip.ownerId === userId || coll.includes(userId);
  }, [trip, userId]);

  

  if (loading)
    return (
      <div>
        <Header />
        <main className="p-4">
          <p>Loading...</p>
        </main>
      </div>
    );

  if (error)
    return (
      <div>
        <Header />
        <main className="p-4">
          <p className="text-red-600">{error}</p>
        </main>
      </div>
    );

  if (!trip)
    return (
      <div>
        <Header />
        <main className="p-4">
          <p>Trip not found</p>
        </main>
      </div>
    );

  return (
    <div>
      <Header />
      <main className="p-4 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">{trip.title}</h2>
        <p className="text-gray-700 mb-1">{trip.description}</p>
        <p className="text-sm text-gray-500 mb-4">
          {trip.startDate ?? "—"} — {trip.endDate ?? "—"}
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">Places</h3>

        {isOwnerOrCollaborator && <PlaceForm onAdd={addPlace} />}

        <h3 className="text-xl font-semibold mt-6 mb-2">Collaborators</h3>

        {trip.ownerId === userId && (
          <div className="mt-4">
    <a
      href={`/trips/${id}/access`}
      className="bg-indigo-600 text-white px-4 py-2 rounded inline-block mb-5"
    >
      Запросити колаборатора
    </a>
  </div>
        )}

        <ul>
          {collaborators.length === 0 ? (
            <p className="text-sm text-gray-500 mb-2">
              No collaborators yet
            </p>
          ) : null}
          {collaborators.map((c) => (
            <li key={c.uid} className="border p-3 mb-2 rounded bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">
                    {c.displayName ?? c.email ?? c.uid}
                  </div>
                  <div className="text-sm text-gray-500">{c.email}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-2">All Places</h3>
        <ul>
          {places.map((p: Place) => (
            <li key={p.id} className="border p-3 mb-2 rounded bg-white">
              <p className="font-semibold">
                Day {p.dayNumber}: {p.locationName}
              </p>
              <p className="text-sm text-gray-700">{p.notes}</p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
