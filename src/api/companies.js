import client from "./client";

function normalizeCompany(c) {
    return {
        id:       c._id,
        // Slug kept for reference
        slug:     c.id,
        name:     c.name,
        description: c.description,
        // Fields not yet in the API — kept null until backend provides them
        logo:     null,
        province: null,
        domain:   null,
        website:  null,
        contact:  null,
        offresObservation: false,
        offres3e: false,
        invite:   c.invite,
    };
}

export async function getCompanies() {
    const { data } = await client.get("/company");
    return data.companies.map(normalizeCompany);
}

export async function createCompany({ id, name, description }) {
    const { data } = await client.post("/company/create", { id, name, description });
    return normalizeCompany(data.company);
}

export async function deleteCompany(id) {
    await client.delete(`/company/delete/${id}`);
}
