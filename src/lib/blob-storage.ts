export const BLOB_STORAGE_SETUP_MESSAGE =
  "Penyimpanan cloud belum dikonfigurasi. Buat Vercel Blob Store, lalu hubungkan ke project atau tambahkan BLOB_READ_WRITE_TOKEN di environment deployment.";

export function isBlobStorageConfigured(): boolean {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
      (process.env.BLOB_STORE_ID && process.env.VERCEL_OIDC_TOKEN),
  );
}
