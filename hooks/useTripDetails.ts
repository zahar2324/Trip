import { useCallback, useEffect, useState } from "react";
import type { Place } from "../types/tripDetail";
import type { Trip } from "../types/trips";
import { fetchTripById, fetchPlacesForTrip, addPlaceToTrip } from "../services/tripDetailService";


export function useTripDetails(tripId: string | undefined) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTrip = useCallback(async () => {
    if (!tripId) return;
    setLoading(true);
    setError(null);
    try {
      const t = await fetchTripById(tripId);
      setTrip(t);
    } catch (e) {
      console.error("fetchTrip error:", e);
      setError("Не вдалося завантажити подорож");
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  const loadPlaces = useCallback(async () => {
    if (!tripId) return;
    setLoading(true);
    setError(null);
    try {
      const p = await fetchPlacesForTrip(tripId);
      setPlaces(p);
    } catch (e) {
      console.error("fetchPlaces error:", e);
      setError("Не вдалося завантажити місця");
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    void loadTrip();
  }, [loadTrip]);

  useEffect(() => {
    void loadPlaces();
  }, [loadPlaces]);

  const addPlace = useCallback(async (payload: Omit<Place, "id">) => {
    if (!tripId) throw new Error("No tripId");
    const created = await addPlaceToTrip(tripId, payload);
    setPlaces(prev => [...prev, created].sort((a, b) => a.dayNumber - b.dayNumber));
    return created;
  }, [tripId]);

  return {
    trip,
    places,
    loading,
    error,
    reloadTrip: loadTrip,
    reloadPlaces: loadPlaces,
    addPlace,
  } as const;
}