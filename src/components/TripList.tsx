
import TripItem from "./TripItem";
import type { Props } from "../../types/tripItem";

export default function TripList({ trips, currentUserId, editingId, onStartEdit, onSave, onCancelEdit, onDelete, onOpen }: Props) {
  if (trips.length === 0) return <p>Подорожей ще немає.</p>;

  return (
    <ul>
      {trips.map(trip => (
        <TripItem
          key={trip.id}
          trip={trip}
          isOwner={trip.ownerId === currentUserId}
          isEditing={editingId === trip.id}
          onStartEdit={onStartEdit}
          onSave={onSave}
          onCancel={onCancelEdit}
          onDelete={onDelete}
          onOpen={onOpen} // <- forward handler
        />
      ))}
    </ul>
  );
}