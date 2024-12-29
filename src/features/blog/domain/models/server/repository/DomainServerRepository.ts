import { supabaseInstance } from "@/shared/index.server";

import { DomainRepositoryImpl } from "../../core/repository";
import { RepositoryError } from "@/shared";
import { Domain } from "../../core";
import Redis from "@/shared/libs/Redis/redis.server";

export default class DomainServerRepository implements DomainRepositoryImpl {
  REDIS_KEY = "DomainRepository";

  private getCacheIdByUserId(userId: string) {
    return `${this.REDIS_KEY}:userId:${userId}`;
  }
  private getCacheIdByDomainId(domainId: number) {
    return `${this.REDIS_KEY}:id:${domainId}`;
  }

  private getCacheIdByDomainAddress(domainAddress: string) {
    return `${this.REDIS_KEY}:address:${domainAddress}`;
  }

  private setCache(userId: string, domain: Domain) {
    Redis.set(this.getCacheIdByUserId(userId), JSON.stringify(domain));
    Redis.set(this.getCacheIdByDomainId(domain.domainId!), JSON.stringify(domain));
    Redis.set(this.getCacheIdByDomainAddress(domain.domainLocation!), JSON.stringify(domain));
  }

  private async removeCacheByDomainId(domainId: number) {
    const cache = await Redis.get(this.getCacheIdByDomainId(domainId));

    if (cache) {
      const data = JSON.parse(cache);
      Redis.delete(this.getCacheIdByUserId(data.userId));
      Redis.delete(this.getCacheIdByDomainId(data.domainId!));
      Redis.delete(this.getCacheIdByDomainAddress(data.domainAddress!));
    }
  }

  /**
   * Inserts a new domain entry into the domains table.
   * @param {Domain} domain - The domain data to insert.
   * @throws {RepositoryError} If there is a problem inserting the data.
   * @returns {Promise<number>} The newly inserted domain's ID.
   */
  async createDomain(domain: Domain): Promise<number> {
    try {
      const { data, error } = await supabaseInstance
        .from("domains")
        .insert([
          {
            domainName: domain.domainName,
            userId: domain.userId,
            description: domain.description,
            language: domain.language,
            image: domain.image,
            domainLocation: domain.domainLocation,
          },
        ])
        .select("*")
        .single();

      if (error) {
        throw new RepositoryError({ message: "Failed to insert domain" });
      }

      this.setCache(domain.userId, domain);

      return data.domainId;
    } catch (err) {
      throw new RepositoryError({
        message: "Error occurred while creating domain",
        originalError: err,
      });
    }
  }

  /**
   * Retrieves a domain entry by its ID.
   * @param {number} domainId - The ID of the domain to retrieve.
   * @throws {RepositoryError} If there is a problem retrieving the data.
   * @returns {Promise<Domain>} The domain data.
   */
  async getDomainById(domainId: number): Promise<Domain | null> {
    try {
      const cache = await Redis.get(this.getCacheIdByDomainId(domainId));

      if (cache) {
        return JSON.parse(cache);
      }

      const { data, error } = await supabaseInstance.from("domains").select("*").eq("domainId", domainId).single();

      if (error && !data) {
        return null;
      }

      if (error) {
        throw new RepositoryError({ message: "Failed to retrieve domain", originalError: error });
      }

      return data;
    } catch (err) {
      throw new RepositoryError({
        message: "Error occurred while retrieving domain",
        originalError: err,
      });
    }
  }

  /**
   * Retrieves a domain entry by its ID.
   * @throws {RepositoryError} If there is a problem retrieving the data.
   * @returns {Promise<Domain>} The domain data.
   */
  async getDomainByUserId(userId: string): Promise<Domain | null> {
    try {
      const cache = await Redis.get(this.getCacheIdByUserId(userId));

      if (cache) {
        return JSON.parse(cache);
      }

      const { data, error } = await supabaseInstance.from("domains").select("*").eq("userId", userId);

      if (error && !data) {
        return null;
      }

      if (error) {
        throw new RepositoryError({ message: "Failed to retrieve domain", originalError: error });
      }

      const domain = data?.[0];

      return domain;
    } catch (err) {
      throw new RepositoryError({
        message: "Error occurred while retrieving domain",
        originalError: err,
      });
    }
  }

  async getDomainByAddress(domainAddress: string): Promise<Domain | null> {
    try {
      const cache = await Redis.get(this.getCacheIdByDomainAddress(domainAddress));

      if (cache) return JSON.parse(cache);

      const { data, error } = await supabaseInstance
        .from("domains")
        .select("*")
        .eq("domainAddress", domainAddress)
        .single();

      if (error && !data) {
        return null;
      }

      if (error) {
        throw new RepositoryError({ message: "Failed to retrieve domain", originalError: error });
      }

      return data;
    } catch (err) {
      throw new RepositoryError({
        originalError: err,
      });
    }
  }

  /**
   * Updates an existing domain entry.
   * @param {number} domainId - The ID of the domain to update.
   * @param {Partial<Domain>} updates - The updated domain data.
   * @throws {RepositoryError} If there is a problem updating the data.
   * @returns {Promise<void>}
   */
  async updateDomain(domainId: number, updates: Partial<Domain>): Promise<void> {
    try {
      const { data, error } = await supabaseInstance.from("domains").update(updates).eq("domainId", domainId);

      /**
       * TO DO - Update cache
       */

      if (error) {
        throw new RepositoryError({ message: "Failed to update domain", originalError: error });
      }
    } catch (err) {
      throw new RepositoryError({
        message: "Error occurred while updating domain",
        originalError: err,
      });
    }
  }

  /**
   * Deletes a domain entry by its ID.
   * @param {number} domainId - The ID of the domain to delete.
   * @throws {RepositoryError} If there is a problem deleting the data.
   * @returns {Promise<void>}
   */
  async deleteDomain(domainId: number): Promise<void> {
    try {
      const { error } = await supabaseInstance.from("domains").delete().eq("domainId", domainId);

      this.removeCacheByDomainId(domainId);

      if (error) {
        throw new RepositoryError({ message: "Failed to delete domain", originalError: error });
      }
    } catch (err) {
      throw new RepositoryError({
        message: "Error occurred while deleting domain",
        originalError: err,
      });
    }
  }
}
