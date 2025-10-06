import { addDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
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
    .map(doc => ({ id: doc.id, ...doc.data() } as Trip))
    .filter(trip => trip.ownerId === userId || trip.collaborators.includes(userId));
}