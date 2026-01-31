import fs from "fs";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

export async function parsePDF(buffer) {
  const data = new Uint8Array(buffer);

  const pdf = await pdfjs.getDocument({ data }).promise;
  let text = "";

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => item.str).join(" ");
    text += pageText + "\n";
  }

  return text;
}
