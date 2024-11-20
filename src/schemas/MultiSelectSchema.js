import { z } from 'zod';

export const MultiSelectSchema = z.object({
  ids: z.array(z.string())
})

export default MultiSelectSchema