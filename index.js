const { execSync } = require("child_process");

/**
 * Executes Replit CLI's identity command with specified command and arguments.
 * @function
 * @async
 * @param {string} cmd - The command to execute. Possible values: "create", "verify".
 * @param {object} args - An object containing the options for the command.
 * Possible options for the "create" command:
 *  - audience: the target Repl's ID.
 *  - json: if set to true, the command's output will be parsed as JSON.
 * Possible options for the "verify" command:
 *  - audience: the target Repl's ID.
 *  - token: the token to verify.
 *  - json: if set to true, the command's output will be parsed as JSON.
 * 
 * @returns {(string|object)} - The output of the command. If the json option is set to true, the output will be parsed as JSON.
 * @throws {Error} - When the command execution fails.
 */
const identity = async (cmd, args) => {
	let res = (await execSync("$REPLIT_CLI identity " + cmd + Object.keys(args).reduce((str, arg) => `${str} -${arg}="${args[arg]}"`, ""))).toString();
	if (args.json) res = JSON.parse(res);
	return res;
};

module.exports = identity;