export interface MoodDto {
  id: string;
  name: string;
  slug?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
