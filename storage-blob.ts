import { BlobServiceClient } from "@azure/storage-blob";

const ACCOUNT_NAME = process.env.NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_NAME || "";
const SAS = process.env.NEXT_PUBLIC_AZURE_BLOB_SAS || "";
const CONTAINER_NAME =
  process.env.NEXT_PUBLIC_AZURE_STORAGE_CONTAINER_NAME || "";

/**
 * Create Container
 */
export const createContainer = async () => {
  const blobServiceClient = new BlobServiceClient(
    `https://${ACCOUNT_NAME}.blob.core.windows.net${SAS}`
  );

  const containerName = `audio3`;
  const containerClient = blobServiceClient.getContainerClient(containerName);
  await containerClient.create();
};

/**
 * Upload Blob
 * @param userId userId
 * @param fileName fileName
 * @param arrayBuffer arrayBuffer
 */
export const uploadStream = async (
  userId: string,
  fileName: string,
  arrayBuffer: ArrayBuffer
) => {
  const blobServiceClient = new BlobServiceClient(
    `https://${ACCOUNT_NAME}.blob.core.windows.net${SAS}`
  );

  const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
  const blobClient = containerClient.getBlobClient(`${userId}/${fileName}`);
  const blockBlobClient = blobClient.getBlockBlobClient();

  const fileType = fileName.split(".").pop();
  const blobOptions = {
    blobHTTPHeaders: { blobContentType: `audio/${fileType}}` },
  };
  const view = new DataView(arrayBuffer);
  const res = await blockBlobClient.upload(view, view.byteLength, blobOptions);
  console.log(`Upload Successfully: `, res);
};

/**
 * Download Blob
 * @param userId userId
 * @param fileName fileName
 */
export const downloadStream = async (userId: string, fileName: string) => {
  const blobServiceClient = new BlobServiceClient(
    `https://${ACCOUNT_NAME}.blob.core.windows.net${SAS}`
  );

  const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
  const blobClient = containerClient.getBlobClient(`${userId}/${fileName}`);
  const blockBlobClient = blobClient.getBlockBlobClient();

  const downloadResponse = await blockBlobClient.download(0);
  const downloadedContent = await streamToString(
    downloadResponse.readableStreamBody
  );
  console.log(`Download Successfully: `, downloadedContent);
};

/**
 * Delete Blob
 * @param userId userId
 * @param fileName fileName
 */
export const deleteBlob = async (userId: string, fileName: string) => {
  const blobServiceClient = new BlobServiceClient(
    `https://${ACCOUNT_NAME}.blob.core.windows.net${SAS}`
  );

  const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
  const blobClient = containerClient.getBlobClient(`${userId}/${fileName}`);
  const blockBlobClient = blobClient.getBlockBlobClient();

  await blockBlobClient.delete();
  console.log(`Delete Successfully: `);
};

async function streamToString(
  readableStream: NodeJS.ReadableStream | undefined
): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Array<string> = [];
    readableStream?.on("data", (data) => {
      chunks.push(data.toString());
    });
    readableStream?.on("end", () => {
      resolve(chunks.join(""));
    });
    readableStream?.on("error", reject);
  });
}
