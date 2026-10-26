export function isBlobStorageConfigured(): boolean {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
      (process.env.BLOB_STORE_ID && process.env.VERCEL_OIDC_TOKEN),
  );
}

export function shouldUseBlobStorage(): boolean {
  // Jangan memaksa Blob hanya karena environment production. Jika token belum
  // terpasang, CMS tetap dapat membaca sumber data lokal dan tidak crash saat boot.
  return isBlobStorageConfigured();
}
