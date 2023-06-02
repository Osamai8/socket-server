const express = require('express')
const socketIo = require('socket.io')
const http = require('http')
const PORT = process.env.PORT || 3000;
const cors = require("cors");
const app = express();
app.use(cors());
const server = http.createServer(app);

const io = require("socket.io")(server, {
    cors: {
        origin: "null",
        methods: ["GET", "POST"],
        transports: ["websocket", "polling"],
        credentials: true,
    },
    allowEIO3: true,
});//in case server and client run on different urls;

const newNotifications = [
    {
        _id: 1,
        userId: "6411675849505bba49d70973",
        nameL: "shaikha",
        type: "Created",
        isViewed: false,
    },
    {
        _id: 2,
        userId: "6411675849505bba49d70973",
        nameL: "shaikha",
        type: "Requested",
        isViewed: true,
    },
    {
        _id: 3,
        userId: "641042b2bb313b501a061ecc",
        user: "osama",
        type: "Updated",
        isViewed: false,
    },
    {
        _id: 4,
        userId: "6411675849505bba49d70973",
        nameL: "shaikha",
        type: "Created",
        isViewed: false,
    },
    {
        _id: 5,
        userId: "641042b2bb313b501a061ecc",
        user: "osama",
        type: "Created",
        isViewed: false,
    }
]

let connectedUsers = [];

const messages = ["Created", "Updated", "booked"];

io.on('connection', (socket) => {
    console.log(socket, "sddfsdf")
    socket.on("userId", (data) => {
        connectedUsers.push({ userId: data?.id, socketId: socket.id });
        let notificationsToShow = newNotifications?.filter(noti => noti.isViewed === false && (noti?.userId === data?.id));
        if (notificationsToShow) {
            socket.emit("notification", notificationsToShow)
        }
    });

    socket.on("notifyTo", (data) => {
        console.log({ data })
        const nofiyTo = connectedUsers?.find(user => user.userId === data?._id);
        if (nofiyTo) {
            socket.to(nofiyTo.socketId).emit("notification", {
                message: "New Notification"
            });
        }
    });

    socket.on('disconnect', (reason) => {
        console.log(reason)
    });
});

server.listen(PORT, err => {
    if (err) console.log(err)
    console.log('Server running on Port ', PORT)
})