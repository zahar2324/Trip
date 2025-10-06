import React from "react";
import type { Trip } from "../../types/trips";
import UiButton from "./UiButton";

type Props = {
  trip: Trip;
  isOwner: boolean;
  isEditing: boolean;
  onStartEdit: (t: Trip) => void;
  onSave: (id: string, changes: Partial<Pick<Trip, "title" | "description" | "startDate" | "endDate">>) => Promise<void>;
  onCancel: () => void;
  onDelete: (id: string) => Promise<void>;
  onOpen?: (id: string) => void; 
};

export default function TripItem({ trip, isOwner, isEditing, onStartEdit, onSave, onCancel, onDelete, onOpen }: Props) {
  const [editTitle, setEditTitle] = React.useState(trip.title);
  const [editDescription, setEditDescription] = React.useState(trip.description ?? "");
  const [editStartDate, setEditStartDate] = React.useState(trip.startDate ?? "");
  const [editEndDate, setEditEndDate] = React.useState(trip.endDate ?? "");
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  React.useEffect(() => {
    if (isEditing) {
      setEditTitle(trip.title);
      setEditDescription(trip.description ?? "");
      setEditStartDate(trip.startDate ?? "");
      setEditEndDate(trip.endDate ?? "");
    }
  }, [isEditing, trip]);

  const save = async () => {
    setSaving(true);
    try {
      await onSave(trip.id, { title: editTitle, description: editDescription, startDate: editStartDate || undefined, endDate: editEndDate || undefined });
    } finally {
      setSaving(false);
    }
  };

  const del = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!confirm("Видалити подорож?")) return;
    setDeleting(true);
    try {
      await onDelete(trip.id);
    } finally {
      setDeleting(false);
    }
  };

  if (isEditing) {
    return (
      <li className="border p-3 mb-3 rounded bg-white">
        <input className="border p-1 w-full mb-2" value={editTitle} onChange={e => setEditTitle(e.target.value)} />
        <input className="border p-1 w-full mb-2" value={editDescription} onChange={e => setEditDescription(e.target.value)} />
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input type="date" value={editStartDate} onChange={e => setEditStartDate(e.target.value)} className="border p-1" />
          <input type="date" value={editEndDate} onChange={e => setEditEndDate(e.target.value)} className="border p-1" />
        </div>
        <div className="flex gap-2">
          <UiButton onClick={save} loading={saving} className="bg-green-600 text-white">Save</UiButton>
          <button onClick={(e) => { e.stopPropagation(); onCancel(); }} className="bg-gray-300 text-black px-3 py-1 rounded">Cancel</button>
        </div>
      </li>
    );
  }

  return (
    <li
      className="border p-3 mb-3 rounded bg-white flex justify-between items-start cursor-pointer"
      onClick={() => onOpen?.(trip.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") onOpen?.(trip.id); }}
    >
      <div>
        <h4 className="font-semibold">{trip.title}</h4>
        <p className="text-sm text-gray-700">{trip.description || <span className="text-gray-400">Опис відсутній</span>}</p>
        <div className="text-xs text-gray-500 mt-1">{trip.startDate ?? "—"} — {trip.endDate ?? "—"}</div>
      </div>

      {isOwner ? (
        <div className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => onStartEdit(trip)} className="bg-yellow-400 text-white px-3 py-1 rounded">Edit</button>
          <UiButton onClick={del} loading={deleting} className="bg-red-600 text-white">Delete</UiButton>
        </div>
      ) : null}
    </li>
  );
}