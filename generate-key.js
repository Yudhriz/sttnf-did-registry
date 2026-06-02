const crypto = require('crypto');
const { webcrypto } = crypto;
const { subtle } = webcrypto;

// Fungsi pembantu untuk Base64URL Encoding
function base64urlEncode(buffer) {
  return Buffer.from(buffer).toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

// Fungsi untuk menghitung JWK Thumbprint (RFC 7638)
function calculateJwkThumbprint(jwk) {
  // Aturan RFC 7638: Key JSON harus diurutkan sesuai abjad (crv, kty, x, y)
  const canonicalJwk = JSON.stringify({
    crv: jwk.crv,
    kty: jwk.kty,
    x: jwk.x,
    y: jwk.y
  });
  
  // Hash menggunakan SHA-256 lalu jadikan Base64URL
  const hash = crypto.createHash('sha256').update(canonicalJwk).digest();
  return base64urlEncode(hash);
}

async function generateDIDKeys() {
  try {
    // URL DID did:web kampus
    const didController = "did:web:nurulfikri.qzz.io";    // Ganti "nurulfikri.qzz.io" dengan nama domain mu

    // 1. Generate 1 Key Pair (ECDSA / P-256) untuk semua keperluan
    const keyPair = await subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
    const publicKey = await subtle.exportKey("jwk", keyPair.publicKey);
    const privateKey = await subtle.exportKey("jwk", keyPair.privateKey);

    // 2. Hitung 'kid' otomatis (JWK Thumbprint RFC 7638)
    const kid = calculateJwkThumbprint(publicKey);
    const keyIdUrl = `${didController}#${kid}`; // Contoh: did:web:...#_Qq0UL2...

    // 3. Susun FULL did.json sesuai rancangan asli
    const fullDidDocument = {
      "@context": [
        "https://www.w3.org/ns/did/v1",
        "https://w3id.org/security/suites/jws-2020/v1"
      ],
      "id": didController,
      "verificationMethod": [
        {
          "id": keyIdUrl,
          "type": "JsonWebKey2020",
          "controller": didController,
          "publicKeyJwk": {
            "kty": publicKey.kty,
            "crv": publicKey.crv,
            "kid": kid,
            "x": publicKey.x,
            "y": publicKey.y,
            "alg": "ES256"
          }
        }
      ],
      "authentication": [keyIdUrl],
      "assertionMethod": [keyIdUrl],
      "capabilityInvocation": [keyIdUrl],
      "capabilityDelegation": [keyIdUrl],
      "service": [
        {
          "id": `${didController}#domain`,
          "type": "LinkedDomains",
          "serviceEndpoint": [
            "https://nurulfikri.qzz.io" // Ganti "yudha.github.io" dengan nama domain mu
          ]
        }
      ]
    };

    // 4. Susun Private Key untuk file .env
    const finalPrivateKey = {
      ...privateKey,
      kid: kid,
      alg: "ES256"
    };

    // ==========================================
    // 5. TAMPILKAN HASIL AKHIR (TINGGAL COPY-PASTE)
    // ==========================================
    console.log("=====================================================");
    console.log("=== 1. COPY FULL TEXT INI KE DALAM FILE: did.json ===");
    console.log("=====================================================\n");
    
    console.log(JSON.stringify(fullDidDocument, null, 2));

    console.log("\n\n=====================================================");
    console.log("=== 2. COPY TEXT INI KE DALAM FILE: .env (BACKEND)===");
    console.log("=====================================================\n");
    
    console.log(`ISSUER_DID=${didController}`);
    console.log(`ISSUER_PRIVATE_KEY=${JSON.stringify(finalPrivateKey)}`);

  } catch (error) {
    console.error("Error generating keys:", error);
  }
}

generateDIDKeys();