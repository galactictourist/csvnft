const dotenv = require('dotenv');
dotenv.config();

let mintNFT;
let uploadToIPFS;

async function initialize() {
    const { Address, prepareContractCall, sendAndConfirmTransaction, getContract } = await import("thirdweb");
    const { privateKeyToAccount } = await import("thirdweb/wallets");
    const { defineChain } = await import("thirdweb/chains");
    const { mintTo } = await import("thirdweb/extensions/erc721");
    const { upload } = await import("thirdweb/storage");
    
    const clientModule = await import('./twClient.js');
    const client = clientModule.default;
    const { ThirdwebSDK } = await import('@thirdweb-dev/sdk');

    const adminAccount = privateKeyToAccount({
        client,
        privateKey: process.env.REACT_APP_ADMIN_WALLET_KEY,
    });
    console.log('Admin account address:', adminAccount.address);
    console.log('Admin wallet key:', process.env.REACT_APP_ADMIN_WALLET_KEY);

    mintNFT = async (contractAddress, toAddress, tokenId, tokenURI) => {
        console.log(`Minting NFT with contractAddress: ${contractAddress}, toAddress: ${toAddress}, tokenId: ${tokenId}, tokenURI: ${tokenURI}`);

        const contract = getContract({
            client,
            chain: defineChain(2442),
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
            console.error('Admin account address:', adminAccount.address);
            console.error('Admin wallet key:', process.env.REACT_APP_ADMIN_WALLET_KEY);
            throw error;
        }
    };

    uploadToIPFS = async (metadata) => {
        try {
            const files = [new File([JSON.stringify(metadata)], "metadata.json")];
            const uris = await upload({
                client,
                files,
            });
            const cid = uris[0].split('/').pop(); // Extract CID from the URI
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