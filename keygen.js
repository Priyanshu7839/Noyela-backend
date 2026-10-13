
import fs from "fs";
import jwt from "jsonwebtoken";


 const  APPLE_TEAM_ID = `638CC8JN26`
 const APPLE_KEY_ID = `K9SAPQQSKG`
 const APPLE_CLIENT_ID = `com.noyela.app`
  



const privateKey = fs.readFileSync(
  './AuthKey_29BCYJU73C.p8',
  "utf8"
);

const now = Math.floor(Date.now() / 1000);

const payload = {
  iss: APPLE_TEAM_ID,
  iat: now,
  exp: now + 60 * 60 * 24 * 180, // 180 days
  aud: "https://appleid.apple.com",
  sub: APPLE_CLIENT_ID,
};

const clientSecret = jwt.sign(payload, privateKey, {
  algorithm: "ES256",
  keyid: APPLE_KEY_ID,
});

console.log("\nApple OAuth Client Secret:\n");
console.log(clientSecret);
console.log("\nExpires in 180 days.");