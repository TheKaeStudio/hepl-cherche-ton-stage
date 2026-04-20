import client from "./client";

export async function uploadImage(file) {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await client.post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data.url;
}
