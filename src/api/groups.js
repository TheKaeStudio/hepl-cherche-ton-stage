import client from "./client";

export async function getGroups() {
    const { data } = await client.get("/groups");
    return data.groups ?? [];
}

export async function createGroup(payload) {
    const { data } = await client.post("/groups", payload);
    return data.group;
}

export async function updateGroup(id, payload) {
    const { data } = await client.put(`/groups/${id}`, payload);
    return data.group;
}

export async function deleteGroup(id) {
    await client.delete(`/groups/${id}`);
}
