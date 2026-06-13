export interface ApartmentAvailability {
  id: string;
  slug: string;
  available: boolean;
  available_from: string | null;
  updated_at: string;
}
