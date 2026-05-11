import client from "./client";

/**
 * Normalise une entreprise reçue de l'API vers le format interne.
 * @param {object} c - Entreprise brute de l'API.
 */
export function normalizeCompany(c) {
    const rawContacts = Array.isArray(c.contacts) && c.contacts.length > 0
        ? c.contacts
        : (c.contact ? [c.contact] : []);

    return {
        id:          c._id,

        name:        c.name,
        description: c.description,
        domain:      c.sector?.name  ?? null,
        sectorId:    c.sector?._id   ?? null,
        sectorColor: c.sector?.color ?? null,
        sector:      c.sector        ?? null,
        province:    c.address?.province ?? null,
        country:     c.address?.country  ?? null,
        address:     c.address ?? null,
        website:     c.website ?? null,
        phone:       c.phone ?? null,
        size:        c.size ?? null,
        contact:     rawContacts[0]  ?? null,
        contacts:    rawContacts,
        logo:        c.logo ?? null,
        offresObservation: c.offresObservation ?? false,
        offres3e:          c.offres3e ?? false,
        invite:      c.invite ?? null,
    };
}

/**
 * Récupère la liste des entreprises. Sans page retourne tout, avec page retourne un objet paginé.
 * @param {{ page?: number, limit?: number }} [opts]
 * @returns {Promise<object[]|{ items: object[], total: number, hasMore: boolean }>}
 */
export async function getCompanies({ page, limit = 20 } = {}) {
    const params = page !== undefined ? { page, limit } : {};
    const { data } = await client.get("/company", { params });
    const items = data.companies.map(normalizeCompany);
    if (page !== undefined) return { items, total: data.total ?? items.length, hasMore: data.hasMore ?? false };
    return items;
}

/**
 * @param {string} id
 * @returns {Promise<object>}
 */
export async function getCompany(id) {
    const { data } = await client.get(`/company/${id}`);
    return normalizeCompany(data.company);
}

/**
 * @param {object} payload
 * @returns {Promise<object>}
 */
export async function createCompany(payload) {
    const { data } = await client.post("/company/create", payload);
    return normalizeCompany(data.company);
}

/**
 * @param {string} id
 * @param {object} payload
 * @returns {Promise<object>}
 */
export async function updateCompany(id, payload) {
    const { data } = await client.put(`/company/update/${id}`, payload);
    return normalizeCompany(data.company);
}

/** @param {string} id */
export async function deleteCompany(id) {
    await client.delete(`/company/delete/${id}`);
}

/**
 * Génère un lien d'accès temporaire pour une entreprise.
 * @param {string} id
 * @returns {Promise<{ key: string }>}
 */
export async function giveAccess(id) {
    const { data } = await client.post(`/company/${id}/give-access`);
    return data;
}

/**
 * Échange une clé d'invitation contre un JWT limité.
 * @param {string} key
 * @returns {Promise<{ token: string }>}
 */
export async function getAccessByKey(key) {
    const { data } = await client.get(`/company/get-access/${key}`);
    return data;
}
