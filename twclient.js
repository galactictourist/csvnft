import dotenv from 'dotenv';
import { createThirdwebClient } from "thirdweb";

dotenv.config(); // Load environment variables

const clientId = process.env.REACT_APP_CLIENT_ID; // this will be used on the client
const secretKey = process.env.REACT_APP_THREEWEB_SECRET_KEY; // this will be used on the server-side

// Log the secretKey to verify it's being loaded correctly
console.log("Secret Key:", secretKey);

const client = createThirdwebClient(
  secretKey
    ? { secretKey }
    : {
        clientId,
      },
);

export default client; // Use ES Module export