import type { RiskSignalKey } from './risk-signals.ts';

export type SignalClaimUsage = {
  signal: RiskSignalKey;
  claimId: string;
  role: 'input' | 'threshold' | 'interpretation';
};

// Les cinq signaux sont actuellement calculés à partir de snapshots de données,
// pas à partir de claims éditoriales. Toute dépendance future doit être déclarée
// ici et le build refusera une claim qui n'a pas de revue canonique.
export const signalClaimUsage: SignalClaimUsage[] = [];
