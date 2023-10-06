// Never run this in actual production

const crypto = require("crypto");
const fs = require("fs");

const newSecret = crypto.randomBytes(64).toString("hex");
const secret = `JWT_SECRET=${newSecret}`

fs.writeFile("./.env", secret, err => {
if (err) {
	console.error("Error generating secret token: ", err);
} else {
	console.log("Secret token successfully generated")
}
});