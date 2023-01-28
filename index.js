const { execSync } = require("child_process");

module.exports = async (cmd, args) => (await execSync(
	"$REPLIT_CLI identity " + cmd + Object.keys(args).reduce((str, arg) => `${str} -${arg}="${args[arg]}"`, "")
)).toString();