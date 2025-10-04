import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, SignupSchema } from '@utils/validators';
import { Input } from '@components/common/Input';
import { Button } from '@components/common/Button';
import { SearchableSelect } from '@components/common/SearchableSelect';
import { useCurrency } from '@hooks/useCurrency';
import { useAuthContext } from '@context/AuthContext';
import { Loader } from '@components/common/Loader';

export const SignupForm: React.FC = () => {
  const { signup } = useAuthContext();
  const { countries, loading: loadingCountries } = useCurrency();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      country: '',
      currency: '',
    },
  });

  const countryOptions = useMemo(
    () =>
      countries.map((country) => ({
        value: country.name,
        label: country.name,
        meta: ${country.currency} · ,
      })),
    [countries]
  );

  const currencyOptions = useMemo(
    () =>
      countries.map((country) => ({
        label: ${country.currency} · ,
        value: country.currency,
      })),
    [countries]
  );

  const onSubmit = async (data: SignupSchema) => {
    await signup(data);
  };

  if (loadingCountries && countries.length === 0) {
    return <Loader label="Loading countries" />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Company Name" placeholder="Acme Inc." error={errors.name?.message} {...register('name')} />
      <Input label="Work Email" placeholder="you@company.com" error={errors.email?.message} {...register('email')} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input type="password" label="Password" error={errors.password?.message} {...register('password')} />
        <Input
          type="password"
          label="Confirm Password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
      </div>

      <SearchableSelect
        label="Country"
        placeholder="Select your company country"
        options={countryOptions}
        value={watch('country')}
        onChange={(value) => setValue('country', value)}
        error={errors.country?.message}
      />

      <SearchableSelect
        label="Base Currency"
        placeholder="Select your base currency"
        options={currencyOptions}
        value={watch('currency')}
        onChange={(value) => setValue('currency', value)}
        error={errors.currency?.message}
      />

      <Button type="submit" className="w-full" loading={isSubmitting}>
        Create Company Account
      </Button>
    </form>
  );
};
