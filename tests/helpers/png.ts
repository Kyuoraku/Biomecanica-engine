import { readFileSync } from "node:fs";
import { PNG_HEIGHT_OFFSET, PNG_SIGNATURE, PNG_WIDTH_OFFSET } from "../constants/png";

export type ImageSize = {
  width: number;
  height: number;
};

export class NotPngError extends Error {
  constructor(path: string) {
    super(`Not a PNG file: ${path}`);
    this.name = "NotPngError";
  }
}

export function readPngSize(path: string): ImageSize {
  const bytes = readFileSync(path);
  const hasSignature = PNG_SIGNATURE.every((byte, index) => bytes[index] === byte);
  if (!hasSignature) {
    throw new NotPngError(path);
  }
  return {
    width: bytes.readUInt32BE(PNG_WIDTH_OFFSET),
    height: bytes.readUInt32BE(PNG_HEIGHT_OFFSET),
  };
}
