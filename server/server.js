// File name: server.js
// Auth: Terminal Swag Disorder
// Desc: File containing code for database connectivity

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const api = express();
const port = 4000;

api.use(express.json());
api.use(cors());

const dbPath = path.resolve(__dirname, 'database/pcbuildwebsite_db.db');
const db = new sqlite3.Database(dbPath);

const userDbPath = path.resolve(__dirname, 'database/user_data.db');
const userDb = new sqlite3.Database(userDbPath)

api.get('/api/users', (req, res) => {
  const sql = 'SELECT * FROM user';
  userDb.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.send(rows);
    }
  });
});

api.post('/api/users', async (req, res) => {
  const { Name, Email, Password } = req.body;
    try {
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(Password, 10);
        
        const sql = 'INSERT INTO user (Name, Email, Password) VALUES (?, ?, ?)';
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
	const { Email, Password } = req.body;
	const sql = "SELECT * FROM user WHERE Email = ?";
	userDb.get(sql, [Email], async (err, user) => {
		if (err) {
			res.status(500).send(err);
			return;
		}
		else if (!user) {
			res.status(401).send("User not found");
			return;
		} else {

		const match = await bcrypt.compare(Password, user.Password);
		if (match) {
			const accessToken = jwt.sign({ id: user.id }, "yourSecretKey", {
				expiresIn: "1h",
			});
			res.send({ accessToken });
		} else {
			res.status(401).send("Password incorrect");
			}
		}
	});
});

// Logout route (Frontend will handle removing the token)
api.post("/api/logout", (req, res) => {
	res.json({ message: "Logged out successfully" });
});

api.get('/api/cases', (req, res) => {
  const sql = 'SELECT * FROM chassis';
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.send(rows);
    }
  });
});

api.post('/api/cases', (req, res) => {
  const { ID, Url, Price, Name, Manufacturer, Image, Image_Url, Chassis_type, Dimensions, Color, Compatibility } = req.body;
  const sql = 'INSERT INTO chassis (ID, Url, Price, Name, Manufacturer, Image, Image_Url, Chassis_type, Dimensions, Color, Compatibility) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.run(sql, [ID, Url, Price, Name, Manufacturer, Image, Image_Url, Chassis_type, Dimensions, Color, Compatibility], function (err) {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.send({ id: this.lastID });
    }
  });
});


api.get('/api/cpus', (req, res) => {
  const sql = 'SELECT * FROM cpu';
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.send(rows);
    }
  });
});

api.post('/api/cpus', (req, res) => {
  const { ID, Url, Price, Name, Manufacturer, Image, Image_Url, Core_Count, Thread_Count, Base_Clock, Cache, Socket, Cpu_Cooler, TDP, Integrated_GPU } = req.body;
  const sql = 'INSERT INTO cpu (ID, Url, Price, Name, Manufacturer, Image, Image_Url, Core_Count, Thread_Count, Base_Clock, Cache, Socket, Cpu_Cooler, TDP, Integrated_GPU) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.run(sql, [ID, Url, Price, Name, Manufacturer, Image, Image_Url, Core_Count, Thread_Count, Base_Clock, Cache, Socket, Cpu_Cooler, TDP, Integrated_GPU], function (err) {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.send({ id: this.lastID });
    }
  });
});


api.get('/api/cpu_coolers', (req, res) => {
  const sql = 'SELECT * FROM cpu_cooler';
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.send(rows);
    }
  });
});

api.post('/api/cpu_coolers', (req, res) => {
  const { ID, Url, Price, Name, Manufacturer, Image, Image_Url, Compatiblilty, Cooling_Potential, Fan_RPM, Noise_Level, Dimensions } = req.body;
  const sql = 'INSERT INTO cpu_cooler (ID, Url, Price, Name, Manufacturer, Image, Image_Url, Compatiblilty, Cooling_Potential, Fan_RPM, Noise_Level, Dimensions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.run(sql, [ID, Url, Price, Name, Manufacturer, Image, Image_Url, Compatiblilty, Cooling_Potential, Fan_RPM, Noise_Level, Dimensions], function (err) {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.send({ id: this.lastID });
    }
  });
});


api.get('/api/gpus', (req, res) => {
  const sql = 'SELECT * FROM gpu';
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.send(rows);
    }
  });
});

api.post('/api/gpus', (req, res) => {
  const { ID, Url, Price, Name, Manufacturer, Image, Image_Url, Cores, Core_Clock, Memory, Interface, Dimensions, TDP } = req.body;
  const sql = 'INSERT INTO gpu (ID, Url, Price, Name, Manufacturer, Image, Image_Url, Cores, Core_Clock, Memory, Interface, Dimensions, TDP) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.run(sql, [ID, Url, Price, Name, Manufacturer, Image, Image_Url, Cores, Core_Clock, Memory, Interface, Dimensions, TDP], function (err) {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.send({ id: this.lastID });
    }
  });
});


api.get('/api/memories', (req, res) => {
  const sql = 'SELECT * FROM memory';
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.send(rows);
    }
  });
});

api.post('/api/memories', (req, res) => {
  const { ID, Url, Price, Name, Manufacturer, Image, Image_Url, Type, Amount, Speed, Latency } = req.body;
  const sql = 'INSERT INTO memory (ID, Url, Price, Name, Manufacturer, Image, Image_Url, Type, Amount, Speed, Latency) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.run(sql, [ID, Url, Price, Name, Manufacturer, Image, Image_Url, Type, Amount, Speed, Latency], function (err) {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.send({ id: this.lastID });
    }
  });
});


api.get('/api/motherboards', (req, res) => {
  const sql = 'SELECT * FROM motherboard';
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.send(rows);
    }
  });
});

api.post('/api/motherboards', (req, res) => {
  const { ID, Url, Price, Name, Manufacturer, Image, Image_Url, Chipset, Form_Factor, Memory_Compatibility } = req.body;
  const sql = 'INSERT INTO motherboard (ID, Url, Price, Name, Manufacturer, Image, Image_Url, Chipset, Form_Factor, Memory_Compatibility) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.run(sql, [ID, Url, Price, Name, Manufacturer, Image, Image_Url, Chipset, Form_Factor, Memory_Compatibility], function (err) {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.send({ id: this.lastID });
    }
  });
});


api.get('/api/psus', (req, res) => {
  const sql = 'SELECT * FROM psu';
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.send(rows);
    }
  });
});

api.post('/api/psus', (req, res) => {
  const { ID, Url, Price, Name, Manufacturer, Image, Image_Url, Is_ATX12V, Efficiency, Modular, Dimensions } = req.body;
  const sql = 'INSERT INTO psu (ID, Url, Price, Name, Manufacturer, Image, Image_Url, Is_ATX12V, Efficiency, Modular, Dimensions) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.run(sql, [ID, Url, Price, Name, Manufacturer, Image, Image_Url, Is_ATX12V, Efficiency, Modular, Dimensions], function (err) {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.send({ id: this.lastID });
    }
  });
});


api.get('/api/storages', (req, res) => {
  const sql = 'SELECT * FROM storage';
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      res.send(rows);
    }
  });
});

api.post('/api/storages', (req, res) => {
  const { ID, Url, Price, Name, Manufacturer, Image, Image_Url, Capacity, Form_Factor, Interface, Cache, Flash, TBW } = req.body;
  const sql = 'INSERT INTO storage (ID, Url, Price, Name, Manufacturer, Image, Image_Url, Capacity, Form_Factor, Interface, Cache, Flash, TBW) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
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
