const dotenv = require('dotenv');
dotenv.config();

let mintNFT;
let uploadToIPFS;

async function initialize() {
    const { Address, prepareContractCall, sendAndConfirmTransaction, getContract, defineChain } = await import("thirdweb");
    const { privateKeyToAccount } = await import("thirdweb/wallets");
    const clientModule = await import('./twClient.js');
    const client = clientModule.default;
    const { ThirdwebSDK } = await import('@thirdweb-dev/sdk');

    const adminAccount = privateKeyToAccount({
        client,
        privateKey: process.env.REACT_APP_ADMIN_WALLET_KEY,
    });

    console.log('Admin account address:', adminAccount.address);

    // Define the Polygon zkEVM Cardano Testnet chain
    const polygonZkEvmCardonaTestnet = defineChain({
        id: 2442,
        rpc: "https://2442.rpc.thirdweb.com/${99217926c44da09698278a8ecb922c67}",
        nativeCurrency: {
          name: "Ether",
          symbol: "ETH",
          decimals: 18,
        },
      });

    mintNFT = async (contractAddress, toAddress, tokenId, tokenURI) => {
        console.log(`Minting NFT with contractAddress: ${contractAddress}, toAddress: ${toAddress}, tokenId: ${tokenId}, tokenURI: ${tokenURI}`);

        const contract = getContract({
            client,
            chain: polygonZkEvmCardonaTestnet,
            address: contractAddress,
        });

        console.log('Contract obtained:', contract);

        const tx = await prepareContractCall({
            contract,
            method: "function mintTo(address to, uint256 tokenId, string tokenURI)",
            params: [toAddress, BigInt(tokenId), tokenURI],
        });

        console.log('Transaction prepared:', tx);

        try {
            console.log('Sending transaction:', tx);
            const receipt = await sendAndConfirmTransaction({
                transaction: tx,
                account: adminAccount,
            });
            console.log(`NFT minted successfully for contract ${contractAddress}, tokenId ${tokenId}`);
            return receipt;
        } catch (error) {
            console.error(`Error minting NFT for contract ${contractAddress}, tokenId ${tokenId}:`, error);
            throw error;
        }
    };

    uploadToIPFS = async (metadata) => {
        const sdk = new ThirdwebSDK("polygon", {
            secretKey: process.env.REACT_APP_THREEWEB_SECRET_KEY,
        });
        try {
            const cid = await sdk.storage.upload(metadata);
            console.log("Metadata uploaded successfully. CID:", cid);
            return cid;
        } catch (error) {
            console.error("Error uploading metadata:", error);
            throw error;
        }
    };

    return { mintNFT, uploadToIPFS };
}

module.exports = initialize;