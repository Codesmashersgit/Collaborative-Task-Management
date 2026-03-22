import { z } from 'zod';

export const CreateUserDto = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2),
});

export const LoginDto = z.object({
    email: z.string().email(),
    password: z.string(),
});

export type CreateUserInput = z.infer<typeof CreateUserDto>;
export type LoginInput = z.infer<typeof LoginDto>;
