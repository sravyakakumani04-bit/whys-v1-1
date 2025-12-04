export const USERNAME_MIN = 3;
export const PASSWORD_MIN = 8;

export const v = {
  username: (s: string) =>
    !s?.trim() ? "Required" : s.trim().length < USERNAME_MIN ? `Min ${USERNAME_MIN}` : "",
  email: (s: string) =>
    !s?.trim() ? "Required" : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) ? "" : "Invalid email",
  password: (s: string) =>
    !s ? "Required" : s.length < PASSWORD_MIN ? `Min ${PASSWORD_MIN}` : "",
  confirm: (pw: string, c: string) => (!c ? "Confirm" : pw !== c ? "Mismatch" : ""),
};

export function validateSignIn(values: { username: string; password: string }) {
  return { username: v.username(values.username), password: v.password(values.password) };
}

export function validateSignUp(values: {
  username: string;
  email: string;
  password: string;
  confirm: string;
}) {
  return {
    username: v.username(values.username),
    email: v.email(values.email),
    password: v.password(values.password),
    confirm: v.confirm(values.password, values.confirm),
  };
}
