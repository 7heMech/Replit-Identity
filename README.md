Replit Identity is a signed identity token for every Repl that your code can use to authenticate other Repls when communicating with your APIs and services.
## Installation
```
npm install replit-identity
```
## Usage
```js
const { create, verify } = require('replit-identity');

const audience = process.env.REPL_ID; // target repl id

// Create a token
const token = create(audience);

// Verify a token
const info = verify(audience, token);
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

Returns an object of this format:
```json
{
	"replid": "The id of the Repl where the token was created.",
	"slug": "The slug of the Repl where the token was created.",
	"user": "The name of the User who created the token.",
	"user_id": 123456,
	"aud": "The target Repl's id."
}
```