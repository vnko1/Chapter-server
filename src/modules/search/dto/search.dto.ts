import { z } from 'zod';

export const searchSchema = z.string().min(2).max(500).trim();
