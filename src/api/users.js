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

export async function getUsers() {
    const { data } = await client.get("/users");
    const list = data.users ?? data.data ?? data;
    return (Array.isArray(list) ? list : []).map(normalizeUser);
}

export async function updateUser(id, payload) {
    const apiPayload = { ...payload };
    if (apiPayload.role) apiPayload.role = ROLE_MAP_REVERSE[apiPayload.role] ?? apiPayload.role;
    const { data } = await client.put(`/users/update/${id}`, apiPayload);
    return normalizeUser(data.user);
}

export async function updateMe(payload) {
    const { data } = await client.put("/users/me", payload);
    return data.user;
}

export async function deleteUser(id) {
    await client.delete(`/users/delete/${id}`);
}
