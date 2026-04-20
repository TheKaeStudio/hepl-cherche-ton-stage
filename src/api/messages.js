import client from "./client";

function normalizeMessage(m) {
    const sender = m.sender ?? {};
    return {
        id:      m._id,
        from: {
            name:    `${sender.firstname ?? ""} ${sender.lastname ?? ""}`.trim(),
            role:    sender.role,
            id:      sender._id,
        },
        subject:  m.subject,
        body:     m.content,
        date:     m.createdAt,
        read:     m.read,
    };
}

export async function getMessages() {
    const { data } = await client.get("/messages");
    return data.messages.map(normalizeMessage);
}

export async function getMessage(id) {
    const { data } = await client.get(`/messages/${id}`);
    return normalizeMessage(data.message);
}

export async function sendMessage(recipientId, subject, content) {
    const { data } = await client.post("/messages/send", { recipientId, subject, content });
    return normalizeMessage(data.message);
}

export async function markMessageRead(id) {
    await client.put(`/messages/${id}/read`);
}
