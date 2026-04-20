import client from "./client";

const TYPE_LABEL = {
    new_message:               "Nouveau message reçu",
    new_company:               "Nouvelle entreprise ajoutée",
    internship_assigned:       "Un stage vous a été assigné",
    internship_comment:        "Nouveau commentaire sur votre stage",
    internship_status_changed: "Le statut de votre stage a changé",
};

function normalizeNotification(n) {
    return {
        id:      n._id,
        type:    n.type,
        message: n.message ?? TYPE_LABEL[n.type] ?? n.type,
        date:    n.createdAt,
        read:    n.read,
        ref:     n.ref ?? null,
    };
}

export async function getNotifications() {
    const { data } = await client.get("/notifications");
    return data.notifications.map(normalizeNotification);
}

export async function markNotificationRead(id) {
    await client.put(`/notifications/${id}/read`);
}

export async function markAllNotificationsRead() {
    await client.put("/notifications/read-all");
}
