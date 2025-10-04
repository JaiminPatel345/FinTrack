import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signinSchema, SigninSchema } from '@utils/validators';
import { Input } from '@components/common/Input';
import { Button } from '@components/common/Button';
import { useAuthContext } from '@context/AuthContext';

export const SigninForm: React.FC = () => {
  const { signin } = useAuthContext();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SigninSchema>({
    resolver: zodResolver(signinSchema),
  });

  const onSubmit = async (data: SigninSchema) => {
    await signin(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Email" placeholder="you@company.com" error={errors.email?.message} {...register('email')} />
      <Input
        type="password"
        label="Password"
        placeholder="Enter your password"
        error={errors.password?.message}
        {...register('password')}
      />

      <Button type="submit" className="w-full" loading={isSubmitting}>
        Sign in
      </Button>
    </form>
  );
};
