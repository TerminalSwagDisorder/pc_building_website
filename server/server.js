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
		res.status(401).json({ message: "Could not verify JWT token" });
	}
};

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
                        res.status(200).json({ id: this.lastID });
                    }
                });
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Internal server error while registering new user" });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
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
	const { Name, Email, Password, Profile_image, currentPassword } = req.body; // Updated credentials from request body

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
			updateQuery += "Profile_image = ?, ";
			queryParams.push(Profile_image);
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
// Admin add user
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
                    } else {
                        res.status(200).json({ id: this.lastID });
                    }
                });
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Internal server error while registering new user" });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// Update user credentials
api.patch("/api/users/:id", authenticateJWT, async (req, res) => {
	console.log("server api admin update credentials accessed")
	const { id } = req.params; // User ID from the url
	const { formFields } = req.body; // Updated credentials from request body

	console.log(req.body)

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
		
		for (const key in formFields) {
			if (formFields.hasOwnProperty(key)) {
				if (formFields[key] !== "") {
			if (key === "Password") {
				// Hash the new password before storing it
				hashedPassword = await bcrypt.hash(key, 10);
			}
				updateQuery += `${key} = ?, `;
				queryParams.push(formFields[key]);
				}
			}
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


// Get all of the component data from the db
api.get("/api/:component", (req, res) => {
	let { component } = req.params;
	const sql = `SELECT * FROM ${component}`;
	db.all(sql, [], (err, rows) => {
		if (err) {
			console.error(err);
			res.status(500).send(err);
		} else {
			res.status(200).json(rows);
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
			res.status(500).json({ message: "Internal server error" });
		} else if (!row) {
			res.status(404).json({ message: "User not found" });
		} else {
			// Exclude sensitive information like hashed password before sending the row data
			const { Password, ...rowData } = row;
			res.status(200).json( {rowData: row });
			console.log(row)
		}
  	});
});

// Update user credentials
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
				res.status(500).json({ message: "Internal server error" });
			} else {
				res.status(200).json({ message: "Component updated successfully", id: this.lastID });
			}
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
});


// Provide posting to the db for all components, do not make these dynamic as its a security risk
api.post("/api/chassis", authenticateJWT, (req, res) => {
    const { ID, Url, Price, Name, Manufacturer, Image, Image_Url, Chassis_type, Dimensions, Color, Compatibility } = req.body;
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

    // Check if an item with the same ID or Name already exists
    const checkSql = "SELECT * FROM chassis WHERE Url = ?";
    db.get(checkSql, [Url], (checkErr, row) => {
        if (checkErr) {
            console.error(checkErr);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (row) {
            return res.status(409).json({ message: "Item already exists" });
        }

        const sql = "INSERT INTO chassis (ID, Url, Price, Name, Manufacturer, Image, Image_Url, Chassis_type, Dimensions, Color, Compatibility) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        db.run(sql, [ID, Url, Price, Name, Manufacturer, Image, Image_Url, Chassis_type, Dimensions, Color, Compatibility], function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Failed to insert item" });
            }
            res.status(200).json({ id: this.lastID });
        });
    });
});

api.post("/api/cpu", authenticateJWT, (req, res) => {
    const { ID, Url, Price, Name, Manufacturer, Image, Image_Url, Core_Count, Thread_Count, Base_Clock, Cache, Socket, Cpu_Cooler, TDP, Integrated_GPU } = req.body;
    
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

    // Check if an item with the same ID or Name already exists
    const checkSql = "SELECT * FROM cpu WHERE Url = ?";
    db.get(checkSql, [Url], (checkErr, row) => {
        if (checkErr) {
            console.error(checkErr);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (row) {
            return res.status(409).json({ message: "Item already exists" });
        }

		const sql = "INSERT INTO cpu (ID, Url, Price, Name, Manufacturer, Image, Image_Url, Core_Count, Thread_Count, Base_Clock, Cache, Socket, Cpu_Cooler, TDP, Integrated_GPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
		db.run(sql, [ID, Url, Price, Name, Manufacturer, Image, Image_Url, Core_Count, Thread_Count, Base_Clock, Cache, Socket, Cpu_Cooler, TDP, Integrated_GPU], function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Failed to insert item" });
            }
            res.status(200).json({ id: this.lastID });
        });
    });
});

api.post("/api/cpu_cooler", authenticateJWT, (req, res) => {
	const { ID, Url, Price, Name, Manufacturer, Image, Image_Url, Compatiblilty, Cooling_Potential, Fan_RPM, Noise_Level, Dimensions } = req.body;
    
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

    // Check if an item with the same ID or Name already exists
    const checkSql = "SELECT * FROM cpu_cooler WHERE Url = ?";
    db.get(checkSql, [Url], (checkErr, row) => {
        if (checkErr) {
            console.error(checkErr);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (row) {
            return res.status(409).json({ message: "Item already exists" });
        }

	const sql = "INSERT INTO cpu_cooler (ID, Url, Price, Name, Manufacturer, Image, Image_Url, Compatiblilty, Cooling_Potential, Fan_RPM, Noise_Level, Dimensions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
	db.run(sql, [ID, Url, Price, Name, Manufacturer, Image, Image_Url, Compatiblilty, Cooling_Potential, Fan_RPM, Noise_Level, Dimensions], function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Failed to insert item" });
            }
            res.status(200).json({ id: this.lastID });
        });
    });
});

api.post("/api/gpu", authenticateJWT, (req, res) => {
	const { ID, Url, Price, Name, Manufacturer, Image, Image_Url, Cores, Core_Clock, Memory, Interface, Dimensions, TDP } = req.body;
    
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

    // Check if an item with the same ID or Name already exists
    const checkSql = "SELECT * FROM gpu WHERE Url = ?";
    db.get(checkSql, [Url], (checkErr, row) => {
        if (checkErr) {
            console.error(checkErr);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (row) {
            return res.status(409).json({ message: "Item already exists" });
        }

	const sql = "INSERT INTO gpu (ID, Url, Price, Name, Manufacturer, Image, Image_Url, Cores, Core_Clock, Memory, Interface, Dimensions, TDP) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
	db.run(sql, [ID, Url, Price, Name, Manufacturer, Image, Image_Url, Cores, Core_Clock, Memory, Interface, Dimensions, TDP], function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Failed to insert item" });
            }
            res.status(200).json({ id: this.lastID });
        });
    });
});

api.post("/api/memory", authenticateJWT, (req, res) => {
	const { ID, Url, Price, Name, Manufacturer, Image, Image_Url, Type, Amount, Speed, Latency } = req.body;
    
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

    // Check if an item with the same ID or Name already exists
    const checkSql = "SELECT * FROM memory WHERE Url = ?";
    db.get(checkSql, [Url], (checkErr, row) => {
        if (checkErr) {
            console.error(checkErr);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (row) {
            return res.status(409).json({ message: "Item already exists" });
        }

	const sql = "INSERT INTO memory (ID, Url, Price, Name, Manufacturer, Image, Image_Url, Type, Amount, Speed, Latency) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
	db.run(sql, [ID, Url, Price, Name, Manufacturer, Image, Image_Url, Type, Amount, Speed, Latency], function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Failed to insert item" });
            }
            res.status(200).json({ id: this.lastID });
        });
    });
});

api.post("/api/motherboard", authenticateJWT, (req, res) => {
	const { ID, Url, Price, Name, Manufacturer, Image, Image_Url, Chipset, Form_Factor, Memory_Compatibility } = req.body;
    
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

    // Check if an item with the same ID or Name already exists
    const checkSql = "SELECT * FROM motherboard WHERE Url = ?";
    db.get(checkSql, [Url], (checkErr, row) => {
        if (checkErr) {
            console.error(checkErr);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (row) {
            return res.status(409).json({ message: "Item already exists" });
        }

	const sql = "INSERT INTO motherboard (ID, Url, Price, Name, Manufacturer, Image, Image_Url, Chipset, Form_Factor, Memory_Compatibility) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
	db.run(sql, [ID, Url, Price, Name, Manufacturer, Image, Image_Url, Chipset, Form_Factor, Memory_Compatibility], function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Failed to insert item" });
            }
            res.status(200).json({ id: this.lastID });
        });
    });
});

api.post("/api/psu", authenticateJWT, (req, res) => {
	const { ID, Url, Price, Name, Manufacturer, Image, Image_Url, Is_ATX12V, Efficiency, Modular, Dimensions } = req.body;
    
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

    // Check if an item with the same ID or Name already exists
    const checkSql = "SELECT * FROM psu WHERE Url = ?";
    db.get(checkSql, [Url], (checkErr, row) => {
        if (checkErr) {
            console.error(checkErr);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (row) {
            return res.status(409).json({ message: "Item already exists" });
        }

	const sql = "INSERT INTO psu (ID, Url, Price, Name, Manufacturer, Image, Image_Url, Is_ATX12V, Efficiency, Modular, Dimensions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
	db.run(sql, [ID, Url, Price, Name, Manufacturer, Image, Image_Url, Is_ATX12V, Efficiency, Modular, Dimensions], function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Failed to insert item" });
            }
            res.status(200).json({ id: this.lastID });
        });
    });
});

api.post("/api/storage", authenticateJWT, (req, res) => {
	const { ID, Url, Price, Name, Manufacturer, Image, Image_Url, Capacity, Form_Factor, Interface, Cache, Flash, TBW } = req.body;
    
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

    // Check if an item with the same ID or Name already exists
    const checkSql = "SELECT * FROM storage WHERE Url = ?";
    db.get(checkSql, [Url], (checkErr, row) => {
        if (checkErr) {
            console.error(checkErr);
            return res.status(500).json({ message: "Internal server error" });
        }

        if (row) {
            return res.status(409).json({ message: "Item already exists" });
        }

	const sql = "INSERT INTO storage (ID, Url, Price, Name, Manufacturer, Image, Image_Url, Capacity, Form_Factor, Interface, Cache, Flash, TBW) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
	db.run(sql, [ID, Url, Price, Name, Manufacturer, Image, Image_Url, Capacity, Form_Factor, Interface, Cache, Flash, TBW], function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Failed to insert item" });
            }
            res.status(200).json({ id: this.lastID });
        });
    });
});

api.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});
