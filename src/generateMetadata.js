
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';
import { fileURLToPath } from 'url';

import dotenv from 'dotenv';
dotenv.config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CERT_DIR = path.join(__dirname, './certificates');
const OUTPUT_FILE = path.join(__dirname, 'output', 'students.json');
const apiKey = process.env.PINATA_API_KEY;
const secretApiKey = process.env.PINATA_SECRET_API_KEY;


const uploadImageToIPFS = async (filePath) => {
  const data = new FormData();

  data.append('file', fs.createReadStream(filePath));

  const res = await axios.post(
    'https://api.pinata.cloud/pinning/pinFileToIPFS',
    data,
    {
      maxBodyLength: 'Infinity',
      headers: {
        ...data.getHeaders(),
        pinata_api_key: apiKey,
        pinata_secret_api_key: secretApiKey,
      },
    }
  );

  return `ipfs://${res.data.IpfsHash}`;
};

const uploadMetadataToIPFS = async (metadata) => {
  const res = await axios.post(
    'https://api.pinata.cloud/pinning/pinJSONToIPFS',
    metadata,
    {
      headers: {
        pinata_api_key: apiKey,
        pinata_secret_api_key: secretApiKey,
        'Content-Type': 'application/json',
      },
    }
  );

  return `ipfs://${res.data.IpfsHash}`;
};

const generate = async () => {
  const files = fs.readdirSync(CERT_DIR).filter(file => {
    const lower = file.toLowerCase();
    const fullPath = path.join(CERT_DIR, file);

    const isImage = lower.endsWith('.jpg') || lower.endsWith('.jpeg');
    const isHidden = file.startsWith('.');

    try {
      const stats = fs.statSync(fullPath);
      const isValidSize = stats.size > 0;
      return isImage && !isHidden && isValidSize;
    } catch (err) {
      console.warn(`⚠️ Skipping unreadable file: ${file}`);
      return false;
    }
  });

  const result = [];

  for (const file of files) {
    const wallet = path.parse(file).name;
    const imagePath = path.join(CERT_DIR, file);

    console.log(`📤 Uploading image for ${wallet}...`);
    const imageIpfs = await uploadImageToIPFS(imagePath);

    const metadata = {
      name: "Degree Certificate",
      description: `Degree certificate for wallet: ${wallet}`,
      image: imageIpfs,
    };

    const metadataIpfs = await uploadMetadataToIPFS(metadata);

    result.push({
      wallet,
      metadataUri: metadataIpfs,
      batch: "B.Tech",
      year: "2026"
    });
  }

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));
  console.log(`✅ Metadata written to ${OUTPUT_FILE}`);
  
};


generate().catch(console.error);