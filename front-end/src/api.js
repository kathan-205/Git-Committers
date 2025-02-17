const API_URL = "http://127.0.0.1:5000";

export async function getBackendMessage() {
    const response = await fetch(`${API_URL}/`);
    return response.text();
}
