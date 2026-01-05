import { Injectable } from '@angular/core';
import { AES, enc, mode, pad, lib } from 'crypto-js';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CryptoService {
  private key = enc.Base64.parse(environment.ENCRYPTION_KEY);
  private iv = enc.Base64.parse(environment.ENCRYPTION_IV);

  encrypt(data: unknown): string {
    const jsonData = JSON.stringify(data);
    const randomIv = lib.WordArray.random(16);
    const encrypted = AES.encrypt(jsonData, this.key, {
      iv: randomIv,
      mode: mode.CBC,
      padding: pad.Pkcs7,
    });
    const version = enc.Hex.parse('01');
    const payload = version.concat(randomIv).concat(encrypted.ciphertext);
    return enc.Base64.stringify(payload);
  }

  decrypt(cipherText: string): unknown {
    if (!cipherText) return cipherText;

    const buffer = enc.Base64.parse(cipherText);
    const bufferArray = this.wordArrayToUint8Array(buffer);

    // Check version byte
    const version = bufferArray[0];

    let iv: lib.WordArray;
    let cipherBytes: lib.WordArray;

    if (version === 1 && bufferArray.length > 1 + 16) {
      // Extract IV: bytes 1-16 (skip version byte at index 0)
      const ivBytes = bufferArray.slice(1, 17);
      iv = this.uint8ArrayToWordArray(ivBytes);

      // Extract ciphertext: everything after byte 16
      const cipherBytesArray = bufferArray.slice(17);
      cipherBytes = this.uint8ArrayToWordArray(cipherBytesArray);
    } else {
      // Fallback to configured IV
      iv = this.iv;
      cipherBytes = buffer;
    }

    const cipherParams = lib.CipherParams.create({ ciphertext: cipherBytes });
    const decrypted = AES.decrypt(cipherParams, this.key, {
      iv,
      mode: mode.CBC,
      padding: pad.Pkcs7,
    });

    const value = decrypted.toString(enc.Utf8);

    if (!value) {
      throw new Error('Decryption failed: empty result');
    }

    return JSON.parse(value);
  }

  // Helper: Convert WordArray to Uint8Array
  private wordArrayToUint8Array(wordArray: lib.WordArray): Uint8Array {
    const words = wordArray.words;
    const sigBytes = wordArray.sigBytes;
    const u8 = new Uint8Array(sigBytes);

    for (let i = 0; i < sigBytes; i++) {
      u8[i] = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
    }

    return u8;
  }

  // ✅ Helper: Convert Uint8Array to WordArray
  private uint8ArrayToWordArray(u8arr: Uint8Array): lib.WordArray {
    const len = u8arr.length;
    const words: number[] = [];

    for (let i = 0; i < len; i++) {
      words[i >>> 2] |= (u8arr[i] & 0xff) << (24 - (i % 4) * 8);
    }

    return lib.WordArray.create(words, len);
  }
}
