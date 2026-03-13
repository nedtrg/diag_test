// In-memory store — swap for a real DB (Postgres/Prisma) in production
const users = new Map();
const codes = new Map();

export function createUser({ email, password }) {
  if (users.has(email)) return { error: "Email already registered" };
  users.set(email, {
    email,
    password,
    verified: false,
    createdAt: new Date().toISOString(),
  });
  return { success: true };
}

export function getUser(email) {
  return users.get(email) || null;
}

export function saveVerificationCode(email, code) {
  codes.set(email, { code, expiresAt: Date.now() + 10 * 60 * 1000 });
}

export function verifyCode(email, code) {
  const entry = codes.get(email);
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) return false;
  if (entry.code !== code) return false;
  const user = users.get(email);
  if (user) user.verified = true;
  codes.delete(email);
  return true;
}

export function updateUser(email, fields) {
  const user = users.get(email);
  if (!user) return false;
  Object.assign(user, fields);
  return true;
}

export function getAllUsers() {
  return Array.from(users.values());
}
