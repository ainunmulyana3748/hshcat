export function isBlobStorageConfigured(): boolean {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
      (process.env.BLOB_STORE_ID && process.env.VERCEL_OIDC_TOKEN),
  );
}

export function shouldUseBlobStorage(): boolean {
  return process.env.NODE_ENV === "production" || isBlobStorageConfigured();
}
