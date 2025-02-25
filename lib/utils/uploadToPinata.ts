import axios from "axios";

export const uploadToPinata = async (metadata: any) => {
  const JWT = process.env.NEXT_PUBLIC_PINATA_JWT;

  if (!JWT) {
    throw new Error("Pinata API keys are not configured.");
  }

  // // Upload image to Pinata
  // const formData = new FormData();
  // formData.append("file", file);

  // const imageResponse = await axios.post(
  //   "https://api.pinata.cloud/pinning/pinFileToIPFS",
  //   formData,
  //   {
  //     headers: {
  //       "Content-Type": "multipart/form-data",
  //       Authorization: `Bearer ${JWT}`,
  //     },
  //   }
  // );

  // const imageUri = `https://gateway.pinata.cloud/ipfs/${imageResponse.data.IpfsHash}`;
  // console.log("Image uploaded to Pinata:", imageUri);

  // Upload metadata to Pinata
  const metadataResponse = await axios.post(
    "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    {
      ...metadata,
      image: metadata.imageUri,
    },
    {
      headers: {
        Authorization: `Bearer ${JWT}`,
      },
    }
  );

  const metadataUri = `https://gateway.pinata.cloud/ipfs/${metadataResponse.data.IpfsHash}`;
  console.log("Metadata uploaded to Pinata:", metadataUri);

  return metadataUri;
};
