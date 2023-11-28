// File name: server.js
// Auth: Terminal Swag Disorder
// Desc: File containing code for database connectivity

const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const multer = require("multer");
require("dotenv").config();


// JSON web token for cookie
const jwtSecret = process.env.JWT_SECRET;
if(!jwtSecret) {
	console.error("Missing JWT_SECRET environment variable. Exiting...");
	process.exit(1);
}

const api = express();
const port = 4000;

api.use(express.json());

// Cors options to allow the use of user cookies
const corsOptions = {
	origin: "http://localhost:3000",	// replace with your application's origin
	credentials: true	// allows the Access-Control-Allow-Credentials: true header
};

api.use(cors(corsOptions));
api.use(cookieParser());

// Component db
const dbPath = path.resolve(__dirname, "database/pcbuildwebsite_db.db");
const db = new sqlite3.Database(dbPath);

// User db
const userDbPath = path.resolve(__dirname, "database/user_data.db");
const userDb = new sqlite3.Database(userDbPath)

// Middleware for profile images
// File filter for image validation
const imageFileFilter = (req, file, cb) => {
	const allowedFileTypes = ["image/jpeg", "image/png", "image/gif"];
	if (allowedFileTypes.includes(file.mimetype)) {
		cb(null, true); // Accept file
	} else {
		cb(new Error("Only image files are allowed!"), false); // Reject file
	}
};

// Config for multer
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "public/images");
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
		const extension = path.extname(file.originalname);
		cb(null, "ProfileImage" + "-" + uniqueSuffix + extension);
	}
});
const upload = multer({ storage: storage, fileFilter: imageFileFilter });


// Middleware for checking if user is logged in
const authenticateJWT = (req, res, next) => {

	// Check if cookie exists and retrieve the value, if it does not exist set accessToken to null 
	const token = req.cookies ? req.cookies.accessToken : null;
	//console.log(req.headers)
	//console.log(token)
	if (token) {

		// Verify the token to the jwtSecret
		jwt.verify(token, jwtSecret, (err, user) => {
			if (err) {
				return res.status(403).json({ message: "JWT token did not match" });
			}

			// If successful, set req.user to the decoded user info
			req.user = { ...user.user, isAdmin: user.isAdmin, isBanned: user.isBanned };
			next();
		});
	} else {
		return res.status(401).json({ message: "Could not verify JWT token" });
	}
};

// All of the users, not used in frontend
api.get("/api/users", (req, res) => {
	const sql = "SELECT * FROM user";
	userDb.all(sql, [], (err, users) => {
		if (err) {
			console.error(err);
			return res.status(500).send(err);
		} else {
			// Process each user to add isAdmin and isBanned properties
			const processedUsers = users.map(user => {
				const isAdmin = user.Admin === 1;
				const isBanned = user.Banned === 1;
				if (user.Completed_builds) {
					try {
						const Completed_buildsJSON = JSON.parse(user.Completed_builds)
						const { Completed_builds, Password, ...userData } = user;
						return { ...userData, isAdmin, isBanned, Completed_buildsJSON };
					} catch (err) {
						return console.error("Error parsing JSON:", error)
					}
				}
				// Exclude sensitive information like hashed password
				const { Completed_builds, Password, ...userData } = user;
				return { ...userData, isAdmin, isBanned, Completed_builds: "" };
			});
			return res.status(200).json(processedUsers);
		}
	});
});

// Show single user
api.get("/api/users/:id", (req, res) => {
	const { id } = req.params; 
	const sql = "SELECT * FROM user WHERE ID = ?";
	userDb.get(sql, [id], (err, user) => {
		if (err) {
			console.error(err.message);
			return res.status(500).json({ message: "Internal server error" });
		} else if (!user) {
			return res.status(404).json({ message: "User not found" });
		} else {
			const isAdmin = user.Admin === 1;
			const isBanned = user.Banned === 1;
			if (user.Completed_builds) {
				try {
					const Completed_buildsJSON = JSON.parse(user.Completed_builds)
					const { Completed_builds, Password, ...userData } = user;
					return res.status(200).json( {userData: { ...userData, isAdmin: isAdmin, isBanned: isBanned, Completed_buildsJSON }});
				} catch (err) {
					return console.error("Error parsing JSON:", error)
				}
			}
			// Exclude sensitive information like hashed password before sending the user data
			const { Password, ...userData } = user;
			return res.status(200).json( {userData: { ...userData, isAdmin: isAdmin, isBanned: isBanned, Completed_builds: "" }});
			console.log(userData)
		}
	});
});

// Signing up
api.post("/api/users/signup", async (req, res) => {
	const { Name, Email, Password } = req.body;
	console.log("server api user signup accessed")

	try {
		// Check if a user with the given email already exists
		const emailCheckSql = "SELECT Email FROM user WHERE Email = ?";
		userDb.get(emailCheckSql, [Email], async (err, row) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ message: "Error checking user's email" });
			}
			if (row) {
				return res.status(409).json({ message: "Email already in use" });
			}

			try {
				const hashedPassword = await bcrypt.hash(Password, 10);
				const sql = "INSERT INTO user (Name, Email, Password) VALUES (?, ?, ?)";

				userDb.run(sql, [Name, Email, hashedPassword], function (err) {
					if (err) {
						console.error(err);
						return res.status(500).send({ message: "Failed to insert user" });
					} else {
						return res.status(200).json({ id: this.lastID });
					}
				});
			} catch (error) {
				console.error(error);
				return res.status(500).json({ message: "Internal server error while registering new user" });
			}
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error" });
	}
});




// Login route
api.post("/api/login", (req, res) => {
	console.log("server api login accessed")
	const { Email, Password } = req.body;
	const sql = "SELECT * FROM user WHERE Email = ?";
	userDb.get(sql, [Email], async (err, user) => {
		if (err) {
			return res.status(500).json({ message: err });
			return;
		}
		// If the user does not exist
		else if (!user) {
			return res.status(401).json({ message: "User not found" });
			return;
		} else {

		// Compare hashed password with password in form
		const match = await bcrypt.compare(Password, user.Password);
		if (match) {
			// Check if user is an admin
			const isAdmin = user.Admin === 1;
			const isBanned = user.Banned === 1;
			if (user.Banned) {
				return res.status(403).json({ message: "User is banned" });
			}

			// Provide an accessToken cookie
			const accessToken = jwt.sign({ user, isAdmin, isBanned }, jwtSecret, {
				expiresIn: "1h",
			});
			res.cookie("accessToken", accessToken, {
				httpOnly: true,
				sameSite: "lax",
				maxAge: 3600000
			});
			return res.status(200).json({ message: "Logged in successfully", user });
		} else {
			return res.status(401).json({ message: "Password incorrect" });
			}
		}
	});
});

// Check if the user is logged in
api.get("/api/profile", authenticateJWT, (req, res) => {
	console.log("server api profile accessed")
	// If we're here, the JWT was valid and `req.user` contains the payload from the JWT
	// const userData = { userData: req.user };
	res.json({
		message: "Authenticated",
		userData: req.user,
	});
});

// Profile refresh if userdata gets updated
api.get("/api/profile/refresh", authenticateJWT, (req, res) => {
	const userId = req.user.ID; // Extract user ID from JWT payload
	const sql = "SELECT * FROM user WHERE ID = ?";
	userDb.get(sql, [userId], (err, user) => {
		if (err) {
			console.error(err.message);
			return res.status(500).json({ message: "Internal server error" });
		} else if (!user) {
			return res.status(404).json({ message: "User not found" });
		} else {
			const isAdmin = user.Admin === 1;
			const isBanned = user.Banned === 1;
			// Exclude sensitive information like hashed password before sending the user data
			const { Password, ...userData } = user;
			return res.status(200).json( {userData: { ...userData, isAdmin: isAdmin, isBanned: isBanned}});
		}
	});
});

// Update own user credentials
api.patch("/api/profile", authenticateJWT, upload.single("profileImage"), async (req, res) => {
	console.log("server api update own credentials accessed")
	const userId = req.user.ID; // User ID from the authenticated JWT, this already makes it secure
	const { Name, Email, Password, currentPassword } = req.body; // Updated credentials from request body
	const Profile_image = req.file; // Profile image

	try {

		const match = await bcrypt.compare(currentPassword, req.user.Password)
		if (!match) {
			return res.status(403).json({ message: "Current password is incorrect" });
		}

		let hashedPassword = null;
		if (Password) {
			// Hash the new password before storing it
			hashedPassword = await bcrypt.hash(Password, 10);
		}

		// SQL query to update user data
		// updateQuery allows for multiple fields to be updated simultaneously
		let updateQuery = "UPDATE user SET ";
		let queryParams = [];

		if (Name) {
			updateQuery += "Name = ?, ";
			queryParams.push(Name);
		}
		if (Email) {
			updateQuery += "Email = ?, ";
			queryParams.push(Email);
		}
		if (hashedPassword) {
			updateQuery += "Password = ?, ";
			queryParams.push(hashedPassword);
		}
		if (Profile_image) {
			const Profile_image_name = Profile_image.filename;
			updateQuery += "Profile_image = ?, ";
			queryParams.push(Profile_image_name);
		}

		// Remove trailing comma and space
		if (queryParams.length > 0 ) {
			updateQuery = updateQuery.slice(0, -2);
		}
		updateQuery += " WHERE ID = ?";
		queryParams.push(userId);

		userDb.run(updateQuery, queryParams, function (err) {
			if (err) {
				console.error(err.message);
				return res.status(500).json({ message: "Internal server error" });
			}
			if (this.changes === 0) {
				return res.status(404).json({ message: "Item not found" });
			}
			return res.status(200).json({ message: "User updated successfully", id: this.lastID });
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error" });
	}
});

// Add a computer build
api.patch("/api/computerwizard", authenticateJWT, async (req, res) => {
	console.log("server api computerwizard accessed")
	const userId = req.user.ID; // User ID from the authenticated JWT
	const formFields = req.body // New data to append
	

	try {
		// Some checks for formData data
		if (Number.isNaN(formFields.price) || formFields.price === 0 || formFields.price === undefined) {
			return res.status(400).json({ message: "Price must be a number between 500-5000" })
		} else if (formFields.price < 500 || formFields.price > 5000) {
			return res.status(400).json({ message: "Price must be between 500-5000" })
		}
		if (formFields.otherColor !== "" && formFields.colorPreference !== "other") {
			formFields.otherColor = ""
		}

		// First, retrieve the existing data
		const selectQuery = "SELECT Completed_builds FROM user WHERE ID = ?";
		userDb.get(selectQuery, [userId], (err, row) => {
			if (err) {
				console.error(err.message);
				return res.status(500).json({ message: "Internal server error" });
			}

			// Combine the new data with the existing data
			let existingData = row.Completed_builds ? JSON.parse(row.Completed_builds) : [];

			// Assign a new ID to the new data based on existing entries
			const newEntryId = existingData.length + 1;
			const newEntry = { ID: newEntryId, ...formFields };

			existingData.push(newEntry);
			let combinedData = JSON.stringify(existingData);


			// Now, update the database with the combined data
			let updateQuery = "UPDATE user SET Completed_builds = ? WHERE ID = ?";
			userDb.run(updateQuery, [combinedData, userId], function (err) {
				if (err) {
					console.error(err.message);
					return res.status(500).json({ message: "Internal server error" });
				}
				if (this.changes === 0) {
					return res.status(404).json({ message: "Item not found" });
				}
				return res.status(200).json({ message: "Completed builds updated successfully", id: this.lastID });
			});
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error" });
	}
});



// For admins
// Add user
api.post("/api/admin/signup", authenticateJWT, async (req, res) => {
	const { Name, Email, Password, Admin } = req.body;
	console.log("server api admin user signup accessed")

	try {
		// Check if a user with the given email already exists
		const emailCheckSql = "SELECT Email FROM user WHERE Email = ?";
		userDb.get(emailCheckSql, [Email], async (err, row) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ message: "Error checking user's email" });
			}
			if (row) {
				return res.status(409).json({ message: "Email already in use" });
			}

			try {
				const hashedPassword = await bcrypt.hash(Password, 10);
				let sql, params;
				// Only admins can add other as admin upon signup
				if (req.user.isAdmin) {
					console.log("Admin user added a new user")
					const Admin = req.body.Admin ? 1 : 0;
					sql = "INSERT INTO user (Name, Email, Password, Admin) VALUES (?, ?, ?, ?)";
					params = [Name, Email, hashedPassword, Admin];
				} else {
					return res.status(403).json({ message: "Unauthorized" });
				}

				userDb.run(sql, params, function (err) {
					if (err) {
						console.error(err);
						return res.status(500).send({ message: "Failed to insert user" });
					} 
					if (this.changes === 0) {
						return res.status(404).json({ message: "Item not found" });
					}
					return res.status(200).json({ id: this.lastID });
				});
			} catch (error) {
				console.error(error);
				return res.status(500).json({ message: "Internal server error while registering new user" });
			}
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error" });
	}
});


// Update user credentials
api.patch("/api/users/:id", authenticateJWT, upload.single("profileImage"), async (req, res) => {
	console.log("server api admin update credentials accessed")
	const { id } = req.params; // User ID from the url
	const { formFields } = req.body; // Updated credentials from request body
	const Profile_image = req.file; // Profile image
	const jsonFormFields = JSON.parse(formFields)
	console.log(jsonFormFields)

	const allowedFields = ["ID", "Name", "Email", "Password", "Profile_image", "Admin", "Banned"];


	try {
		// Only admins are allowed to update through this
		if (!req.user.isAdmin) {
			return res.status(403).json({ message: "Unauthorized" });
		}

		let hashedPassword = null;

		// SQL query to update user data
		// updateQuery allows for multiple fields to be updated simultaneously
		let updateQuery = "UPDATE user SET ";
		let queryParams = [];

		for (const key in jsonFormFields) {
			if (allowedFields.includes(key)) {
				if (jsonFormFields.hasOwnProperty(key)) {
					if (jsonFormFields[key] !== "") {
				if (key === "Password") {
					// Hash the new password before storing it
					hashedPassword = await bcrypt.hash(key, 10);
				}
					updateQuery += `${key} = ?, `;
					queryParams.push(jsonFormFields[key]);
					}
				}
			}
		}

		if (Profile_image) {
			const Profile_image_name = Profile_image.filename;
			updateQuery += "Profile_image = ?, ";
			queryParams.push(Profile_image_name);
		}

		// Remove trailing comma and space
		if (queryParams.length > 0 ) {
			updateQuery = updateQuery.slice(0, -2);
		}
		updateQuery += " WHERE ID = ?";
		queryParams.push(id);

		 console.log("queryParams: ", queryParams)
		 console.log("updateQuery: ", updateQuery)
		userDb.run(updateQuery, queryParams, function (err) {
			if (err) {
				console.error(err.message);
				return res.status(500).json({ message: "Internal server error" });
			} 
			if (this.changes === 0) {
				return res.status(404).json({ message: "Item not found" });
			}
			return res.status(200).json({ message: "User updated successfully", id: this.lastID });
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error" });
	}
});


// Logout route (Frontend will handle removing the token)
api.post("/api/logout", (req, res) => {
	console.log("server api logout accessed")
	res.clearCookie("accessToken");
	res.json({ message: "Logged out successfully" });
});


// Get all of the component data from the db
api.get("/api/:component", (req, res) => {
	let { component } = req.params;
	const sql = `SELECT * FROM ${component}`;
	db.all(sql, [], (err, rows) => {
		if (err) {
			console.error(err);
			return res.status(500).send(err);
		} else {
			return res.status(200).json(rows);
		}
	});
});

// Show single component
api.get("/api/:component/:id", (req, res) => {
	const { component, id } = req.params; 
	const sql = `SELECT * FROM ${component} WHERE ID = ?`;
	db.get(sql, [id], (err, row) => {
		if (err) {
			console.error(err.message);
			return res.status(500).json({ message: "Internal server error" });
		} else if (!row) {
			return res.status(404).json({ message: "User not found" });
		} else {
			// Exclude sensitive information like hashed password before sending the row data
			const { Password, ...rowData } = row;
			console.log(row)
			return res.status(200).json( {rowData: row });
		}
	});
});

// Update single component
api.patch("/api/:component/:id", authenticateJWT, (req, res) => {
	console.log("server api admin update credentials accessed");
	const { component, id } = req.params; // Component ID from the url
	const formFields = req.body; // Updated fields from request body
	const regEx = /.*jimms\.fi\/fi\/Product\/Show\/.+/

	try {
		// Only admins are allowed to update this
		if (!req.user.isAdmin) {
			return res.status(403).json({ message: "Unauthorized" });
		}

		if (typeof Url !== "undefined") {
		if (!regEx.test(Url)) {
				return res.status(400).json({ message: "Invalid URL format. Must be a Jimms product." });
			}
		}

		// SQL query to update component data
		// updateQuery allows for multiple fields to be updated simultaneously
		let updateQuery = `UPDATE ${component} SET `;
		let queryParams = [];

		// Iterate through the formFields object and add fields to the query
		for (const key in formFields) {
			if (formFields.hasOwnProperty(key)) {
				if (formFields[key] !== "") {
				if (key === "Url") {
					if (!regEx.test(formFields[key])) {
							return res.status(400).json({ message: "Invalid URL format. Must be a Jimms product." });
						}
				}
				updateQuery += `${key} = ?, `;
				queryParams.push(formFields[key]);
				}
			}
		}

		// Remove trailing comma and space
		if (queryParams.length > 0) {
			updateQuery = updateQuery.slice(0, -2);
		}
		updateQuery += " WHERE ID = ?";
		queryParams.push(id);

		console.log(updateQuery)
		console.log(queryParams)

		// Execute the SQL query
		db.run(updateQuery, queryParams, function (err) {
			if (err) {
				console.error(err.message);
				return res.status(500).json({ message: "Internal server error" });
			}
			if (this.changes === 0) {
				return res.status(404).json({ message: "Item not found" });
			}
			return res.status(200).json({ message: "Component updated successfully", id: this.lastID });
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal server error" });
	}
});

// Post operation for all components
api.post("/api/:component", authenticateJWT, (req, res) => {
	console.log("server api add component accessed");
	const { component } = req.params;
	const { ID, Url, Price, Name, Manufacturer, Image, Image_Url, ...dynamicFields } = req.body;

	// Predefined SQL queries for security, can add more in the future
	const componentQueries = {
		"chassis": "INSERT INTO chassis (ID, Url, Price, Name, Manufacturer, Image, Image_Url, Chassis_type, Dimensions, Color, Compatibility) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
		"cpu": "INSERT INTO cpu (ID, Url, Price, Name, Manufacturer, Image, Image_Url, Core_Count, Thread_Count, Base_Clock, Cache, Socket, Cpu_Cooler, TDP, Integrated_GPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
		"cpu_cooler": "INSERT INTO cpu_cooler (ID, Url, Price, Name, Manufacturer, Image, Image_Url, Compatiblilty, Cooling_Potential, Fan_RPM, Noise_Level, Dimensions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
		"gpu": "INSERT INTO gpu (ID, Url, Price, Name, Manufacturer, Image, Image_Url, Cores, Core_Clock, Memory, Interface, Dimensions, TDP) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
		"memory": "INSERT INTO memory (ID, Url, Price, Name, Manufacturer, Image, Image_Url, Type, Amount, Speed, Latency) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
		"motherboard": "INSERT INTO motherboard (ID, Url, Price, Name, Manufacturer, Image, Image_Url, Chipset, Form_Factor, Memory_Compatibility) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
		"psu": "INSERT INTO psu (ID, Url, Price, Name, Manufacturer, Image, Image_Url, Is_ATX12V, Efficiency, Modular, Dimensions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
		"storage": "INSERT INTO storage (ID, Url, Price, Name, Manufacturer, Image, Image_Url, Capacity, Form_Factor, Interface, Cache, Flash, TBW) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
	};
	if (!componentQueries[component]) {
		return res.status(400).json({ message: "Invalid component type" });
	}

	const regEx = /.*jimms\.fi\/fi\/Product\/Show\/.+/

	if (!req.user.isAdmin) {
		return res.status(403).json({ message: "Unauthorized" });
	}

	if (!Url || !Price || !Name || !Manufacturer) {
		return res.status(400).json({ message: "Missing required fields" });
	}
	if (!regEx.test(Url)) {
		return res.status(400).json({ message: "Invalid URL format. Must be a Jimms product." });
	}

	// Check if an item with the same Url already exists
	const checkSql = `SELECT * FROM ${component} WHERE Url = ?`;
	db.get(checkSql, [Url], (checkErr, row) => {
		if (checkErr) {
			console.error(checkErr);
			return res.status(500).json({ message: "Internal server error" });
		}
		if (row) {
			return res.status(409).json({ message: "Item already exists" });
		}

		// For the dynamic fields
		// const fieldNames = Object.keys(dynamicFields).join(', ');
		// const placeholders = dynamicFields.map(() => '?').join(', ');
		const fieldValues = Object.values(dynamicFields);

		const sql = componentQueries[component];
		const params = [ID, Url, Price, Name, Manufacturer, Image, Image_Url, ...fieldValues]
		db.run(sql, params, function (err) {
			if (err) {
				console.error(err);
				return res.status(500).json({ message: "Failed to insert item" });
			}
			if (this.changes === 0) {
				return res.status(404).json({ message: "Item not found" });
			}
			return res.status(200).json({ id: this.lastID });
		});
	});
});

// Delete operation for all components
api.delete("/api/:component/:id/delete", authenticateJWT, (req, res) => {
	console.log("server api delete component accessed");
	const { component, id } = req.params;

	// Validate the component type
	const allowedComponents = ["chassis", "cpu", "cpu_cooler", "gpu", "memory", "motherboard", "psu", "storage"];
	if (!allowedComponents.includes(component)) {
		return res.status(400).json({ message: "Invalid component type" });
	}

	if (!req.user.isAdmin) {
		return res.status(403).json({ message: "Unauthorized: Admin access required" });
	}

	if (!id || isNaN(id)) {
		return res.status(400).json({ message: "Invalid ID format" });
	}

	// SQL query to delete the item
	const sql = `DELETE FROM ${component} WHERE ID = ?`;

	// Execute the query
	db.run(sql, [id], function (err) {
		if (err) {
			console.error(err);
			return res.status(500).json({ message: "Failed to delete item" });
		}
		if (this.changes === 0) {
			return res.status(404).json({ message: "Item not found" });
		}
		return res.status(200).json({ message: "Item deleted successfully", id: id });
	});
});


api.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});
