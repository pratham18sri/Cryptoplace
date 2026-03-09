/**
 * Simple client-side rate limiter.
 * Queues requests and ensures a minimum interval between them.
 */
class RateLimiter {
  constructor(minInterval = 1500) {
    this.minInterval = minInterval;
    this.lastCall = 0;
    this.queue = [];
    this.processing = false;
  }

  async execute(fn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject });
      this._process();
    });
  }

  async _process() {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const now = Date.now();
      const elapsed = now - this.lastCall;
      if (elapsed < this.minInterval) {
        await new Promise((r) => setTimeout(r, this.minInterval - elapsed));
      }

      const { fn, resolve, reject } = this.queue.shift();
      this.lastCall = Date.now();
      try {
        const result = await fn();
        resolve(result);
      } catch (err) {
        reject(err);
      }
    }

    this.processing = false;
  }
}

// CoinGecko free tier: ~30 calls/min → ~2s between calls
export const coinGeckoLimiter = new RateLimiter(2000);

// Gemini API: generous limit but still protect against spam
export const geminiLimiter = new RateLimiter(1000);
