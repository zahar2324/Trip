// src/hooks/useTrips.ts
import { useCallback, useEffect, useState } from "react";
import type { Trip } from "../types/trips";
import { createTrip as createTripService, fetchUserTrips, updateTrip as updateTripService, deleteTrip as deleteTripService } from "../services/tripService";


export function useTrips(currentUserId: string | null) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!currentUserId) {
      setTrips([]);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUserTrips(currentUserId);
      setTrips(data);
    } catch (e) {
      console.error("useTrips load error:", e);
      setError("Не вдалося завантажити подорожі");
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    void load();
  }, [load]);

  const create = useCallback(
    async (payload: { ownerId: string; title: string; description?: string; startDate?: string; endDate?: string }) => {
      const created = await createTripService(payload.ownerId, payload.title, payload.description ?? "", payload.startDate, payload.endDate);
      setTrips(prev => [...prev, created]);
      return created;
    },
    []
  );

  const update = useCallback(async (id: string, changes: Partial<Pick<Trip, "title" | "description" | "startDate" | "endDate">>) => {
    await updateTripService(id, changes);
    setTrips(prev => prev.map(t => (t.id === id ? { ...t, ...changes } as Trip : t)));
  }, []);

  const remove = useCallback(async (id: string) => {
    await deleteTripService(id);
    setTrips(prev => prev.filter(t => t.id !== id));
  }, []);

  return { trips, loading, error, reload: load, create, update, remove } as const;
}