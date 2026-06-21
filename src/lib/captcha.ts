export function verifyCaptchaToken(token: string): boolean {
  try {
    const decoded = atob(token);
    const [answer, timestamp] = decoded.split(":");
    const age = Date.now() - parseInt(timestamp);
    
    // Token expires after 5 minutes
    if (age > 5 * 60 * 1000) return false;
    
    return !!answer && !isNaN(parseInt(answer));
  } catch {
    return false;
  }
}

export function generateCaptchaToken(answer: number): string {
  return btoa(`${answer}:${Date.now()}`);
}
