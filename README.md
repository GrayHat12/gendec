# G-EnDec

Simple cli password based encryption decryption tool for a single file using `aes-256-cbc` algorithm.

## Usage

```bash
Usage: npx gendec [options] [command]

Encrypt and decrypt files with a password.

Options:
  -V, --version             output the version number
  -h, --help                display help for command

Commands:
  encrypt [options] <file>  Encrypt a file with a password.
  decrypt [options] <file>  Decrypt a file with a password.
  help [command]            display help for command
```