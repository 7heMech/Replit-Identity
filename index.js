const { execSync } = require("child_process");

/**
 * @typedef {Object} info
 * @property {string} replid - Id of Repl where token was created.
 * @property {string} slug - Slug of the Repl where token was created.
 * @property {string} user - Username of User who created token.
 * @property {number} user_id - Id of user who created token.
 * @property {string} aud - Target Repl's ID.
 */

/**
 * Executes Replit CLI's identity command with specified command and arguments.
 * @function
 * @param {'create'|'verify'} cmd - The command to execute.
 * @param {Object} [flags] - An object containing the options for the command.
 * @param {string} flags.audience - The target Repl's ID.
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
 * @param {string} audience - The target Repl's ID.
 * @returns {string} - The created token.
 */
const create = (audience) => identity('create', { audience });

/**
 * Verifies an existing identity token against an audience.
 * @function
 * @param {string} audience - The target Repl's ID.
 * @param {string} token - The identity token to verify.
 * @returns {info|null} - Returns null if there was token - audience identity mismatch.
 */
const verify = (audience, token) => identity('verify', { audience, token, json: 'true' });

module.exports = {
	create,
	verify
};