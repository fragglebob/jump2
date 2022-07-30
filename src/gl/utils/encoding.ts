import { encode, decode } from 'js-base64';
import lz77 from "lz77";

export function encodeCode(code: string): string {
    return encode(lz77.compress(code));
}

export function decodeCode(encodedCode: string): string {
    return lz77.decompress(decode(encodedCode));
}