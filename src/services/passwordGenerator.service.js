// Generate a secure random password that meets validation requirements
export const generatePassword = (length = 16) => {
  // Ensure minimum length of 8
  const minLength = Math.max(8, length);
  
  // Character sets
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const special = '@$!%*?&';
  
  // All characters combined
  const allChars = lowercase + uppercase + numbers + special;
  
  // Ensure we have at least one of each required character type
  let password = '';
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];
  
  // Fill the rest with random characters
  for (let i = password.length; i < minLength; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password to avoid predictable pattern
  return shuffleString(password);
};

// Shuffle string characters randomly
const shuffleString = (str) => {
  const arr = str.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join('');
};

// Generate password with custom options
export const generateCustomPassword = (options = {}) => {
  const {
    length = 16,
    includeUppercase = true,
    includeLowercase = true,
    includeNumbers = true,
    includeSpecial = true
  } = options;
  
  const minLength = Math.max(8, length);
  
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const special = '@$!%*?&';
  
  let availableChars = '';
  let password = '';
  
  if (includeLowercase) {
    availableChars += lowercase;
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
  }
  
  if (includeUppercase) {
    availableChars += uppercase;
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
  }
  
  if (includeNumbers) {
    availableChars += numbers;
    password += numbers[Math.floor(Math.random() * numbers.length)];
  }
  
  if (includeSpecial) {
    availableChars += special;
    password += special[Math.floor(Math.random() * special.length)];
  }
  
  // Fill the rest
  for (let i = password.length; i < minLength; i++) {
    password += availableChars[Math.floor(Math.random() * availableChars.length)];
  }
  
  return shuffleString(password);
};
