export const validateEmail = (email) => {
  const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};
