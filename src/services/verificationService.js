import api from "./api";

export async function fetchVerificationStatus() {
  const res = await api.get("/verification/status");
  return res.data.data;
}

export async function uploadDocument(fileUri, fileName, mimeType, documentType) {
  const formData = new FormData();
  formData.append("document", { uri: fileUri, name: fileName, type: mimeType });
  formData.append("documentType", documentType);
  const res = await api.post("/verification/upload-document", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}
