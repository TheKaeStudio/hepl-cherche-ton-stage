import client from "./client";

export async function getGroups() {
    const { data } = await client.get("/groups");
    return data.groups ?? [];
}
