import { z } from 'zod'

// Mirrors Abio-Backend/src/modules/auth/auth.schemas.ts and
// shared/utils/constants.ts PASSWORD_COMPLEXITY_REGEX — the backend only
// enforces complexity in production, but validating it client-side always
// avoids a round trip that would fail once deployed.
const PASSWORD_COMPLEXITY_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).+$/

const passwordField = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(PASSWORD_COMPLEXITY_REGEX, 'Password must include a letter, a number, and a special character')

export const signUpSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: passwordField,
    passwordConfirm: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Passwords do not match',
  })

export type SignUpFormValues = z.infer<typeof signUpSchema>

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export const resetPasswordSchema = z
  .object({
    password: passwordField,
    passwordConfirm: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Passwords do not match',
  })

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
