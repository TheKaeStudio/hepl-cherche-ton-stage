import client from "./client";

/**
 * Connecte un utilisateur et retourne son token + ses infos.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ token: string, user: object }>}
 */
export async function signIn(email, password) {
    const { data } = await client.post("/auth/sign-in", { email, password });
    return data.data ?? data;
}

/**
 * Inscrit un nouvel utilisateur.
 * @param {string} firstname
 * @param {string} lastname
 * @param {string} email
 * @param {string} password
 */
export async function signUp(firstname, lastname, email, password) {
    const { data } = await client.post("/auth/sign-up", { firstname, lastname, email, password });
    return data.data ?? data;
}

/**
 * Active un compte via le token reçu par email.
 * @param {string} token
 */
export async function activateAccount(token) {
    const { data } = await client.get(`/auth/activate/${token}`);
    return data;
}
