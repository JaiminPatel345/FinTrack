import { z } from 'zod';

/**
 * Email validation schema
 */
export const emailSchema = z.string().email('Invalid email address');

/**
 * Password validation schema
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

/**
 * Signup validation schema
 */
export const signupSchema = z
  .object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    country: z.string().min(1, 'Please select a country'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

/**
 * Signin validation schema
 */
export const signinSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

/**
 * Forgot password validation schema
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

/**
 * Reset password validation schema
 */
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

/**
 * User creation validation schema
 */
export const createUserSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: emailSchema,
  role: z.enum(['admin', 'manager', 'employee']),
  managerId: z.string().optional(),
});

/**
 * Expense validation schema
 */
export const expenseSchema = z.object({
  description: z.string().min(3, 'Description must be at least 3 characters'),
  amount: z.number().positive('Amount must be greater than 0'),
  currency: z.string().min(3, 'Currency is required'),
  categoryId: z.string().min(1, 'Category is required'),
  expenseDate: z.string().min(1, 'Expense date is required'),
  paidBy: z.string().min(1, 'Payment method is required'),
  gstPercentage: z.number().min(0).max(100).optional(),
  remarks: z.string().optional(),
  receiptUrl: z.string().optional(),
});

/**
 * Approval rule validation schema
 */
export const approvalRuleSchema = z.object({
  name: z.string().min(3, 'Rule name must be at least 3 characters'),
  categoryId: z.string().min(1, 'Category is required'),
  minAmount: z.number().min(0, 'Minimum amount must be 0 or greater'),
  maxAmount: z.number().optional(),
  isManagerApprover: z.boolean(),
  approvalType: z.enum(['sequential', 'percentage', 'specific_approver', 'hybrid']),
  minApprovalPercentage: z.number().min(0).max(100).optional(),
  specificApproverId: z.string().optional(),
  steps: z.array(
    z.object({
      approverId: z.string(),
      order: z.number(),
    })
  ),
});
