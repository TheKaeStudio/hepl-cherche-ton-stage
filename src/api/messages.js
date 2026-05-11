import client from "./client";

function normalizeMessage(m) {
    const sender = m.sender ?? {};
    return {
        id:   m._id,
        from: {
            name: `${sender.firstname ?? ""} ${sender.lastname ?? ""}`.trim(),
            role: sender.role,
            id:   sender._id,
        },
        subject: m.subject,
        body:    m.content,
        date:    m.createdAt,
        read:    m.read,
    };
}

/**
 * Récupère la boîte de réception.
 * @param {{ page?: number, limit?: number }} [opts]
 */
export async function getMessages({ page, limit = 20 } = {}) {
    const params = page !== undefined ? { page, limit } : {};
    const { data } = await client.get("/messages", { params });
    const items = data.messages.map(normalizeMessage);
    if (page !== undefined) return { items, total: data.total ?? items.length, hasMore: data.hasMore ?? false };
    return items;
}

/** @param {string} id */
export async function getMessage(id) {
    const { data } = await client.get(`/messages/${id}`);
    return normalizeMessage(data.message);
}

/**
 * @param {string} recipientId
 * @param {string} subject
 * @param {string} content
 */
export async function sendMessage(recipientId, subject, content) {
    const { data } = await client.post("/messages/send", { recipientId, subject, content });
    return normalizeMessage(data.message);
}

/** @param {string} id */
export async function markMessageRead(id) {
    await client.put(`/messages/${id}/read`);
}
