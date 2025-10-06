import { useMemo, useState } from "react";
import Header from "../src/components/Header";
import { useAuthStore } from "../store/userStore";
import { useNavigate } from "react-router-dom";
import type { Trip } from "../types/trips";
import { useTrips } from "../hooks/useTrips";
import TripForm from "../src/components/TripForm";
import TripList from "../src/components/TripList";
import SearchSortBar from "../src/components/SearchSortBar";
import type { SortKey, SortOrder } from "../src/components/SearchSortBar";

export default function TripsPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuthStore();
  const { trips, loading, error, create, update, remove } = useTrips(user?.uid ?? null);
  const [editingTripId, setEditingTripId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("title");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
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
  const visibleTrips = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = q
      ? trips.filter(t => {
          const title = (t.title ?? "").toLowerCase();
          const desc = (t.description ?? "").toLowerCase();
          return title.includes(q) || desc.includes(q);
        })
      : trips.slice();
    const compare = (a: Trip, b: Trip) => {
      if (sortKey === "title") {
        const A = (a.title ?? "").toLowerCase();
        const B = (b.title ?? "").toLowerCase();
        if (A < B) return -1;
        if (A > B) return 1;
        return 0;
      }

      const aDate = a.startDate ?? "";
      const bDate = b.startDate ?? "";
      if (!aDate && !bDate) return 0;
      if (!aDate) return 1;
      if (!bDate) return -1;
      if (aDate < bDate) return -1;
      if (aDate > bDate) return 1;
      return 0;
    };

    filtered.sort((a, b) => (sortOrder === "asc" ? compare(a, b) : -compare(a, b)));

    return filtered;
  }, [trips, search, sortKey, sortOrder]);

  if (authLoading || loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div>
      <Header />
      <main className="p-4 max-w-4xl mx-auto">
        <h2 className="text-xl font-bold mb-4">My Trips</h2>

        {user && <TripForm ownerId={user.uid} onCreate={payload => create(payload)} />}

    
        <SearchSortBar
          search={search}
          onSearch={setSearch}
          sortKey={sortKey}
          onSortKey={k => setSortKey(k)}
          sortOrder={sortOrder}
          onToggleSortOrder={() => setSortOrder(prev => (prev === "asc" ? "desc" : "asc"))}
        />

        {error && <p className="text-red-500">{error}</p>}

        <TripList
          trips={visibleTrips}
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