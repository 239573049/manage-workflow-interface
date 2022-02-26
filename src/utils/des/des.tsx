import CryptoJS from 'crypto-js';
//加密内容、秘钥、向量
export function encryptByDES(message: string, key = 'TOKENKEY') {
  const keyHex = CryptoJS.enc.Utf8.parse(key);
  const ivHex = CryptoJS.enc.Utf8.parse(key);
  const encrypted = CryptoJS.DES.encrypt(message, keyHex, {
    iv: ivHex,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.ciphertext.toString().toLocaleUpperCase();
}
