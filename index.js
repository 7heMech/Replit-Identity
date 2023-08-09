const { execSync } = require("child_process");

/**
 * @typedef {Object} info
 * @property {string} replid - The id of the repl where the token was created.
 * @property {string} slug - The slug of the repl where the token was created.
 * @property {string} user - The name of the user who created the token.
 * @property {number} user_id - Id of the user who created the token.
 * @property {string} aud - The target repl's id.
 */

/**
 * Executes Replit CLI's identity command with specified command and arguments.
 * @function
 * @param {'create'|'verify'} cmd - The command to execute.
 * @param {Object} [flags] - An object containing the options for the command.
 * @param {string} flags.audience - The target repl's id.
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
 * @param {string} audience - The target repl's id.
 * @returns {string} - The created token.
 */
const create = (audience) => identity('create', { audience });

/**
 * Verifies an existing identity token against an audience.
 * @function
 * @param {string} audience - The target repl's id.
 * @param {string} token - The identity token to verify.
 * @returns {info|null} - Returns null if there was token - audience identity mismatch.
 */
const verify = (audience, token) => identity('verify', { audience, token, json: 'true' });

module.exports = {
	create,
	verify
};