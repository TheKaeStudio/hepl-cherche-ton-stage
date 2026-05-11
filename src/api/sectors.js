import client from "./client";

/** Retourne tous les secteurs. */
export async function getSectors() {
    const { data } = await client.get("/sectors");
    return data.sectors ?? [];
}

/**
 * @param {{ name: string, color?: string }} payload
 */
export async function createSector(payload) {
    const { data } = await client.post("/sectors", payload);
    return data.sector;
}

/**
 * @param {string} id
 * @param {{ name?: string, color?: string }} payload
 */
export async function updateSector(id, payload) {
    const { data } = await client.put(`/sectors/${id}`, payload);
    return data.sector;
}

/** @param {string} id */
export async function deleteSector(id) {
    await client.delete(`/sectors/${id}`);
}
