import { useForm } from 'react-hook-form';

export const useFormHandler = (defaultValues) => {
  const form = useForm({ defaultValues });

  const handleSubmit = (onSubmit) => (data) => {
    onSubmit(data);
    form.reset();
  };

  return {
    form,
    handleSubmit,
  };
};
