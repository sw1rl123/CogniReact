export const COGNI_API_URL ="http://localhost:5279";
export const CHAT_API_URL = "http://localhost:5108";
export const MINIO_API_URL = "http://212.22.82.127:9111";

export function showToast(message) {
    let toast = document.createElement("div");
    toast.textContent = message;
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.background = "rgba(0, 0, 0, 0.7)";
    toast.style.color = "#fff";
    toast.style.padding = "10px 20px";
    toast.style.borderRadius = "5px";
    toast.style.zIndex = "1000";
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}