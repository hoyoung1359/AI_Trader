export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export class StockAPIError extends APIError {
  constructor(message: string, status: number = 500) {
    super(message, status, 'STOCK_API_ERROR')
  }
}

export class AuthError extends APIError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401, 'AUTH_ERROR')
  }
} 