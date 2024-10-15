export async function getBase64Image(imageUrl: string) {
  try {
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    return `data:image/png;base64,${base64}`;
  } catch (error) {
    console.error("Error fetching image:", error);
    return null;
  }
}
