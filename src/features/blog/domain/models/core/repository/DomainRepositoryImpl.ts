import { Domain } from "../entity";

export interface DomainRepositoryImpl {
  /**
   * Inserts a new domain entry into the domains table.
   * @param {Domain} domain - The domain data to insert.
   * @throws {RepositoryError} If there is a problem inserting the data.
   * @returns {Promise<number>} The newly inserted domain's ID.
   */
  createDomain(domain: Domain): Promise<number>;

  /**
   * Retrieves a domain entry by its ID.
   * @param {number} domainId - The ID of the domain to retrieve.
   * @throws {RepositoryError} If there is a problem retrieving the data.
   * @returns {Promise<Domain>} The domain data.
   */
  getDomainById(domainId: number): Promise<Domain | null>;

  getDomainByUserId(userId: string): Promise<Domain | null>;

  /**
   * Updates an existing domain entry.
   * @param {number} domainId - The ID of the domain to update.
   * @param {Partial<Domain>} updates - The updated domain data.
   * @throws {RepositoryError} If there is a problem updating the data.
   * @returns {Promise<void>}
   */
  updateDomain(domainId: number, updates: Partial<Domain>): Promise<void>;

  /**
   * Deletes a domain entry by its ID.
   * @param {number} domainId - The ID of the domain to delete.
   * @throws {RepositoryError} If there is a problem deleting the data.
   * @returns {Promise<void>}
   */
  deleteDomain(domainId: number): Promise<void>;

  getDomainByAddress(domainAddress: string): Promise<Domain | null>;
}
