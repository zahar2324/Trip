import type { Place } from "./tripDetail";

export type Props = {
  onAdd: (payload: Omit<Place, "id">) => Promise<Place>;
};
