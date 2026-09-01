interface CaptchaRecord {
  answer: number;
  expiresAt: number;
  attempts: number;
}

const store = new Map<string, CaptchaRecord>();
const passTokens = new Map<string, number>();

const TTL = 5 * 60 * 1000;
const PASS_TTL = 10 * 60 * 1000;
const MAX_ATTEMPTS = 3;

function cleanup() {
  const now = Date.now();
  for (const [id, record] of store) {
    if (record.expiresAt < now) store.delete(id);
  }
  for (const [token, expiresAt] of passTokens) {
    if (expiresAt < now) passTokens.delete(token);
  }
}

export function createCaptcha(answer: number): string {
  cleanup();
  const id = Math.random().toString(36).slice(2) + Date.now().toString(36);
  store.set(id, {
    answer,
    expiresAt: Date.now() + TTL,
    attempts: 0,
  });
  return id;
}

export function verifyCaptcha(id: string, answer: number): string | null {
  cleanup();
  const record = store.get(id);
  if (!record) return null;
  if (record.expiresAt < Date.now()) {
    store.delete(id);
    return null;
  }
  record.attempts += 1;
  if (record.attempts > MAX_ATTEMPTS) {
    store.delete(id);
    return null;
  }
  if (record.answer === answer) {
    store.delete(id);
    const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
    passTokens.set(token, Date.now() + PASS_TTL);
    return token;
  }
  return null;
}

export function verifyPassToken(token: string): boolean {
  cleanup();
  const expiresAt = passTokens.get(token);
  if (!expiresAt) return false;
  passTokens.delete(token);
  return true;
}
