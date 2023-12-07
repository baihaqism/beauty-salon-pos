// authGuard.js
export const useAuth = () => {
  const token = localStorage.getItem("token");

  if (token) {
    return true;
  } else {
    return false;
  }
};

export const useUserRole = () => {
  const role = localStorage.getItem("role");

  return role;
};
