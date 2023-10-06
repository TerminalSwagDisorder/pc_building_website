// File name: server.js
// Auth: Terminal Swag Disorder
// Desc: File containing code for database connectivity

const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const fs = require("fs");
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;
if(!jwtSecret) {
    console.error("Missing JWT_SECRET environment variable. Exiting...");
    process.exit(1);
}

const api = express();
const port = 4000;

api.use(express.json());

const corsOptions = {
	origin: 'http://localhost:3000',  // replace with your application's origin
	credentials: true  // allows the Access-Control-Allow-Credentials: true header
};

api.use(cors(corsOptions));

const dbPath = path.resolve(__dirname, "database/pcbuildwebsite_db.db");
const db = new sqlite3.Database(dbPath);

const userDbPath = path.resolve(__dirname, "database/user_data.db");
const userDb = new sqlite3.Database(userDbPath)

api.get("/api/users", (req, res) => {
  const sql = "SELECT * FROM user";
  userDb.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.send(rows);
    }
  });
});

api.post("/api/users", async (req, res) => {
  const { Name, Email, Password } = req.body;
    try {
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(Password, 10);
        
        const sql = "INSERT INTO user (Name, Email, Password) VALUES (?, ?, ?)";
        userDb.run(sql, [Name, Email, hashedPassword], function (err) {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.send({ id: this.lastID });
    }
  });
    } catch (error) {
        handleApiError(res, error);
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
		else if (!user) {
			res.status(401).json({ message: "User not found" });
			return;
		} else {

		const match = await bcrypt.compare(Password, user.Password);
		if (match) {
			const accessToken = jwt.sign({ id: user.id }, jwtSecret, {
				expiresIn: "1h",
			});
			res.cookie("accessToken", accessToken, {
			  httpOnly: true,
			  sameSite: "lax",
			  maxAge: 3600000
			});
			res.status(200).json({ message: "Logged in successfully", userData: user});
		} else {
			res.status(401).json({ message: "Password incorrect" });
			}
		}
	});
});

// Middleware for checking if user is logged in
const authenticateJWT = (req, res, next) => {
	const token = req.cookies ? req.cookies.accessToken : null;
	if (token) {
	console.log(token)
		jwt.verify(token, jwtSecret, (err, user) => {
			if (err) {
				return res.status(403).json({ message: "JWT error" });
			}
			req.user = user;
			next();
		});
	} else {
		res.status(401).json({ message: "JWT error" });
	}
};

// Check if the user is logged in
api.get("/api/profile", authenticateJWT, (req, res) => {
	console.log("server api profile accessed")
	// If we're here, the JWT was valid and `req.user` contains the payload from the JWT
	const userData = { userData: user };
	res.json({
		message: "Authenticated",
		user: userData,
	});
});



// Logout route (Frontend will handle removing the token)
api.post("/api/logout", (req, res) => {
	console.log("server api logout accessed")
	res.clearCookie("accessToken");
	res.json({ message: "Logged out successfully" });
});

api.get("/api/cases", (req, res) => {
  const sql = "SELECT * FROM chassis";
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.send(rows);
    }
  });
});

api.post("/api/cases", (req, res) => {
  const { ID, Url, Price, Name, Manufacturer, Image, Image_Url, Chassis_type, Dimensions, Color, Compatibility } = req.body;
  const sql = "INSERT INTO chassis (ID, Url, Price, Name, Manufacturer, Image, Image_Url, Chassis_type, Dimensions, Color, Compatibility) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  db.run(sql, [ID, Url, Price, Name, Manufacturer, Image, Image_Url, Chassis_type, Dimensions, Color, Compatibility], function (err) {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.send({ id: this.lastID });
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
      res.send(rows);
    }
  });
});

api.post("/api/cpus", (req, res) => {
  const { ID, Url, Price, Name, Manufacturer, Image, Image_Url, Core_Count, Thread_Count, Base_Clock, Cache, Socket, Cpu_Cooler, TDP, Integrated_GPU } = req.body;
  const sql = "INSERT INTO cpu (ID, Url, Price, Name, Manufacturer, Image, Image_Url, Core_Count, Thread_Count, Base_Clock, Cache, Socket, Cpu_Cooler, TDP, Integrated_GPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  db.run(sql, [ID, Url, Price, Name, Manufacturer, Image, Image_Url, Core_Count, Thread_Count, Base_Clock, Cache, Socket, Cpu_Cooler, TDP, Integrated_GPU], function (err) {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.send({ id: this.lastID });
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
      res.send(rows);
    }
  });
});

api.post("/api/cpu_coolers", (req, res) => {
  const { ID, Url, Price, Name, Manufacturer, Image, Image_Url, Compatiblilty, Cooling_Potential, Fan_RPM, Noise_Level, Dimensions } = req.body;
  const sql = "INSERT INTO cpu_cooler (ID, Url, Price, Name, Manufacturer, Image, Image_Url, Compatiblilty, Cooling_Potential, Fan_RPM, Noise_Level, Dimensions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  db.run(sql, [ID, Url, Price, Name, Manufacturer, Image, Image_Url, Compatiblilty, Cooling_Potential, Fan_RPM, Noise_Level, Dimensions], function (err) {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.send({ id: this.lastID });
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
      res.send(rows);
    }
  });
});

api.post("/api/gpus", (req, res) => {
  const { ID, Url, Price, Name, Manufacturer, Image, Image_Url, Cores, Core_Clock, Memory, Interface, Dimensions, TDP } = req.body;
  const sql = "INSERT INTO gpu (ID, Url, Price, Name, Manufacturer, Image, Image_Url, Cores, Core_Clock, Memory, Interface, Dimensions, TDP) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  db.run(sql, [ID, Url, Price, Name, Manufacturer, Image, Image_Url, Cores, Core_Clock, Memory, Interface, Dimensions, TDP], function (err) {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.send({ id: this.lastID });
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
      res.send(rows);
    }
  });
});

api.post("/api/memories", (req, res) => {
  const { ID, Url, Price, Name, Manufacturer, Image, Image_Url, Type, Amount, Speed, Latency } = req.body;
  const sql = "INSERT INTO memory (ID, Url, Price, Name, Manufacturer, Image, Image_Url, Type, Amount, Speed, Latency) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  db.run(sql, [ID, Url, Price, Name, Manufacturer, Image, Image_Url, Type, Amount, Speed, Latency], function (err) {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.send({ id: this.lastID });
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
      res.send(rows);
    }
  });
});

api.post("/api/motherboards", (req, res) => {
  const { ID, Url, Price, Name, Manufacturer, Image, Image_Url, Chipset, Form_Factor, Memory_Compatibility } = req.body;
  const sql = "INSERT INTO motherboard (ID, Url, Price, Name, Manufacturer, Image, Image_Url, Chipset, Form_Factor, Memory_Compatibility) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  db.run(sql, [ID, Url, Price, Name, Manufacturer, Image, Image_Url, Chipset, Form_Factor, Memory_Compatibility], function (err) {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.send({ id: this.lastID });
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
      res.send(rows);
    }
  });
});

api.post("/api/psus", (req, res) => {
  const { ID, Url, Price, Name, Manufacturer, Image, Image_Url, Is_ATX12V, Efficiency, Modular, Dimensions } = req.body;
  const sql = "INSERT INTO psu (ID, Url, Price, Name, Manufacturer, Image, Image_Url, Is_ATX12V, Efficiency, Modular, Dimensions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  db.run(sql, [ID, Url, Price, Name, Manufacturer, Image, Image_Url, Is_ATX12V, Efficiency, Modular, Dimensions], function (err) {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.send({ id: this.lastID });
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
      res.send(rows);
    }
  });
});

api.post("/api/storages", (req, res) => {
  const { ID, Url, Price, Name, Manufacturer, Image, Image_Url, Capacity, Form_Factor, Interface, Cache, Flash, TBW } = req.body;
  const sql = "INSERT INTO storage (ID, Url, Price, Name, Manufacturer, Image, Image_Url, Capacity, Form_Factor, Interface, Cache, Flash, TBW) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  db.run(sql, [ID, Url, Price, Name, Manufacturer, Image, Image_Url, Capacity, Form_Factor, Interface, Cache, Flash, TBW], function (err) {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.send({ id: this.lastID });
    }
  });
});


api.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
