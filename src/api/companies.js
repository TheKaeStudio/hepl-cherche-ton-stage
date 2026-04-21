import client from "./client";

export function normalizeCompany(c) {
    const rawContacts = Array.isArray(c.contactPersons) && c.contactPersons.length > 0
        ? c.contactPersons
        : (c.contactPerson ? [c.contactPerson] : []);

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

export async function getCompanies() {
    const { data } = await client.get("/company");
    return data.companies.map(normalizeCompany);
}

export async function getCompany(id) {
    const { data } = await client.get(`/company/${id}`);
    return normalizeCompany(data.company);
}

export async function createCompany(payload) {
    const { data } = await client.post("/company/create", payload);
    return normalizeCompany(data.company);
}

export async function updateCompany(id, payload) {
    const { data } = await client.put(`/company/update/${id}`, payload);
    return normalizeCompany(data.company);
}

export async function deleteCompany(id) {
    await client.delete(`/company/delete/${id}`);
}

export async function giveAccess(id) {
    const { data } = await client.post(`/company/${id}/give-access`);
    return data;
}

export async function getAccessByKey(key) {
    const { data } = await client.get(`/company/get-access/${key}`);
    return data; // { token }
}
