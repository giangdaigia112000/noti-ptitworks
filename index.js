const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const dbnoti = require("./firebase");
const {
    ref,
    set,
    push,
    onValue,
    remove,
    update,
} = require("firebase/database");
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("okee");
});

function notiNewProject(socket) {
    socket.on("check-member-in-project", (project) => {
        console.log(project.project.members.length);
        project.project.members.forEach((member) => {
            const refdb = ref(dbnoti, "notification/" + member.username);
            push(refdb, {
                namecreator: project.namecreator,
                image: project.project.avtProject,
                message: `Đã tạo dự án: ${project.project.titleProject}, có bạn là thành viên trong đó .`,
                time: `${project.project.date} ${project.project.time}`,
                seen: false,
            });
        });
        socket.broadcast.emit("isMemberInNewProject", {
            namecreator: project.namecreator,
            listmembers: project.project.members,
        });
    });
}

io.on("connection", (socket) => {
    console.log("có người connect");
    socket.on("Client-sent-username", (data) => {
        socket.username = data.username;
        console.log(socket.username);
    });
    notiNewProject(socket);
});

server.listen(port, () => {
    console.log("okee");
});