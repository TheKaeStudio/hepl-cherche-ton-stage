import client from "./client";

/**
 * Envoie une image vers le serveur et retourne son URL publique.
 * @param {File} file
 * @returns {Promise<string>} URL de l'image uploadée.
 */
export async function uploadImage(file) {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await client.post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data.url;
}
