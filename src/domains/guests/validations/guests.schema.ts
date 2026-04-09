import * as z from 'zod';

export const GuestsSchema = z.object({
  // Define your schema here
});

export type GuestsFormValues = z.infer<typeof GuestsSchema>;
