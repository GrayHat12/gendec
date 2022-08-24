#!/usr/bin/env node

import chalk from "chalk";
import gradient from "gradient-string";
import figlet from "figlet";
import { createSpinner } from "nanospinner";
import fs from "fs";
import path from "path";
import { decrypt, encrypt } from "./crypto.js";
import { Command } from "commander";

function encryptFile(filepath, password, enc_file_name = null) {
    let name = path.basename(filepath);
    let encrypted_name = name.split(".");
    encrypted_name.splice(encrypted_name.length - 1, 1, "ghh");
    encrypted_name = encrypted_name.join(".");
    let fileBuffer = fs.readFileSync(filepath);
    let encrypted = encrypt(fileBuffer, password, name);
    fs.writeFileSync(enc_file_name || encrypted_name, encrypted, { encoding: "binary" });
    return enc_file_name || encrypted_name;
}

function decryptFile(filepath, password, filename = null) {
    let fileBuffer = fs.readFileSync(filepath);
    let { name, response } = decrypt(fileBuffer, password);
    fs.writeFileSync(filename || name, response, { encoding: "binary" });
    return filename || name;
}

// const program = new Command(chalk.bold("🌈 G-EnDec 🌈"));
const program = new Command("gendec");

program.description("Encrypt and decrypt files with a password.").version("1.0.0");

program
    .command("encrypt")
    .description("Encrypt a file with a password.")
    .argument("<file>", "The file to encrypt.")
    .option("-p, --password <password>", "The password to use for encryption (required)")
    .option("-n, --filename [filename]", "The name to use for the encrypted file")
    .action((file, options) => {
        if (!options.password) {
            program.error("You must provide a password.");
            return;
        }
        console.log(gradient.pastel.multiline(figlet.textSync("G-EnDec", { font: "ANSI Regular" }) + "\n"));
        let spinner = createSpinner("Encrypting...", {
            color: "yellow",
        }).start();
        try {
            let enc_name = encryptFile(file, options.password, options.filename);
            spinner.success({
                text: `Encrypted file saved as ${chalk.bold(enc_name)}`,
                color: "green",
            });
        } catch (e) {
            spinner.error({
                text: "Error encrypting file.",
                color: "red",
            });
            console.error(e);
            program.error(e);
        }
    });

program
    .command("decrypt")
    .description("Decrypt a file with a password.")
    .argument("<file>", "The file to decrypt.")
    .option("-p, --password <password>", "The password to use for decryption (required)")
    .option("-n, --filename [filename]", "The name after file is decrypted")
    .action((file, options) => {
        if (!options.password) {
            program.error("You must provide a password.");
            return;
        }
        console.log(gradient.pastel.multiline(figlet.textSync("G-EnDec", { font: "ANSI Regular" }) + "\n"));
        let spinner = createSpinner("Decrypting...", {
            color: "yellow",
        }).start();
        try {
            let dec_name = decryptFile(file, options.password, options.filename);
            spinner.success({
                text: `Decrypted file saved as ${chalk.bold(dec_name)}`,
                color: "green",
            });
        } catch (e) {
            spinner.error({
                text: "Error decrypting file.",
                color: "red",
            });
            console.error(e);
            program.error(e);
        }
    });

program.parse();
