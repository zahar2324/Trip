import { doc, getDoc, collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { Place } from "../types/tripDetail";
import type { Trip } from "../types/trips";

export async function fetchTripById(tripId: string): Promise<Trip | null> {
  const ref = doc(db, "trips", tripId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<Trip, "id">) } as Trip;
}

export async function fetchPlacesForTrip(tripId: string): Promise<Place[]> {
  const q = await getDocs(collection(db, "trips", tripId, "places"));
  return q.docs
    .map(d => ({ id: d.id, ...(d.data() as Omit<Place, "id">) } as Place))
    .sort((a, b) => a.dayNumber - b.dayNumber);
}

export async function addPlaceToTrip(tripId: string, payload: Omit<Place, "id">): Promise<Place> {
  const ref = await addDoc(collection(db, "trips", tripId, "places"), payload);
  return { id: ref.id, ...payload };
}