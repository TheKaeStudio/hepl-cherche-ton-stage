import client from "./client";

const ROLE_MAP = {
    admin:   "admin",
    manager: "manager",
    student: "etudiant",
    teacher: "enseignant",
};

const ROLE_MAP_REVERSE = {
    admin:      "admin",
    manager:    "manager",
    etudiant:   "student",
    enseignant: "teacher",
};

/**
 * Normalise un utilisateur reçu de l'API vers le format interne.
 * @param {object} u
 */
export function normalizeUser(u) {
    return {
        id:          u._id,
        name:        `${u.firstname ?? ""} ${u.lastname ?? ""}`.trim(),
        firstname:   u.firstname,
        lastname:    u.lastname,
        email:       u.email,
        role:        ROLE_MAP[u.role] ?? u.role,
        class:       u.group?.name ?? null,
        groupId:     u.group?._id  ?? null,
        groupColor:  u.group?.color ?? null,
        photo:       u.photo ?? null,
        phone:       u.phone ?? null,
        stageStatus: null,
    };
}

/**
 * Récupère la liste des utilisateurs. Filtrable par rôle.
 * @param {{ page?: number, limit?: number, role?: string }} [opts]
 */
export async function getUsers({ page, limit = 20, role } = {}) {
    const params = {};
    if (page !== undefined) { params.page = page; params.limit = limit; }
    if (role) params.role = ROLE_MAP_REVERSE[role] ?? role;
    const { data } = await client.get("/users", { params });
    const list = data.users ?? data.data ?? data;
    const items = (Array.isArray(list) ? list : []).map(normalizeUser);
    if (page !== undefined) return { items, total: data.total ?? items.length, hasMore: data.hasMore ?? false };
    return items;
}

/**
 * @param {string} id
 * @param {object} payload
 */
export async function updateUser(id, payload) {
    const apiPayload = { ...payload };
    if (apiPayload.role) apiPayload.role = ROLE_MAP_REVERSE[apiPayload.role] ?? apiPayload.role;
    const { data } = await client.put(`/users/update/${id}`, apiPayload);
    return normalizeUser(data.user);
}

/**
 * Modifie le profil de l'utilisateur connecté.
 * @param {object} payload - Champs autorisés : photo, phone, firstname, lastname.
 */
export async function updateMe(payload) {
    const { data } = await client.put("/users/me", payload);
    return data.user;
}

/** @param {string} id */
export async function deleteUser(id) {
    await client.delete(`/users/delete/${id}`);
}

/** Retire le groupe de tous les étudiants. */
export async function clearAllGroups() {
    const { data } = await client.delete("/users/groups");
    return data;
}
