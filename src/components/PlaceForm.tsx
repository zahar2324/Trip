import React from "react";
import UiButton from "./UiButton";
import type { Props } from "../../types/placeForm";


export default function PlaceForm({ onAdd }: Props) {
  const [locationName, setLocationName] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [dayNumber, setDayNumber] = React.useState<number>(1);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const submit = async () => {
    setError(null);
    if (!locationName.trim()) return setError("Введіть назву локації");
    try {
      setLoading(true);
      await onAdd({ locationName: locationName.trim(), notes: notes.trim(), dayNumber });
      setLocationName("");
      setNotes("");
      setDayNumber(1);
    } catch (e) {
      console.error("addPlace error:", e);
      setError("Не вдалося додати місце");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-3 rounded mb-4 bg-white">
      <label className="block text-sm font-medium mb-1">Location name</label>
      <input value={locationName} onChange={e => setLocationName(e.target.value)} className="border p-2 w-full mb-2" />
      <label className="block text-sm font-medium mb-1">Notes</label>
      <textarea value={notes} onChange={e => setNotes(e.target.value)} className="border p-2 w-full mb-2" />
      <label className="block text-sm font-medium mb-1">Day number</label>
      <input type="number" min={1} value={dayNumber} onChange={e => setDayNumber(Number(e.target.value) || 1)} className="border p-2 w-28 mb-2" />
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <UiButton onClick={submit} loading={loading} className="bg-indigo-600 text-white">Add Place</UiButton>
    </div>
  );
}