import { useCallback, useEffect, useState } from "react";
import type { Place } from "../types/tripDetail";
import type { Trip } from "../types/trips";
import { fetchTripById, fetchPlacesForTrip, addPlaceToTrip } from "../services/tripDetailService";
import { findUserByEmail, addCollaboratorToTrip, fetchUsersByUids } from "../services/tripService";

/**
 * useTripDetails(tripId?: string)
 * - handles loading trip, places and collaborators
 * - provides addPlace and addCollaborator helpers
 */
export function useTripDetails(tripId?: string) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [collaborators, setCollaborators] = useState<Array<{ uid: string; email?: string; displayName?: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTrip = useCallback(async () => {
    if (!tripId) return;
    setLoading(true); setError(null);
    try {
      const t = await fetchTripById(tripId);
      setTrip(t);
      const uids = (t?.collaborators && Array.isArray(t.collaborators)) ? t.collaborators : [];
      if (uids.length > 0) {
        const users = await fetchUsersByUids(uids);
        setCollaborators(users);
      } else {
        setCollaborators([]);
      }
    } catch (e) {
      console.error("fetchTrip error:", e);
      setError("Не вдалося завантажити подорож");
    } finally { setLoading(false); }
  }, [tripId]);

  const loadPlaces = useCallback(async () => {
    if (!tripId) return;
    setLoading(true); setError(null);
    try {
      const p = await fetchPlacesForTrip(tripId);
      setPlaces(p);
    } catch (e) {
      console.error("fetchPlaces error:", e);
      setError("Не вдалося завантажити місця");
    } finally { setLoading(false); }
  }, [tripId]);

  useEffect(() => { void loadTrip(); }, [loadTrip]);
  useEffect(() => { void loadPlaces(); }, [loadPlaces]);

  const addPlace = useCallback(async (payload: Omit<Place, "id">) => {
    if (!tripId) throw new Error("No tripId");
    const created = await addPlaceToTrip(tripId, payload);
    setPlaces(prev => [...prev, created].sort((a, b) => a.dayNumber - b.dayNumber));
    return created;
  }, [tripId]);

  const addCollaborator = useCallback(async (email: string) => {
    if (!tripId) throw new Error("No tripId");
    if (!email) throw new Error("No email provided");
    const found = await findUserByEmail(email.trim().toLowerCase());
    if (!found) throw new Error("User with this email not found");
    if (found.uid === trip?.ownerId) throw new Error("Cannot add owner as collaborator");
    await addCollaboratorToTrip(tripId, found.uid);
    setCollaborators(prev => (prev.some(p => p.uid === found.uid) ? prev : [...prev, found]));
    setTrip(prev => prev ? { ...prev, collaborators: Array.isArray(prev.collaborators) ? Array.from(new Set([...prev.collaborators, found.uid])) : [found.uid] } : prev);
    return found;
  }, [tripId, trip]);

  return {
    trip,
    places,
    collaborators,
    loading,
    error,
    reloadTrip: loadTrip,
    reloadPlaces: loadPlaces,
    addPlace,
    addCollaborator,
  } as const;
}