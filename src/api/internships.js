import client from "./client";

const STATUS_LABELS = {
    assigned:       "À remplir",
    submitted:      "En attente",
    rejected:       "Refusé",
    validated:      "À réaliser",
    docs_submitted: "Réalisé",
    docs_rejected:  "À revoir",
    completed:      "Terminé",
    in_progress:    "En cours",
};

const TYPE_LABELS = {
    Bachelier:   "Stage de Bachelier",
    Master:      "Stage de Master",
    Observation: "Stage d'observation",
};

function normalizeUser(u) {
    if (!u) return null;
    return {
        id:    u._id,
        name:  `${u.firstname ?? ""} ${u.lastname ?? ""}`.trim(),
        email: u.email,
        role:  u.role,
        class: u.group?.name ?? null,
        photo: u.photo ?? null,
    };
}

function normalizeCompany(c) {
    if (!c) return null;
    return {
        id:       c._id,
        name:     c.name,
        logo:     c.logo ?? null,
        contact:  c.contactPerson ?? null,
        province: c.address?.province ?? null,
        domain:   c.sector?.name ?? null,
        website:  c.website ?? null,
    };
}

export function normalizeInternship(i) {
    const sheet          = i.sheet ?? {};
    const primaryStudent = i.students?.[0];
    const teacher        = i.assignedTeacher;

    const companyName = i.company?.name
        ?? sheet.externalCompanyName
        ?? null;

    const companyWebsite = i.company?.website
        ?? sheet.externalCompanyWebsite
        ?? null;

    const isLate = !!(
        i.deadline
        && new Date(i.deadline) < new Date()
        && !["completed"].includes(i.status)
    );

    return {
        id:          i._id,
        title:       i.title ?? null,
        type:        i.type ?? null,
        typeLabel:   TYPE_LABELS[i.type] ?? i.type ?? null,
        schoolYear:  i.schoolYear ?? null,
        status:      i.status,
        statusLabel: STATUS_LABELS[i.status] ?? i.status,
        isLate,
        deadline:    i.deadline ?? null,

        // People
        student:     normalizeUser(primaryStudent),
        students:    (i.students ?? []).map(normalizeUser),
        group:       i.group?.name  ?? primaryStudent?.group?.name ?? null,
        groupId:     i.group?._id   ?? null,
        groupColor:  i.group?.color ?? null,
        teacherName: teacher ? `${teacher.firstname ?? ""} ${teacher.lastname ?? ""}`.trim() : null,
        teacherId:   teacher?._id ?? null,

        // Company
        company:             normalizeCompany(i.company),
        companyName,
        companyWebsite,
        sheetCompanyType:    sheet.companyType ?? null,
        externalCompanyName: sheet.externalCompanyName ?? null,

        // Dates + supervisor
        startDate:    sheet.startDate   ?? null,
        endDate:      sheet.endDate     ?? null,
        supervisor:   sheet.companyTutor ?? null,
        missions:     sheet.missions    ?? [],
        description:  sheet.description ?? null,
        submittedAt:  sheet.submittedAt ?? null,

        // Documents
        conventionUrl:        i.documents?.convention        ?? null,
        reportUrl:            i.documents?.report            ?? null,
        docsSubmittedAt:      i.documents?.submittedAt       ?? null,
        docsRejectionComment: i.documents?.rejectionComment  ?? null,

        // Evaluation (sheet)
        evaluation:  i.evaluation ?? null,

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

export async function createInternship(payload) {
    const { data } = await client.post("/internships/create", payload);
    return normalizeInternship(data.internship);
}

export async function updateInternship(id, payload) {
    const { data } = await client.put(`/internships/update/${id}`, payload);
    return normalizeInternship(data.internship);
}

export async function updateSheet(id, sheet) {
    const { data } = await client.put(`/internships/${id}/sheet`, sheet);
    return normalizeInternship(data.internship);
}

export async function submitSheet(id) {
    const { data } = await client.post(`/internships/${id}/submit`);
    return normalizeInternship(data.internship);
}

export async function validateSheet(id, { status, comment }) {
    const { data } = await client.put(`/internships/${id}/validate`, { status, comment });
    return normalizeInternship(data.internship);
}

export async function submitDocs(id, formData) {
    const { data } = await client.post(`/internships/${id}/submit-docs`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return normalizeInternship(data.internship);
}

export async function confirmDocs(id, { status, comment }) {
    const { data } = await client.put(`/internships/${id}/confirm-docs`, { status, comment });
    return normalizeInternship(data.internship);
}

export async function deleteInternship(id) {
    await client.delete(`/internships/delete/${id}`);
}

// ─── Comments ─────────────────────────────────────────────────────────────────

function normalizeComment(c) {
    return {
        id:        c._id,
        content:   c.content,
        createdAt: c.createdAt,
        author:    normalizeUser(c.author),
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
