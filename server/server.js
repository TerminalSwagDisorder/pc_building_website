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
require('dotenv').config();

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

// All of the users, not used in frontend
api.get("/api/users", (req, res) => {
	const sql = "SELECT * FROM user";
	userDb.all(sql, [], (err, users) => {
		if (err) {
			console.error(err);
			res.status(500).send(err);
		} else {
			// Process each user to add isAdmin and isBanned properties
			const processedUsers = users.map(user => {
				const isAdmin = user.Admin === 1;
				const isBanned = user.Banned === 1;
				// Exclude sensitive information like hashed password
				const { Password, ...userData } = user;
				return { ...userData, isAdmin, isBanned };
			});

			res.status(200).json(processedUsers);
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
			res.status(500).json({ message: "Internal server error" });
		} else if (!user) {
			res.status(404).json({ message: "User not found" });
		} else {
			const isAdmin = user.Admin === 1;
			const isBanned = user.Banned === 1;
			// Exclude sensitive information like hashed password before sending the user data
			const { Password, ...userData } = user;
			res.status(200).json( {userData: { ...userData, isAdmin: isAdmin, isBanned: isBanned }});
			console.log(userData)
		}
  	});
});

// Signing up
api.post("/api/users", async (req, res) => {
  const { Name, Email, Password } = req.body;

	try {
		// Check if a user with the given email already exists
		const emailCheckSql = "SELECT Email FROM user WHERE Email = ?";
		userDb.get(emailCheckSql, [Email], async (err, row) => {
				if (err) {
					console.error(err);
					return res.status(500).json({message: "Error checking users email"});
				}
				if (row) {
					return res.status(409).json({message: "Email already in use"});
				}

				try {
					// Hash the password before storing it
					const hashedPassword = await bcrypt.hash(Password, 10);

					const sql = "INSERT INTO user (Name, Email, Password) VALUES (?, ?, ?)";
					userDb.run(sql, [Name, Email, hashedPassword], function (err) {
						if (err) {
							console.error(err);
							res.status(500).send(err);
						} else {
							res.status(200).json({ id: this.lastID });
						}
					});
				} catch (error) {
					console.error(error);
					res.status(500).json({message: "Internal server error while registering new user"});
			}
		});
	} catch (error) {
			console.error(error);
			res.status(500).json({message: "Internal server error"});
		}
	});

// Login route
api.post("/api/login", (req, res) => {
	console.log("server api login accessed")
	const { Email, Password } = req.body;
	const sql = "SELECT * FROM user WHERE Email = ?";
	userDb.get(sql, [Email], async (err, user) => {
		if (err) {
			res.status(500).json({ message: err });
			return;
		}
		// If the user does not exist
		else if (!user) {
			res.status(401).json({ message: "User not found" });
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
			res.status(200).json({ message: "Logged in successfully", user });
		} else {
			res.status(401).json({ message: "Password incorrect" });
			}
		}
	});
});

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
				return res.status(403).json({ message: "JWT 403 error" });
			}
			
			// If successful, set req.user to the decoded user info
			req.user = { ...user.user, isAdmin: user.isAdmin, isBanned: user.isBanned };
			next();
		});
	} else {
		res.status(401).json({ message: "JWT 401 error" });
	}
};

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

// Update own user credentials
api.patch("/api/profile", authenticateJWT, async (req, res) => {
	console.log("server api update own credentials accessed")
	const userId = req.user.ID; // User ID from the authenticated JWT, this already makes it secure
	const { Name, Email, Password, Profile_image } = req.body; // Updated credentials from request body

	try {

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
			updateQuery += "Profile_image = ?, ";
			queryParams.push(Profile_image);
		}

		// Remove trailing comma and space
		updateQuery = updateQuery.slice(0, -2);
		updateQuery += " WHERE ID = ?";
		queryParams.push(userId);

		userDb.run(updateQuery, queryParams, function (err) {
			if (err) {
				console.error(err.message);
				res.status(500).json({ message: "Internal server error" });
			} else {
				res.status(200).json({ message: "User updated successfully", id: this.lastID });
			}
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
});

// For admins
// Update user credentials

// Update user credentials
api.patch("/api/users/:id", authenticateJWT, async (req, res) => {
	console.log("server api admin update credentials accessed")
	const { id } = req.params; // User ID from the url
	const { ID, Name, Email, Password, Profile_image, Admin, Banned } = req.body; // Updated credentials from request body
	// console.log("Server data: ", { ID, Name, Email, Password, Profile_image, Admin, Banned })

	try {
		// Only admins are allowed to update through this
		if (!req.user.isAdmin) {
			return res.status(403).json({ message: "Unauthorized" });
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
			updateQuery += "Profile_image = ?, ";
			queryParams.push(Profile_image);
		}
		if (Admin) {
			updateQuery += "Admin = ?, ";
			queryParams.push(Admin);
		}
		if (Banned) {
			updateQuery += "Banned = ?, ";
			queryParams.push(Banned);
		}

		// Remove trailing comma and space
		if (queryParams.length > 0 ) {
			updateQuery = updateQuery.slice(0, -2);
		}
		updateQuery += " WHERE ID = ?";
		queryParams.push(id);

		// console.log("queryParams: ", queryParams)
		// console.log("updateQuery: ", updateQuery)
		userDb.run(updateQuery, queryParams, function (err) {
			if (err) {
				console.error(err.message);
				res.status(500).json({ message: "Internal server error" });
			} else {
				res.status(200).json({ message: "User updated successfully", id: this.lastID });
			}
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
});


// Logout route (Frontend will handle removing the token)
api.post("/api/logout", (req, res) => {
	console.log("server api logout accessed")
	res.clearCookie("accessToken");
	res.json({ message: "Logged out successfully" });
});


// Get all of the component data from the db, do this for all components
api.get("/api/chassis", (req, res) => {
	const sql = "SELECT * FROM chassis";
	db.all(sql, [], (err, rows) => {
		if (err) {
			console.error(err);
			res.status(500).send(err);
		} else {
			res.status(200).json(rows);
		}
	});
});

// Provide posting to the db for all components, in case it it implemented
api.post("/api/chassis", authenticateJWT, (req, res) => {
	const { ID, Url, Price, Name, Manufacturer, Image, Image_Url, Chassis_type, Dimensions, Color, Compatibility } = req.body;
	const sql = "INSERT INTO chassis (ID, Url, Price, Name, Manufacturer, Image, Image_Url, Chassis_type, Dimensions, Color, Compatibility) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

	if (!req.user.isAdmin) {
		return res.status(403).json({ message: "Unauthorized" });
	}

	db.run(sql, [ID, Url, Price, Name, Manufacturer, Image, Image_Url, Chassis_type, Dimensions, Color, Compatibility], function (err) {
		if (err) {
			console.error(err);
			res.status(500).send(err);
		} else {
			res.status(200).json({ id: this.lastID });
		}
	});
});


api.get("/api/cpus", (req, res) => {
	const sql = "SELECT * FROM cpu";
	db.all(sql, [], (err, rows) => {
		if (err) {
			console.error(err);
			res.status(500).send(err);
		} else {
			res.status(200).json(rows);
		}
	});
});

api.post("/api/cpus", authenticateJWT, (req, res) => {
	const { ID, Url, Price, Name, Manufacturer, Image, Image_Url, Core_Count, Thread_Count, Base_Clock, Cache, Socket, Cpu_Cooler, TDP, Integrated_GPU } = req.body;
	const sql = "INSERT INTO cpu (ID, Url, Price, Name, Manufacturer, Image, Image_Url, Core_Count, Thread_Count, Base_Clock, Cache, Socket, Cpu_Cooler, TDP, Integrated_GPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
	
	if (!req.user.isAdmin) {
		return res.status(403).json({ message: "Unauthorized" });
	}
	
	db.run(sql, [ID, Url, Price, Name, Manufacturer, Image, Image_Url, Core_Count, Thread_Count, Base_Clock, Cache, Socket, Cpu_Cooler, TDP, Integrated_GPU], function (err) {
		if (err) {
			console.error(err);
			res.status(500).send(err);
		} else {
			res.status(200).json({ id: this.lastID });
		}
	});
});


api.get("/api/cpu_coolers", (req, res) => {
	const sql = "SELECT * FROM cpu_cooler";
	db.all(sql, [], (err, rows) => {
		if (err) {
			console.error(err);
			res.status(500).send(err);
		} else {
			res.status(200).json(rows);
		}
	});
});

api.post("/api/cpu_coolers", authenticateJWT, (req, res) => {
	const { ID, Url, Price, Name, Manufacturer, Image, Image_Url, Compatiblilty, Cooling_Potential, Fan_RPM, Noise_Level, Dimensions } = req.body;
	const sql = "INSERT INTO cpu_cooler (ID, Url, Price, Name, Manufacturer, Image, Image_Url, Compatiblilty, Cooling_Potential, Fan_RPM, Noise_Level, Dimensions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
	
	if (!req.user.isAdmin) {
		return res.status(403).json({ message: "Unauthorized" });
	}
	
	db.run(sql, [ID, Url, Price, Name, Manufacturer, Image, Image_Url, Compatiblilty, Cooling_Potential, Fan_RPM, Noise_Level, Dimensions], function (err) {
		if (err) {
			console.error(err);
			res.status(500).send(err);
		} else {
			res.status(200).json({ id: this.lastID });
		}
	});
});


api.get("/api/gpus", (req, res) => {
	const sql = "SELECT * FROM gpu";
	db.all(sql, [], (err, rows) => {
		if (err) {
			console.error(err);
			res.status(500).send(err);
		} else {
			res.status(200).json(rows);
		}
	});
});

api.post("/api/gpus", authenticateJWT, (req, res) => {
	const { ID, Url, Price, Name, Manufacturer, Image, Image_Url, Cores, Core_Clock, Memory, Interface, Dimensions, TDP } = req.body;
	const sql = "INSERT INTO gpu (ID, Url, Price, Name, Manufacturer, Image, Image_Url, Cores, Core_Clock, Memory, Interface, Dimensions, TDP) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
	
	if (!req.user.isAdmin) {
		return res.status(403).json({ message: "Unauthorized" });
	}	
	
	db.run(sql, [ID, Url, Price, Name, Manufacturer, Image, Image_Url, Cores, Core_Clock, Memory, Interface, Dimensions, TDP], function (err) {
		if (err) {
			console.error(err);
			res.status(500).send(err);
		} else {
			res.status(200).json({ id: this.lastID });
		}
	});
});


api.get("/api/memories", (req, res) => {
	const sql = "SELECT * FROM memory";
	db.all(sql, [], (err, rows) => {
		if (err) {
			console.error(err);
			res.status(500).send(err);
		} else {
			res.status(200).json(rows);
		}
	});
});

api.post("/api/memories", authenticateJWT, (req, res) => {
	const { ID, Url, Price, Name, Manufacturer, Image, Image_Url, Type, Amount, Speed, Latency } = req.body;
	const sql = "INSERT INTO memory (ID, Url, Price, Name, Manufacturer, Image, Image_Url, Type, Amount, Speed, Latency) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
	
	if (!req.user.isAdmin) {
		return res.status(403).json({ message: "Unauthorized" });
	}
	
	db.run(sql, [ID, Url, Price, Name, Manufacturer, Image, Image_Url, Type, Amount, Speed, Latency], function (err) {
		if (err) {
			console.error(err);
			res.status(500).send(err);
		} else {
			res.status(200).json({ id: this.lastID });
		}
	});
});


api.get("/api/motherboards", (req, res) => {
	const sql = "SELECT * FROM motherboard";
	db.all(sql, [], (err, rows) => {
		if (err) {
			console.error(err);
			res.status(500).send(err);
		} else {
			res.status(200).json(rows);
		}
	});
});

api.post("/api/motherboards", authenticateJWT, (req, res) => {
	const { ID, Url, Price, Name, Manufacturer, Image, Image_Url, Chipset, Form_Factor, Memory_Compatibility } = req.body;
	const sql = "INSERT INTO motherboard (ID, Url, Price, Name, Manufacturer, Image, Image_Url, Chipset, Form_Factor, Memory_Compatibility) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
	
	if (!req.user.isAdmin) {
		return res.status(403).json({ message: "Unauthorized" });
	}	
	
	db.run(sql, [ID, Url, Price, Name, Manufacturer, Image, Image_Url, Chipset, Form_Factor, Memory_Compatibility], function (err) {
		if (err) {
			console.error(err);
			res.status(500).send(err);
		} else {
			res.status(200).json({ id: this.lastID });
		}
	});
});


api.get("/api/psus", (req, res) => {
	const sql = "SELECT * FROM psu";
	db.all(sql, [], (err, rows) => {
		if (err) {
			console.error(err);
			res.status(500).send(err);
		} else {
			res.status(200).json(rows);
		}
	});
});

api.post("/api/psus", authenticateJWT, (req, res) => {
	const { ID, Url, Price, Name, Manufacturer, Image, Image_Url, Is_ATX12V, Efficiency, Modular, Dimensions } = req.body;
	const sql = "INSERT INTO psu (ID, Url, Price, Name, Manufacturer, Image, Image_Url, Is_ATX12V, Efficiency, Modular, Dimensions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
	
	if (!req.user.isAdmin) {
		return res.status(403).json({ message: "Unauthorized" });
	}
	
	db.run(sql, [ID, Url, Price, Name, Manufacturer, Image, Image_Url, Is_ATX12V, Efficiency, Modular, Dimensions], function (err) {
		if (err) {
			console.error(err);
			res.status(500).send(err);
		} else {
			res.status(200).json({ id: this.lastID });
		}
	});
});


api.get("/api/storages", (req, res) => {
	const sql = "SELECT * FROM storage";
	db.all(sql, [], (err, rows) => {
		if (err) {
			console.error(err);
			res.status(500).send(err);
		} else {
			res.status(200).json(rows);
		}
	});
});

api.post("/api/storages", authenticateJWT, (req, res) => {
	const { ID, Url, Price, Name, Manufacturer, Image, Image_Url, Capacity, Form_Factor, Interface, Cache, Flash, TBW } = req.body;
	const sql = "INSERT INTO storage (ID, Url, Price, Name, Manufacturer, Image, Image_Url, Capacity, Form_Factor, Interface, Cache, Flash, TBW) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
	
	if (!req.user.isAdmin) {
		return res.status(403).json({ message: "Unauthorized" });
	}
	
	db.run(sql, [ID, Url, Price, Name, Manufacturer, Image, Image_Url, Capacity, Form_Factor, Interface, Cache, Flash, TBW], function (err) {
		if (err) {
			console.error(err);
			res.status(500).send(err);
		} else {
			res.status(200).json({ id: this.lastID });
		}
	});
});


api.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});
