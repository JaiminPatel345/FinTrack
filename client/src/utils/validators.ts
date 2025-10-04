import { z } from 'zod';

export const signupSchema = z
  .object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    country: z.string().min(1, 'Select a country'),
    currency: z.string().min(1, 'Select a currency'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const signinSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Enter a valid email'),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const createUserSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  role: z.enum(['manager', 'employee']),
  managerId: z.string().optional().nullable(),
});

export const expenseSchema = z.object({
  description: z.string().min(3, 'Add a description'),
  amount: z.number({ invalid_type_error: 'Amount is required' }).min(0.01, 'Amount must be greater than 0'),
  currency: z.string().min(1, 'Select a currency'),
  categoryId: z.string().min(1, 'Select a category'),
  expenseDate: z.string().min(1, 'Select a date'),
  paidBy: z.enum(['cash', 'card', 'company_card']),
  gstPercentage: z.number().min(0).max(100).optional(),
  remarks: z.string().max(500).optional(),
  receiptUrl: z.string().url().optional(),
});

export type SignupSchema = z.infer<typeof signupSchema>;
export type SigninSchema = z.infer<typeof signinSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
export type CreateUserSchema = z.infer<typeof createUserSchema>;
export type ExpenseSchema = z.infer<typeof expenseSchema>;
