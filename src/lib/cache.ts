export class Cache<T> {
  private cache: Map<string, { data: T; timestamp: number }> = new Map()
  private ttl: number // Time To Live in milliseconds

  constructor(ttlSeconds: number = 60) {
    this.ttl = ttlSeconds * 1000
  }

  set(key: string, data: T) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  get(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  clear() {
    this.cache.clear()
  }
} 