Replit Identity is a signed identity token for every Repl that your code can use to authenticate other Repls when communicating with your APIs and services.
## Installation
```
npm install replit-identity
```
## Usage
```js
const { create, verify } = require('replit-identity');

const audience = 'target-repl-id';
const token = create(audience);

const info = verify(token, audience);
console.log(info);
```
This package can only be used in a Replit environment.
## API
Replit Identity exports an object with the following functions:
#### create
Creates a new identity token.

* `audience` (string): The audience of the token.

Returns a string token.
  
#### verify
Verifies an existing identity token.

* `audience` (string): The audience to verify against.
* `token` (string): The token to verify.

Returns an object with info about the token or null if invalid.