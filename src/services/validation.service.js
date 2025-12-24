// Password regex pattern
// Requirements:
// - At least 8 characters
// - At least one uppercase letter
// - At least one lowercase letter
// - At least one number
// - At least one special character
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Validate password against regex
export const validatePassword = (password) => {
  if (!password) {
    return {
      isValid: false,
      message: 'Password is required'
    };
  }

  if (!passwordRegex.test(password)) {
    return {
      isValid: false,
      message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'
    };
  }

  return {
    isValid: true,
    message: ''
  };
};

// Get password strength indicator
export const getPasswordStrength = (password) => {
  if (!password) return { strength: 0, label: '' };

  let strength = 0;
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&]/.test(password)
  };

  Object.values(checks).forEach(check => {
    if (check) strength++;
  });

  const labels = {
    0: '',
    1: 'Very Weak',
    2: 'Weak',
    3: 'Fair',
    4: 'Good',
    5: 'Strong'
  };

  return {
    strength,
    label: labels[strength] || '',
    checks
  };
};
