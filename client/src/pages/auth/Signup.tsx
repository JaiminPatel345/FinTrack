import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch } from '../../hooks/redux';
import { setCredentials } from '../../store/slices/authSlice';
import { authService } from '../../services/auth.service';
import { countriesService } from '../../services/countries.service';
import { signupSchema } from '../../utils/validators';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { SearchableSelect } from '../../components/common/SearchableSelect';
import { Card } from '../../components/common/Card';
import { showSuccessToast, showErrorToast } from '../../components/common/Toast';
import { getErrorMessage } from '../../utils/helpers';
import { UserPlus } from 'lucide-react';
import type { SignupRequest } from '../../types/auth.types';
import { z } from 'zod';

type SignupFormData = z.infer<typeof signupSchema>;

interface Country {
  name: string;
  currency: string;
  currencyName: string;
}

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data = await countriesService.getCountries();
        setCountries(data);
      } catch (error) {
        showErrorToast('Failed to load countries', getErrorMessage(error));
      } finally {
        setLoadingCountries(false);
      }
    };
    fetchCountries();
  }, []);

  const countryOptions = countries.map((country) => ({
    value: country.name,
    label: `${country.name} (${country.currency})`,
  }));

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      const signupData = {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        country: data.country,
      };
      const response = await authService.signup(signupData as SignupRequest);
      dispatch(setCredentials({ user: response.user, token: response.token }));
      showSuccessToast('Welcome!', 'Your account has been created successfully.');
      navigate('/dashboard');
    } catch (error) {
      showErrorToast('Sign up failed', getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">
            Expense Manager
          </h1>
          <p className="text-gray-600">Create your account</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="John"
                {...register('firstName')}
                error={errors.firstName?.message}
                required
              />

              <Input
                label="Last Name"
                placeholder="Doe"
                {...register('lastName')}
                error={errors.lastName?.message}
                required
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              placeholder="john.doe@example.com"
              {...register('email')}
              error={errors.email?.message}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter a strong password"
              {...register('password')}
              error={errors.password?.message}
              helperText="Must be at least 8 characters with uppercase, lowercase, and number"
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Re-enter your password"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country <span className="text-red-500">*</span>
              </label>
              {loadingCountries ? (
                <p className="text-sm text-gray-500">Loading countries...</p>
              ) : (
                <SearchableSelect
                  placeholder="Select your country"
                  options={countryOptions}
                  value={selectedCountry}
                  onChange={(value) => {
                    setSelectedCountry(value);
                    setValue('country', value);
                  }}
                  error={errors.country?.message}
                  required
                />
              )}
            </div>

            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2"
              isLoading={isLoading}
              loadingText="Creating account..."
              disabled={loadingCountries}
            >
              <UserPlus size={18} />
              Sign Up
            </Button>

            <div className="text-center text-sm">
              <span className="text-gray-600">Already have an account? </span>
              <Link
                to="/signin"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
