import { addDoc, collection, getDocs, serverTimestamp, doc, updateDoc, deleteDoc, query, where, getDocs as getDocsFromQuery, arrayUnion } from "firebase/firestore";
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


export async function findUserByEmail(email: string): Promise<{ uid: string; email: string; displayName?: string } | null> {
  const usersCol = collection(db, "users");
  const q = query(usersCol, where("email", "==", email));
  const snap = await getDocsFromQuery(q);
  if (snap.empty) return null;
  const docSnap = snap.docs[0];
  const data = docSnap.data() as any;
  return { uid: docSnap.id, email: data.email, displayName: data.displayName };
}


export async function addCollaboratorToTrip(tripId: string, collaboratorUid: string): Promise<void> {
  const tripRef = doc(db, "trips", tripId);
  await updateDoc(tripRef, { collaborators: arrayUnion(collaboratorUid) });
}


export async function fetchUsersByUids(uids: string[]): Promise<Array<{ uid: string; email?: string; displayName?: string }>> {
  if (!uids || uids.length === 0) return [];
  const usersCol = collection(db, "users");
  const chunks: string[][] = [];
  for (let i = 0; i < uids.length; i += 10) chunks.push(uids.slice(i, i + 10));
  const results: Array<{ uid: string; email?: string; displayName?: string }> = [];
  for (const chunk of chunks) {
    const q = query(usersCol, where("__name__", "in", chunk));
    const snap = await getDocsFromQuery(q);
    snap.docs.forEach(d => {
      const data = d.data() as any;
      results.push({ uid: d.id, email: data.email, displayName: data.displayName });
    });
  }
  return results;
}