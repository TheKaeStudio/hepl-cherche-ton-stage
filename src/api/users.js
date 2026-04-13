import client from "./client";

// API role → internal role
const ROLE_MAP = {
    admin:   "admin",
    student: "etudiant",
    teacher: "enseignant",
};

function normalizeUser(u) {
    return {
        id:    u._id,
        name:  `${u.firstname} ${u.lastname}`,
        email: u.email,
        role:  ROLE_MAP[u.role] ?? u.role,
        // Fields not yet in the API — kept as null until backend provides them
        phone: null,
        photo: null,
        class: null,
        stageStatus: null,
    };
}

export async function getUsers() {
    const { data } = await client.get("/users");
    return data.data.map(normalizeUser);
}
