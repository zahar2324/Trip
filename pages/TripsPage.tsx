import { useState } from "react";
import Header from "../src/components/Header";
import { useAuthStore } from "../store/userStore";
import { useNavigate } from "react-router-dom";
import type { Trip } from "../types/trips";
import { useTrips } from "../hooks/useTrips";
import TripForm from "../src/components/TripForm";
import TripList from "../src/components/TripList";

export default function TripsPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuthStore();
  const { trips, loading, error, create, update, remove } = useTrips(user?.uid ?? null);

  const [editingTripId, setEditingTripId] = useState<string | null>(null);

  const startEditTrip = (trip: Trip) => setEditingTripId(trip.id);
  const cancelEdit = () => setEditingTripId(null);

  const handleSave = async (id: string, changes: Partial<Pick<Trip, "title" | "description" | "startDate" | "endDate">>) => {
    await update(id, changes);
    setEditingTripId(null);
  };

  const handleDelete = async (id: string) => {
    await remove(id);
  };

  const handleOpen = (id: string) => {
    navigate(`/trips/${id}`);
  };

  if (authLoading || loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div>
      <Header />
      <main className="p-4 max-w-4xl mx-auto">
        <h2 className="text-xl font-bold mb-4">My Trips</h2>

        {user && <TripForm ownerId={user.uid} onCreate={payload => create(payload)} />}

        {error && <p className="text-red-500">{error}</p>}

        <TripList
          trips={trips}
          currentUserId={user?.uid ?? null}
          editingId={editingTripId}
          onStartEdit={startEditTrip}
          onSave={handleSave}
          onCancelEdit={cancelEdit}
          onDelete={handleDelete}
          onOpen={handleOpen} 
        />
      </main>
    </div>
  );
}