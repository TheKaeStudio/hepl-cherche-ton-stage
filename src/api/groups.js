import client from "./client";

/** Retourne tous les groupes. */
export async function getGroups() {
    const { data } = await client.get("/groups");
    return data.groups ?? [];
}

/**
 * @param {{ name: string, color?: string }} payload
 */
export async function createGroup(payload) {
    const { data } = await client.post("/groups", payload);
    return data.group;
}

/**
 * @param {string} id
 * @param {{ name?: string, color?: string }} payload
 */
export async function updateGroup(id, payload) {
    const { data } = await client.put(`/groups/${id}`, payload);
    return data.group;
}

/** @param {string} id */
export async function deleteGroup(id) {
    await client.delete(`/groups/${id}`);
}
