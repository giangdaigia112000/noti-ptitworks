const { dbnoti } = require("../firebase");
const { ref, push } = require("firebase/database");
const {
    getMultiData,
    getOneData,
    insertOneData,
    updateHistory,
} = require("../database");

function notiNewProject(socket) {
    socket.on("check-member-in-project", async(project) => {
        await updateHistory(project.project.creator, {
            action: `Tạo dự án: "${project.project.titleProject}"`,
            time: new Date(Date.now()),
        });
        project.project.members.forEach(async(member) => {
            const refdb = ref(dbnoti, "notification/" + member.username);
            await push(refdb, {
                type: "project",
                idProject: "",
                titleProject: project.project.titleProject,
                titleTask: "",
                namecreator: project.namecreator,
                image: project.project.avtProject,
                message: `Đã tạo dự án: ${project.project.titleProject}, có bạn là thành viên trong đó .`,
                time: `${project.project.date} ${project.project.time}`,
                seen: false,
            });
            await updateHistory(member.username, {
                action: `Tham gia dự án: "${project.project.titleProject}"`,
                time: new Date(Date.now()),
            });
        });
        socket.broadcast.emit("isMemberInNewProject", {
            namecreator: project.namecreator,
            listmembers: project.project.members,
        });
    });
}

function notiNewTask(socket) {
    socket.on("check-member-in-task", async(data) => {
        await updateHistory(data.creator, {
            action: `Tạo công việc: "${data.titleTask}"`,
            time: new Date(Date.now()),
        });
        const refdb = ref(dbnoti, "notification/" + data.performer);
        await push(refdb, {
            type: "task",
            idProject: data.idProject,
            titleProject: "",
            titleTask: data.titleTask,
            namecreator: data.namecreator,
            image: data.image,
            message: `Đã tạo công việc: ${data.titleTask}, có bạn là thành viên phụ trách .`,
            time: `${data.date} ${data.time}`,
            seen: false,
        });
        await updateHistory(data.performer, {
            action: `Được giao công việc: "${data.titleTask}"`,
            time: new Date(Date.now()),
        });
    });
}

function userLogin(socket) {
    socket.on("Client-user-login", async(data) => {
        socket.username = data.username;
        await updateHistory(socket.username, {
            action: "Đăng nhập",
            time: new Date(Date.now()),
        });
    });
}

module.exports = { notiNewProject, notiNewTask, userLogin };