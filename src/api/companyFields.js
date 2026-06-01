import client from "./client";

export async function getCompanyFields() {
    const { data } = await client.get("/company-fields");
    return data.fields ?? [];
}

export async function createCompanyField(label) {
    const { data } = await client.post("/company-fields", { label });
    return data.field;
}

export async function updateCompanyField(id, label) {
    const { data } = await client.put(`/company-fields/${id}`, { label });
    return data.field;
}

export async function deleteCompanyField(id) {
    await client.delete(`/company-fields/${id}`);
}
