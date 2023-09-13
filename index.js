const { execSync } = require("child_process");

/** 
@typedef {Object} Runtime
@property {Object} [interactive]
@property {string} interactive.cluster
@property {string} interactive.subcluster
*/

/**
 * @typedef {Object} Info
 * @property {string} user - The name of the user who created the token.
 * @property {string} slug - The slug of the repl where the token was created.
 * @property {number} userId - Id of the user who created the token.
 * @property {string} replId - The id of the repl where the token was created.
 * @property {string} aud - The audience for which the token was created
 * @property {Runtime} runtime - The current runtime.
 */

/**
 * Executes Replit CLI's identity command with specified command and arguments.
 * @function
 * @param {'create'|'verify'} cmd - The command to execute.
 * @param {Object} [flags] - An object containing the options for the command.
 * @param {string} flags.audience - The audience for which the token will be/was created.
 * @param {string} flags.token - The token to verify (Used with verify command)
 * @param {string} flags.json - Returns object.
 * @returns {object|string|null} - Returns null if there was token identity mismatch.
 */
const identity = (cmd, flags) => {
	const args = Object.keys(flags).reduce((str, flag) => {
		const value = flags[flag].replaceAll('"', '\\"');
		return `${str} -${flag}="${value}"`;
	}, '');

	const command = '$REPLIT_CLI identity ' + cmd + args;

	let res;
	try {
		res = execSync(command).toString().trimEnd();
		if (flags.json) res = JSON.parse(res);
	} catch (err) {
		res = null;
	}
	return res;
};

/**
 * Creates a new identity token.
 * @function
 * @param {string} audience - The audience for which the token will be created.
 * @returns {string} - The created token.
 */
const create = (audience) => identity('create', { audience });

/**
 * Verifies an existing identity token against an audience.
 * @function
 * @param {string} audience - The audience for which the token was created.
 * @param {string} token - The identity token to verify.
 * @returns {Info|null} - Returns null if there was token - audience identity mismatch.
 */
const verify = (audience, token) => camelize(identity('verify', { audience, token, json: 'true' }));

module.exports = {
	create,
	verify
};

function camelize(o) {
	const obj = {};
	for (const [key, value] of Object.entries(o)) {
		if (key === 'replid') {
			obj.replId = value;
			continue;
		}

		// camelize
  	let newKey = key.replace(/[\-_\s]+(.)?/g, (_, chr) => chr ? chr.toUpperCase() : '');
  	newKey = newKey.substr(0, 1).toLowerCase() + newKey.substr(1);
		
		obj[newKey] = typeof value === 'object' && value !== null ? camelize(value) : value;
	}
	return obj;
}