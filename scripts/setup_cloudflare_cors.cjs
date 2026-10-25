const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split(/\r?\n/).forEach(line => {
  line = line.trim();
  if (!line || line.startsWith('#')) return;
  const idx = line.indexOf('=');
  if (idx !== -1) {
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim();
    env[key] = val;
  }
});

const r2ModulePath = path.resolve(__dirname, '..', '..', 'WordPix', 'scripts', 'lib', 'r2.cjs');
const { createClient } = require(r2ModulePath);

async function setCors() {
  const accountId = env.CLOUDFLARE_ACCOUNT_ID;
  const accessKeyId = env.INTERACTIVE_RESUME_R2_ACCESS_KEY_ID;
  const secretAccessKey = env.INTERACTIVE_RESUME_R2_SECRET_ACCESS_KEY;
  const bucket = env.WORDPIX_R2_BUCKET_NAME || 'wordpix';
  const endpoint = env.R2_ENDPOINT;

  const crypto = require('crypto');
  const corsXml = `<?xml version="1.0" encoding="UTF-8"?><CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/"><CORSRule><ID>hr-tool-global-read</ID><AllowedMethod>GET</AllowedMethod><AllowedMethod>HEAD</AllowedMethod><AllowedOrigin>*</AllowedOrigin><AllowedHeader>*</AllowedHeader><ExposeHeader>Content-Length</ExposeHeader><ExposeHeader>Content-Type</ExposeHeader><ExposeHeader>ETag</ExposeHeader><MaxAgeSeconds>86400</MaxAgeSeconds></CORSRule></CORSConfiguration>`;
  
  const body = Buffer.from(corsXml, 'utf8');

  // Use fetch with AWS V4 signature via WordPix helper request
  const r2 = createClient({
    R2_ACCOUNT_ID: accountId,
    R2_ACCESS_KEY_ID: accessKeyId,
    R2_SECRET_ACCESS_KEY: secretAccessKey,
    R2_BUCKET: bucket,
    R2_ENDPOINT: endpoint
  });

  console.log(`Setting CORS on bucket "${bucket}" with schema xmlns...`);
  // Raw PUT query "cors"
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.slice(0, 8);
  const payloadHash = crypto.createHash('sha256').update(body).digest('hex');
  const md5Hash = crypto.createHash('md5').update(body).digest('base64');

  const headers = {
    host: new URL(`${endpoint}/${bucket}`).host,
    'x-amz-content-sha256': payloadHash,
    'x-amz-date': amzDate,
    'content-type': 'application/xml',
    'content-length': String(body.length),
    'content-md5': md5Hash
  };

  const canonicalHeaders = Object.keys(headers).sort().map(k => `${k.toLowerCase()}:${headers[k].trim()}\n`).join('');
  const signedHeaders = Object.keys(headers).sort().map(k => k.toLowerCase()).join(';');
  const canonicalRequest = `PUT\n/${bucket}\ncors=\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
  const stringToSign = `AWS4-HMAC-SHA256\n${amzDate}\n${dateStamp}/auto/s3/aws4_request\n${crypto.createHash('sha256').update(canonicalRequest).digest('hex')}`;

  const kDate = crypto.createHmac('sha256', `AWS4${secretAccessKey}`).update(dateStamp).digest();
  const kRegion = crypto.createHmac('sha256', kDate).update('auto').digest();
  const kService = crypto.createHmac('sha256', kRegion).update('s3').digest();
  const kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest();
  const signature = crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex');

  const auth = `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${dateStamp}/auto/s3/aws4_request, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const res = await fetch(`${endpoint}/${bucket}?cors`, {
    method: 'PUT',
    headers: { ...headers, Authorization: auth },
    body
  });

  console.log('R2 PUT ?cors status:', res.status);
  if (!res.ok) {
    const text = await res.text();
    console.error('Error text:', text);
  } else {
    console.log('✓ Successfully configured CORS on Cloudflare R2 bucket!');
  }
}

setCors().catch(err => {
  console.error('CORS setup error:', err);
  process.exit(1);
});
