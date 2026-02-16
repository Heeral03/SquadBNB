import axios from 'axios';

// Pinata credentials from https://app.pinata.cloud/developers
const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_SECRET_API_KEY = import.meta.env.VITE_PINATA_SECRET_API_KEY;
const PINATA_JWT = import.meta.env.VITE_PINATA_JWT; // Alternative to API key/secret

// Upload file to Pinata
export async function uploadToPinata(file, quote) {
  try {
    // Create form data
    const formData = new FormData();
    
    // Add the image file
    formData.append('file', file);
    
    // Create metadata
    const metadata = JSON.stringify({
      name: `Book Challenge - ${new Date().toLocaleDateString()}`,
      keyvalues: {
        quote: quote,
        timestamp: Date.now().toString(),
        type: 'book-challenge',
        app: 'ChainLit'
      }
    });
    formData.append('pinataMetadata', metadata);
    
    // Optional: Set pinning options
    const options = JSON.stringify({
      cidVersion: 1,
      wrapWithDirectory: false
    });
    formData.append('pinataOptions', options);

    // Upload to Pinata
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        maxBodyLength: 'Infinity',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_API_KEY
          // Or use JWT:
          // 'Authorization': `Bearer ${PINATA_JWT}`
        }
      }
    );

    const ipfsHash = response.data.IpfsHash;
    console.log('File uploaded to Pinata. IPFS Hash:', ipfsHash);
    
    return ipfsHash;
  } catch (error) {
    console.error('Pinata upload error:', error.response?.data || error.message);
    throw new Error('Failed to upload to IPFS');
  }
}

// Upload JSON metadata separately (optional)
export async function uploadJSONToPinata(metadata) {
  try {
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      metadata,
      {
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_API_KEY
        }
      }
    );
    
    return response.data.IpfsHash;
  } catch (error) {
    console.error('Pinata JSON upload error:', error.response?.data || error.message);
    throw new Error('Failed to upload metadata to IPFS');
  }
}

// Alternative: Upload both image and metadata together
export async function uploadChallengeToPinata(photoFile, quote) {
  try {
    // First, upload the image
    const imageHash = await uploadToPinata(photoFile, quote);
    
    // Create metadata with the image reference
    const metadata = {
      quote: quote,
      imageIpfsHash: imageHash,
      timestamp: Date.now(),
      type: 'book-challenge',
      app: 'ChainLit'
    };
    
    // Upload metadata as separate JSON
    const metadataHash = await uploadJSONToPinata(metadata);
    
    // Return the metadata hash (this is what you'll store on-chain)
    // The metadata contains the reference to the image
    return metadataHash;
    
  } catch (error) {
    console.error('Challenge upload error:', error);
    throw error;
  }
}

// Get URL to view uploaded content
export function getPinataGatewayURL(hash, filename = '') {
  // You can use public gateways or your own dedicated gateway
  const gateway = 'https://gateway.pinata.cloud/ipfs/';
  return `${gateway}${hash}${filename ? `/${filename}` : ''}`;
}

// Alternative: Use your dedicated gateway (faster)
export function getDedicatedGatewayURL(hash) {
  // Set up your dedicated gateway in Pinata settings
  const yourGateway = 'https://your-gateway.mypinata.cloud/ipfs/';
  return `${yourGateway}${hash}`;
}