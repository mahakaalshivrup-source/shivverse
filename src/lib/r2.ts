import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || '';

export interface Metadata {
  stories: any[];
  mantras: any[];
  scriptures: any[];
}

let metadataCache: { data: Metadata | null; timestamp: number } = { data: null, timestamp: 0 };
const CACHE_TTL_MS = 60 * 1000;

export async function getMetadata(): Promise<Metadata> {
  const now = Date.now();
  if (metadataCache.data && (now - metadataCache.timestamp < CACHE_TTL_MS)) {
    // console.log(`[R2] Serving metadata.json from memory cache.`);
    return metadataCache.data;
  }

  // console.log(`[R2] Fetching metadata.json from ${R2_BUCKET_NAME}...`);
  try {
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: 'metadata.json',
    });
    const response = await r2Client.send(command);
    if (!response.Body) throw new Error("No body in response");
    
    const str = await response.Body.transformToString();
    const data = JSON.parse(str);
    
    metadataCache = { data, timestamp: Date.now() };
    return data;
  } catch (error: any) {
    console.error(`[R2] metadata.json not found or error (returning default): ${error.message}`);
    return { stories: [], mantras: [], scriptures: [] };
  }
}

export async function saveMetadata(data: Metadata) {
  // console.log(`[R2] Saving metadata.json...`);
  const jsonStr = JSON.stringify(data, null, 2);
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: 'metadata.json',
    Body: jsonStr,
    ContentType: 'application/json',
  });
  await r2Client.send(command);
  
  // Clear the cache immediately on save
  metadataCache = { data, timestamp: Date.now() };
}

export async function uploadToR2(fileBuffer: Buffer | Uint8Array, fileName: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: contentType,
  });
  
  await r2Client.send(command);
}

export async function deleteFromR2(fileName: string) {
  const command = new DeleteObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: fileName,
  });
  await r2Client.send(command);
}

export async function generatePresignedUrl(fileName: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: fileName,
  });
  // 24 hours validity
  return await getSignedUrl(r2Client, command, { expiresIn: 86400 });
}
