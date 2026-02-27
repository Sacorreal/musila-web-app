import * as z from 'zod';

export const PlaylistSchema = z.object({
  // Define your schema here
});

export type PlaylistFormValues = z.infer<typeof PlaylistSchema>;
