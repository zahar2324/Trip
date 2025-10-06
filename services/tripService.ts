
import { addDoc, collection, getDocs, serverTimestamp, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { Trip } from "../types/trips";

export async function createTrip(
  userId: string,
  title: string,
  description: string,
  startDate?: string,
  endDate?: string
): Promise<Trip> {
  const docRef = await addDoc(collection(db, "trips"), {
    title,
    description,
    startDate: startDate || null,
    endDate: endDate || null,
    ownerId: userId,
    collaborators: [],
    createdAt: serverTimestamp(),
  });

  return {
    id: docRef.id,
    title,
    description,
    startDate: startDate || "",
    endDate: endDate || "",
    ownerId: userId,
    collaborators: [],
  };
}

export async function fetchUserTrips(userId: string): Promise<Trip[]> {
  const querySnapshot = await getDocs(collection(db, "trips"));
  return querySnapshot.docs
    .map(d => ({ id: d.id, ...d.data() } as Trip))
    .filter(trip => {
      const coll = Array.isArray(trip.collaborators) ? trip.collaborators : [];
      return trip.ownerId === userId || coll.includes(userId);
    });
}

export async function updateTrip(tripId: string, changes: Partial<Pick<Trip, "title" | "description" | "startDate" | "endDate">>): Promise<void> {
  const tripRef = doc(db, "trips", tripId);
  await updateDoc(tripRef, {
    ...changes,
    startDate: changes.startDate ?? null,
    endDate: changes.endDate ?? null,
  });
}

export async function deleteTrip(tripId: string): Promise<void> {
  await deleteDoc(doc(db, "trips", tripId));
}