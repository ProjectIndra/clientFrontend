export const validators = {
  username: (value) => {
    if (!value || value.trim().length < 3) {
      return "Username must be at least 3 characters";
    }
    return null;
  },

  email: (value) => {
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!value) return "Email is required";

    if (!emailRegex.test(value)) {
      return "Invalid email format";
    }

    return null;
  },

  password: (value) => {
    if (!value || value.length < 6) {
      return "Password must be at least 6 characters";
    }
    return null;
  },
};