const { execSync } = require("child_process");

/** 
 * @typedef {Object} Runtime
 * @property {Object} [interactive]
 * This is set if the Repl is running interactively and not when the Repl is running in hosting.
 * @property {string} interactive.cluster - The cluster in which this Repl is running.
 * @property {string} interactive.subcluster - The subcluster in which this Repl is running.
 * @property {Object} [hosting]
 * This is set if the Repl is running in a hosting subcluster.
 * @property {string} hosting.cluster - The cluster in which this Repl is running.
 * @property {string} hosting.subcluster - The subcluster in which this Repl is running.
 * @property {Object} [deployment]
 * This is set if the Repl is running in a Deployment.
 */

/**
 * @typedef {Object} Info
 * @property {string} user - The name of the user who created the token.
 * @property {string} slug - The slug of the repl where the token was created.
 * @property {number} userId - The id of the user who created the token.
 * @property {string} replId - The id of the repl where the token was created.
 * @property {string} [originReplId] - The id of the original repl despite the running environment being a fork.
 * @property {string} aud - The audience for which the token was created.
 * @property {Runtime|null} runtime - Runtime information about the Repl.
 */

/**
 * Executes Replit CLI's identity command with specified command and arguments.
 * @function
 * @param {'create'|'verify'} cmd - The command to execute.
 * @param {Object} [flags] - An object containing the options for the command.
 * @param {string} flags.audience - The audience for which the token will be/was created.
 * @param {string} flags.token - The token to verify. (Used with verify command)
 * @param {string} flags.json - Returns object.
 * @returns {object|string|null} - Returns null if there was token identity mismatch.
 */
const identity = (cmd, flags) => {
	let args = '', res;

	try {
		const keys = Object.keys(flags);
		for (let i = 0; i < keys.length; i++) {
			const flag = keys[i];
			args += ` -${flag}="${flags[flag].replaceAll('"', '\\"')}"`
		}

		const command = '$REPLIT_CLI identity ' + cmd + args;

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
 * @returns {string|null} - The created token or null if there was an error creating the token.
 */
const create = (audience) => identity('create', { audience });

/**
 * Verifies an existing identity token against an audience.
 * @function
 * @param {string} token - The identity token to verify.
 * @param {string} audience - The audience for which the token was created.
 * @returns {Info|null} - Returns null if there was token - audience identity mismatch.
 */
const verify = (token, audience) => camelize(identity('verify', { audience, token, json: 'true' }));

module.exports = { create, verify };

function camelize(obj) {
	replace(obj, { 
		replid: 'replId',
		user_id: 'userId',
		Runtime: 'runtime',
		originReplid: 'originReplId'
	});
	replace(obj.runtime, {
		Interactive: 'interactive',
		Hosting: 'hosting',
		Deployment: 'deployment',
	});
	return obj;
}

function replace(object, keys) {
	for (const [oldKey, newKey] of Object.entries(keys)) {
		if (oldKey in object) delete Object.assign(object, {[newKey]: object[oldKey]})[oldKey];
	}
}