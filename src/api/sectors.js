import client from "./client";

export async function getSectors() {
    const { data } = await client.get("/sectors");
    return data.sectors ?? [];
}

export async function createSector(payload) {
    const { data } = await client.post("/sectors", payload);
    return data.sector;
}

export async function updateSector(id, payload) {
    const { data } = await client.put(`/sectors/${id}`, payload);
    return data.sector;
}

export async function deleteSector(id) {
    await client.delete(`/sectors/${id}`);
}
