A simple package to interact with the Replit CLI's `identity` command.

Replit Identity is a signed identity for every Repl that your code can use to authenticate other Repls when communicating with your APIs and services.
## Installation
```
npm install replit-identity
```
## Examples
```js
const replitIdentity = require('replit-identity');

// Create a token
const token = replitIdentity('create', { audience: 'target repl id' });

// Verify a token
const info = replitIdentity('verify', { audience: 'target repl id', token, json: true });
console.log(info);
```
**Note**: This package uses the $REPLIT_CLI identity command to run the commands, so it can only be used in a Replit environment.
## Commands

#### create
Create a new token with the given options.

* `audience` (required): The audience of the token.
* `json` (optional): Output in JSON format.
  
#### verify
Verify an existing token with the given options.

* `audience` (required): The audience of the token.
* `token` (required): The token to verify.
* `json` (optional): Output in JSON format.
  
### Return Value
* `create` returns the token if json flag is not provided, returns json object containing token if json flag is provided.
* `verify` returns json object containing replid, user, slug, aud if json flag is provided, returns plain text otherwise.