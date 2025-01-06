export class KoreaInvestmentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'KoreaInvestmentError';
  }
} 