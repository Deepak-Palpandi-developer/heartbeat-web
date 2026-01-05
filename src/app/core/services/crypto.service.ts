import { Injectable } from '@angular/core';
import { AES, enc, mode, pad, lib } from 'crypto-js';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CryptoService {
  private key = enc.Base64.parse(environment.ENCRYPTION_KEY);
  private iv = enc.Base64.parse(environment.ENCRYPTION_IV);

  encrypt(plainText: string): string {
    if (!plainText) return plainText;
    // Generate random IV for each message
    const randomIv = lib.WordArray.random(16);
    const encrypted = AES.encrypt(plainText, this.key, {
      iv: randomIv,
      mode: mode.CBC,
      padding: pad.Pkcs7,
    });
    // Prefix version byte (1) and IV to ciphertext
    const version = enc.Hex.parse('01');
    const payload = version.concat(randomIv).concat(encrypted.ciphertext);
    return enc.Base64.stringify(payload);
  }

  decrypt(cipherText: string): string {
    if (!cipherText) return cipherText;
    const buffer = enc.Base64.parse(cipherText);
    const version = buffer.words[0] >>> 24;
    let iv: any;
    let cipherBytes: any;
    if (version === 1 && buffer.sigBytes > 1 + 16) {
      // Versioned, extract IV
      iv = lib.WordArray.create(buffer.words.slice(0, 5)).toString(enc.Hex).slice(2, 34);
      iv = enc.Hex.parse(iv);
      cipherBytes = lib.WordArray.create(buffer.words.slice(5), buffer.sigBytes - 1 - 16);
    } else {
      iv = this.iv;
      cipherBytes = buffer;
    }
    const cipherParams = lib.CipherParams.create({ ciphertext: cipherBytes });
    const decrypted = AES.decrypt(cipherParams, this.key, {
      iv,
      mode: mode.CBC,
      padding: pad.Pkcs7,
    });
    return decrypted.toString(enc.Utf8);
  }
}
