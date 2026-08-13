import { NextResponse } from 'next/server';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { r2Client } from '@/lib/r2';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ file: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const key = resolvedParams.file.join('/');
    
    if (!key) {
      return new NextResponse("File path required", { status: 400 });
    }

    // Security: Reject path traversal payloads even though R2 ignores them
    if (key.includes('..')) {
      return new NextResponse("Invalid file path", { status: 400 });
    }

    const range = request.headers.get('range');
    const getObjectParams: any = {
      Bucket: process.env.R2_BUCKET_NAME || '',
      Key: key,
    };
    if (range) {
      getObjectParams.Range = range;
    }

    const command = new GetObjectCommand(getObjectParams);

    const response = await r2Client.send(command);

    if (!response.Body) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Convert the stream to a Response readable stream
    const webStream = response.Body.transformToWebStream();
    
    const headers: any = {
      'Content-Type': response.ContentType || 'application/octet-stream',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Accept-Ranges': response.AcceptRanges || 'bytes',
    };
    
    if (response.ContentLength) headers['Content-Length'] = response.ContentLength.toString();
    if (response.ContentRange) headers['Content-Range'] = response.ContentRange;

    const status = response.$metadata.httpStatusCode || (range ? 206 : 200);

    return new NextResponse(webStream, { status, headers });

  } catch (error: any) {
    console.error(`Error proxying file: ${error.message}`);
    return new NextResponse("Not Found", { status: 404 });
  }
}
