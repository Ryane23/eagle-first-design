import { useState, useCallback } from 'react';

export interface ValidationRules {
  [key: string]: (value: any) => boolean | string;
}

export const useFormValidation = <T extends Record<string, any>>(
  initialValues: T,
  rules: ValidationRules
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = useCallback((fieldName?: string) => {
    const fieldsToValidate = fieldName ? [fieldName] : Object.keys(rules);
    const newErrors: Record<string, string> = { ...errors };

    fieldsToValidate.forEach(field => {
      const rule = rules[field];
      if (rule) {
        const result = rule(values[field]);
        if (typeof result === 'string') {
          newErrors[field] = result;
        } else if (!result) {
          newErrors[field] = 'Invalid value';
        } else {
          delete newErrors[field];
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, rules, errors]);

  const handleChange = useCallback((name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    validate,
    reset,
    isValid: Object.keys(errors).length === 0
  };
};