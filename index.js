const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const app = express();
const server = http.createServer(app);
const { notiNewProject, notiNewTask, userLogin } = require("./noti");
const {
    getMultiData,
    getOneData,
    insertOneData,
    updateHistory,
} = require("./database");
const {
    getAllUser,
    deleteUser,
    findUser,
    updateUser,
    craeteUser,
    createListUser,
} = require("./dbPtitWorks");
const { async } = require("@firebase/util");
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});

app.use(async function(req, res, next) {
    if (req.path != "/login" && req.method != "OPTIONS") {
        const token = req.headers.authorization;
        if (token) {
            try {
                let username = jwt.verify(token, "giang112000");
                let userCheck = await getOneData("Users", { username: username.name });
                if (userCheck) {
                    next();
                } else return res.sendStatus(401);
            } catch (error) {
                return res.sendStatus(500);
            }
        } else {
            return res.sendStatus(401);
        }
    } else next();
});

app.get("/", async(req, res) => {
    var data = await getMultiData("Users", {});
    res.json(data);
});

app.post("/login", async(req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        const userCheck = await getOneData("Users", { username: username });
        if (userCheck) {
            if (password == userCheck.password) {
                let token = jwt.sign({ name: username }, "giang112000");
                res.status(200).json({
                    id: token,
                    name: userCheck.name,
                    username: userCheck.username,
                });
            } else {
                res.status(400).json({ message: "Sai mật khẩu" });
            }
        } else {
            res.status(400).json({ message: "Sai tài khoản" });
        }
    } catch (error) {
        res.status(500).json(error.message);
    }
});
app.post("/getinfo", async(req, res) => {
    const id = req.body.id;
    if (!id) return;
    try {
        let username = jwt.verify(id, "giang112000");
        let userCheck = await getOneData("Users", { username: username.name });
        if (userCheck) {
            res.status(200).json({
                name: userCheck.name,
                username: userCheck.username,
            });
        } else {
            res.status(400).json({ message: "Sai tài khoản" });
        }
    } catch (error) {
        res.status(500).json(error.message);
    }
});

app.get("/dataUser", async(req, res) => {
    try {
        const listUser = await getAllUser();
        res.status(200).json(listUser);
    } catch (error) {
        res.status(500).json(error.message);
    }
});

app.post("/deleteuser", async(req, res) => {
    const id = req.body.id;
    if (id) {
        try {
            await deleteUser(id);
            res.sendStatus(200);
        } catch (error) {
            res.status(500).json(error.message);
        }
    } else {
        res.sendStatus(401);
    }
});

app.post("/frofileuser", async(req, res) => {
    const id = req.body.id;
    if (id) {
        try {
            const user = await findUser(id);
            const historyUser = await getOneData("History", { user: id });
            if (user) {
                res.status(200).json({ user: user, historyUser: historyUser });
            } else res.sendStatus(403);
        } catch (error) {
            res.status(500).json(error.message);
        }
    } else {
        res.sendStatus(400);
    }
});

app.post("/updateprofile", async(req, res) => {
    const { id, password, name, avt, email, active } = req.body;
    if (id && password && name && avt && email) {
        try {
            await updateUser(id, password, name, avt, email, active);
            res.sendStatus(200);
        } catch (error) {
            res.status(500).json(error.message);
        }
    } else {
        res.sendStatus(400);
    }
});

app.post("/createuser", async(req, res) => {
    const { id, password, name, email } = req.body;
    const avt = "https://avatar.guu.vn/avatar/333071380366631.jpg";
    try {
        const check = await craeteUser(id, password, name, avt, email);
        if (check == "done") {
            res.sendStatus(200);
        } else {
            res.sendStatus(400);
        }
    } catch (error) {
        res.status(500).json(error.message);
    }
});

app.post("/createlistuser", async(req, res) => {
    const listUser = req.body.listUser;
    if (listUser) {
        try {
            const rescheckList = await createListUser(listUser);
            if (rescheckList == "done") {
                res.sendStatus(200);
            } else {
                res.status(401).json(rescheckList);
            }
        } catch (error) {
            res.status(500).json(error.message);
        }
    } else {
        res.sendStatus(400);
    }
});

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

io.on("connection", async(socket) => {
    socket.on("header", (data) => {
        console.log(data);
        socket.emit("check", "okjeeee");
    });
    await userLogin(socket);
    await notiNewProject(socket);
    await notiNewTask(socket);
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
    console.log(`Server on Port ${port}`);
});