var app = require('express')()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var totalUser = 0
var firstStep
var users = {}
    // var roomIds = new Array(100).fill('room').map((it, index) => {
    //     return it + (index + 1)
    // })
var rooms = {}
app.use(require('express').static(__dirname + "/", { index: "index.html" }))

io.on('connection', function(socket) {
    totalUser++
    console.log('1位用户链接了,总共 ' + totalUser + '人', socket.id)

    // 加入房间
    socket.on('joinRoom', function(roomId) {
        if (socket.id in users && users[socket.id] !== roomId) {
            socket.emit('changeRoom', roomId)
            return
        }
        if (!rooms[roomId]) {
            rooms[roomId] = {}
        }
        if (!rooms[roomId].playerA) {
            rooms[roomId].playerA = socket.id
            users[socket.id] = roomId
            socket.join(roomId)
            io.to(roomId).emit('roomFilled', '您进入了 '+roomId+' 房间，邀请你的小伙伴吧');
        } else if (!rooms[roomId].playerB && rooms[roomId].playerA !== socket.id) {
            rooms[roomId].playerB = socket.id
            users[socket.id] = roomId
            socket.join(roomId)
                //socket.broadcast.to(roomId).emit('bEnter', '玩家进入,可以开始了');
            io.to(roomId).emit('bEnter', '双方已就位,可以开始了，任意一方先手。');
        } else if (socket.id === rooms[roomId].playerA || socket.id === rooms[roomId].playerB) {
            socket.emit('roomFilled', `你已经加进房间 ${roomId} 啦。`)
        } else {
            socket.emit('roomFilled', '房间已满，换个房间吧。')
        }

        console.log('rooms', rooms)
        console.log('users', users)
    })

    socket.on('disconnect', function() {

        totalUser--
        if (!(socket.id in users)) {
            return
        }
        if (rooms[users[socket.id]]) {
            var idA = rooms[users[socket.id]].playerA
            var idB = rooms[users[socket.id]].playerB
                // 移除分组
            io.to(users[socket.id]).emit('bEnter', '玩家退出啦');
            if (io.sockets.sockets[idA]) {
                io.sockets.sockets[idA].leave(users[socket.id])
            }
            if (io.sockets.sockets[idB]) {
                io.sockets.sockets[idB].leave(users[socket.id])
            }

        }

        delete rooms[users[socket.id]]
        delete users[socket.id]
        console.log('1位用户断开了,总共 ' + totalUser + '人', socket.id)
        console.log('rooms', rooms)
        console.log('users', users)
    })
    socket.on('isEnter', function() {
        if (!(socket.id in users)) {
            socket.emit('notEnter', '请先进入房间')
            return
        }
        var _roomId = users[socket.id]
        if (!rooms[_roomId].playerB) {
            socket.emit('notEnter', '请等待你的小伙伴加入')
            return
        }
    })

    socket.on('one step', function(me, i, j) {
        var _roomId = users[socket.id]
        if (!rooms[_roomId].firstStep) {
            rooms[_roomId].firstStep = socket.id
            io.to(_roomId).emit('startStep', socket.id, i, j) // 广播
            console.log((me ? '黑棋' : '白棋') + '坐标: ', i, j)

            return
        }
        socket.broadcast.to(_roomId).emit('singleSetp', socket.id, me, i, j) //广播不包含自己
        console.log((me ? '黑棋' : '白棋') + '坐标: ', i, j)
    })
})

http.listen(5000, function() {
    console.log('====围棋服务器启动成功，端口 5000====')
})
