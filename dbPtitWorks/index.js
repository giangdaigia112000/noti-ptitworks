const {
    doc,
    setDoc,
    deleteDoc,
    collection,
    getDocs,
    updateDoc,
    getDoc,
} = require("firebase/firestore");
const { Promise } = require("mongodb");
const { db, dbnoti } = require("../firebase");
const { insertOneData, deleteOne } = require("../database");
const { ref, update } = require("firebase/database");

async function getAllUser() {
    const querySnapshot = await getDocs(collection(db, "user"));
    const list = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        email: doc.data().email,
        avt: doc.data().avt,
    }));
    return list;
}

async function deleteUser(id) {
    const deleteUser = await deleteDoc(doc(db, "user", id), {});
    await deleteOne(id);
}

async function findUser(id) {
    var checkuserfailed = true;
    const querySnapshot = await getDocs(collection(db, "user"));
    for (var i = 0; i < querySnapshot.docs.length; i++) {
        if (querySnapshot.docs[i].id == id) {
            const data = {
                id: id,
                password: querySnapshot.docs[i].data().password,
                name: querySnapshot.docs[i].data().name,
                avt: querySnapshot.docs[i].data().avt,
                email: querySnapshot.docs[i].data().email,
                active: querySnapshot.docs[i].data().active,
            };
            checkuserfailed = false;
            return data;
        }
    }
    if (checkuserfailed) {
        return false;
    }
}

async function updateUser(id, password, name, avt, email, active) {
    await updateDoc(doc(db, "user", id), {
        avt: avt,
        email: email,
        name: name,
        password: password,
        active: active,
    });

    const refdb = ref(dbnoti, "active/" + id);
    await update(refdb, {
        isActive: active,
    });
}

async function craeteUser(id, password, name, avt, email) {
    const check = await getDoc(doc(db, "user", id));
    if (check.data(id)) {
        return "exist";
    } else {
        await setDoc(doc(db, "user", id), {
            password: password,
            name: name,
            avt: avt,
            email: email,
            active: true,
        });
        await insertOneData("History", {
            user: `${id}`,
            history: [{ action: "Tài khoản được tạo", time: new Date(Date.now()) }],
        });
        const refdb = ref(dbnoti, "active/" + id);
        await set(refdb, {
            isActive: true,
        });
        return "done";
    }
}

async function createListUser(listUser) {
    const listExist = [];
    for (let i = 0; i < listUser.length; i++) {
        const check = await getDoc(doc(db, "user", listUser[i].id));
        if (check.data(listUser[i].id)) {
            listExist.push(listUser[i]);
        }
    }
    if (listExist.length == 0) {
        for (let i = 0; i < listUser.length; i++) {
            await setDoc(doc(db, "user", listUser[i].id), {
                password: listUser[i].password,
                name: listUser[i].name,
                avt: "https://avatar.guu.vn/avatar/333071380366631.jpg",
                email: listUser[i].email,
                active: true,
            });
            await insertOneData("History", {
                user: `${listUser[i].id}`,
                history: [{ action: "Tài khoản được tạo", time: new Date(Date.now()) }],
            });
            const refdb = ref(dbnoti, "active/" + listUser[i].id);
            await set(refdb, {
                isActive: true,
            });
        }
        return "done";
    } else {
        return listExist;
    }
}

module.exports = {
    getAllUser,
    deleteUser,
    findUser,
    updateUser,
    craeteUser,
    createListUser,
};