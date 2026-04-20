import client from "./client";

function normalizeUser(u) {
    if (!u) return null;
    return {
        id:    u._id,
        name:  `${u.firstname ?? ""} ${u.lastname ?? ""}`.trim(),
        email: u.email,
        role:  u.role,
        class: u.promotion ?? null,
        photo: null,
    };
}

function normalizeCompany(c) {
    if (!c) return null;
    return {
        id:       c._id,
        name:     c.name,
        contact:  c.contactPerson ?? null,
        province: c.address?.city ?? null,
        domain:   c.sector ?? null,
        website:  c.website ?? null,
    };
}

export function normalizeInternship(i) {
    const sheet = i.sheet ?? {};
    const primaryStudent = i.students?.[0];
    return {
        id:               i._id,
        title:            i.title ?? "Stage",
        type:             i.type ?? null,
        group:            i.group ?? primaryStudent?.promotion ?? null,
        student:          normalizeUser(primaryStudent),
        students:         (i.students ?? []).map(normalizeUser),
        company:          normalizeCompany(i.company),
        supervisor:       i.assignedTeacher
            ? `${i.assignedTeacher.firstname ?? ""} ${i.assignedTeacher.lastname ?? ""}`.trim()
            : null,
        status:           i.status,
        deadline:         i.deadline,
        startDate:        sheet.startDate ?? null,
        endDate:          sheet.endDate   ?? null,
        missions:         sheet.missions  ?? [],
        description:      sheet.description ?? null,
        companyTutor:     sheet.companyTutor ?? null,
        submittedAt:      sheet.submittedAt  ?? null,
        evaluation:       i.evaluation ?? null,
        isGroupAssignment: i.isGroupAssignment ?? false,
    };
}

export async function getInternships() {
    const { data } = await client.get("/internships");
    return data.internships.map(normalizeInternship);
}

export async function getInternship(id) {
    const { data } = await client.get(`/internships/${id}`);
    return normalizeInternship(data.internship);
}

export async function createInternship({ students, companyId, assignedTeacher, deadline, title, type, group }) {
    const { data } = await client.post("/internships/create", {
        students, companyId, assignedTeacher, deadline, title, type, group,
    });
    return normalizeInternship(data.internship);
}

export async function deleteInternship(id) {
    await client.delete(`/internships/delete/${id}`);
}

export async function updateSheet(id, sheet) {
    const { data } = await client.put(`/internships/${id}/sheet`, sheet);
    return normalizeInternship(data.internship);
}

export async function submitInternship(id) {
    const { data } = await client.post(`/internships/${id}/submit`);
    return normalizeInternship(data.internship);
}

export async function validateInternship(id, { status, grade, comment }) {
    const { data } = await client.put(`/internships/${id}/validate`, { status, grade, comment });
    return normalizeInternship(data.internship);
}

// ─── Comments ─────────────────────────────────────────────────────────────────

function normalizeComment(c) {
    return {
        id:        c._id,
        content:   c.content,
        createdAt: c.createdAt,
        author: normalizeUser(c.author),
    };
}

export async function getComments(internshipId) {
    const { data } = await client.get(`/internships/${internshipId}/comments`);
    return data.comments.map(normalizeComment);
}

export async function addComment(internshipId, content) {
    const { data } = await client.post(`/internships/${internshipId}/comments`, { content });
    return normalizeComment(data.comment);
}

export async function deleteComment(internshipId, commentId) {
    await client.delete(`/internships/${internshipId}/comments/${commentId}`);
}
