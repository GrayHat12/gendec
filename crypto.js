import crypto from "crypto";

const IV_LENGTH = 16;
const ALG_NAME_MAX_SIZE = 32;
const NAME_MAX_SIZE = 128;

const algorithm = "aes-256-cbc";

export function encrypt(buffer, password, name) {
    let key = crypto.createHash("md4").update(password).digest("hex");
    let iv = crypto.randomBytes(IV_LENGTH).toString("hex").slice(0, IV_LENGTH);
    let cipher = crypto.createCipheriv(algorithm, key, iv);
    let name_buffer = Buffer.alloc(NAME_MAX_SIZE, "", "utf-8");
    name_buffer.write(name, 0);
    let data = Buffer.concat([name_buffer, buffer]);
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    let algbuffer = Buffer.alloc(ALG_NAME_MAX_SIZE, "", "utf-8");
    algbuffer.write(algorithm, 0);
    return Buffer.concat([algbuffer, Buffer.from(iv, "utf-8", IV_LENGTH), encrypted]);
}

export function decrypt(buffer, password) {
    let key = crypto.createHash("md4").update(password).digest("hex");
    let bundle = Buffer.from(buffer);
    let algorithm = bundle.toString("utf-8", 0, ALG_NAME_MAX_SIZE);
    let iv = bundle.toString("utf-8", ALG_NAME_MAX_SIZE, ALG_NAME_MAX_SIZE + IV_LENGTH);
    let encrypted = bundle.subarray(ALG_NAME_MAX_SIZE + IV_LENGTH);
    let cipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = cipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, cipher.final()]);
    let name = decrypted.subarray(0, NAME_MAX_SIZE).filter(x => x !== 0).toString("utf-8");
    let response = decrypted.subarray(NAME_MAX_SIZE);
    return { name, response };
}

