import { generateKeyPairSync } from "crypto";

const Test = () => {
    // prime-256v1 (secp256r1) 曲線を使って鍵ペアを生成
    const { publicKey, privateKey } = generateKeyPairSync('ec', {
      namedCurve: 'prime256v1', // または 'secp256r1'
    });
    
    // 公開鍵と秘密鍵を表示
    console.log('Private Key:', privateKey.export({ type: 'pkcs8', format: 'pem' }));
    console.log('Public Key:', publicKey.export({ type: 'spki', format: 'pem' }));
    return(
        <div></div>
    )
}

export default Test;