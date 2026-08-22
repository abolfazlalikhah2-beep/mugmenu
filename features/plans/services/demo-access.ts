export interface DemoState {
  isDemoActive: boolean;
  demoExpiresAt: Date | null;
}

/**
 * Pure — no I/O — trivial to unit test. A demo is only "in effect" while
 * both the toggle is on and the expiry date hasn't passed yet; there's no
 * cron flipping isDemoActive back to false, so every read site must check
 * this instead of trusting the isDemoActive column alone.
 */
export function isDemoEffective(state: DemoState, now = new Date()): boolean {
  return state.isDemoActive && state.demoExpiresAt !== null && state.demoExpiresAt.getTime() > now.getTime();
}
