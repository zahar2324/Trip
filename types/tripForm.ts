import type { Trip } from "./trips";

 export type Props = {
  ownerId: string;
  onCreate: (payload: { ownerId: string; title: string; description?: string; startDate?: string; endDate?: string }) => Promise<Trip>;
};
