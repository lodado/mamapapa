import { Redis as UpstashRedis } from "@upstash/redis";

class RedisRepository {
  client: UpstashRedis;

  constructor() {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url) {
      console.warn("Upstash Redis URL not found. Using mock Redis client.");
      // Mock Redis client for development
      this.client = {
        setex: async () => {},
        get: async () => null,
        del: async () => {},
      } as any;
      return;
    }

    this.client = new UpstashRedis({
      url,
      token,
    });
  }

  async set(
    key: string,
    value: string,
    // production 3개월, development 1분
    option?: { expireTime?: number }
  ): Promise<void> {
    const { expireTime = process.env.NODE_ENV === "development" ? 60 : 60 * 60 * 24 * 90 } = option ?? {};

    await this.client.setex(key, expireTime, value);
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }
}

const Redis = new RedisRepository();

export default Redis;
