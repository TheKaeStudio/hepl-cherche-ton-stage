import client from "./client";

export async function signIn(email, password) {
    const { data } = await client.post("/auth/sign-in", { email, password });
    // Response: { success, data: { token, user } }
    return data.data ?? data;
}

export async function signUp(firstname, lastname, email, password) {
    const { data } = await client.post("/auth/sign-up", { firstname, lastname, email, password });
    return data.data ?? data;
}

export async function activateAccount(token) {
    const { data } = await client.get(`/auth/activate/${token}`);
    return data;
}
