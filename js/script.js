var chess = document.getElementById('chess');
var context = chess.getContext('2d');
var step = document.getElementById('step');
var chessBord = [];
var socket = io();
var me = true; // 黑子为TRUE 
var myTurn = false;
var start = false;
var firstStep = true;
var steps = 1;
var group = 0;
var alive = [];
var oneKillObj = {}; // 打劫
var randomStr = ['果然不简单！', '好棋啊！', '秒！', '哎哟不错哦！', '跟AlphaGo一样厉害！', '看得出来是行家！', '这一步一般人可想不出来！', '果然英雄出少年！'];
for (var i = 0; i < 19; i++) {
    chessBord[i] = [];
    for (var j = 0; j < 19; j++) {
        chessBord[i][j] = {}; //初始化落子点
    }
}

context.strokeStyle = '#000';

var logo = new Image();
logo.src = "images/logo.jpg";
logo.onload = function() {
    context.drawImage(logo, 0, 0, 570, 570)
    drawChessBoard();
}

var drawChessBoard = function() {
    for (var i = 0; i < 19; i++) {
        context.moveTo(15 + i * 30, 15);
        context.lineTo(15 + i * 30, 555);
        context.stroke();
        context.moveTo(15, 15 + i * 30);
        context.lineTo(555, 15 + i * 30);
        context.stroke();
    }
}
var oneStep = function(i, j, me) {
    record(me, i, j);
    steps++;
    var random = parseInt(Math.random() * randomStr.length);
    logMsg((me ? '黑' : '白') + '棋下在了( ' + i + ' , ' + j + ' )位置,' + randomStr[random]);
    myTurn = !myTurn;

    context.closePath();
    context.font = "18px Georgia";
    context.textAlign = "center";
    context.textBaseline = 'middle';

    // 当前落子坐标
    var tempX = i;
    var tempY = j;

    // 打劫坐标
    var oneKillX;
    var oneKillY;

    // 分组
    for (var i = 0; i < 19; i++) {
        for (var j = 0; j < 19; j++) {
            if (chessBord[i][j].value && !chessBord[i][j].group && alone(i, j)) {
                group++;
            }
            if (chessBord[i][j].value) {
                findSameGroup(i, j);
            }
        }
    }

    context.clearRect(0, 0, 570, 570);
    context.drawImage(logo, 0, 0, 570, 570)
    drawChessBoard();

    var kill = 0
        // 画子
    for (var i = 0; i < 19; i++) {
        for (var j = 0; j < 19; j++) {
            if (alive[chessBord[i][j].group] === undefined && chessBord[i][j].value) {
                if (i !== tempX || j !== tempY) {
                    kill++
                    oneKillX = i
                    oneKillY = j
                }
                chessBord[i][j] = {}
                console.log('KILL' + kill, i, j, chessBord[i][j])
            } else {
                drawSingle(i, j)
            }
        }
    }

    if (kill > 0) {
        chessBord[tempX][tempY].value = me ? 1 : 2
        chessBord[tempX][tempY].step = steps
        drawSingle(tempX, tempY)
    }
    if (kill === 1) {
        console.log('打劫')
        oneKillObj.oneKillX = oneKillX
        oneKillObj.oneKillY = oneKillY
        oneKillObj.step = steps
    }
    alive = []
}


function drawSingle(i, j) {
    if (chessBord[i][j].value === 1) {
        var gradient = context.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 15, 15 + i * 30 + 2, 15 + j * 30 - 2, 0)
        gradient.addColorStop(0, "#0a0a0a")
        gradient.addColorStop(1, "#636766")
        context.fillStyle = gradient
        context.beginPath()
            // 画圆
        context.arc(15 + i * 30, 15 + j * 30, 14, 0, 2 * Math.PI)
        context.fill()
        context.beginPath()
        context.fillStyle = 'yellow'
        context.fillText(chessBord[i][j].step, 15 + i * 30, 15 + j * 30 - 3);

    } else if (chessBord[i][j].value === 2) {
        var gradient = context.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 15, 15 + i * 30 + 2, 15 + j * 30 - 2, 0)
        gradient.addColorStop(0, "#ccc")
        gradient.addColorStop(1, "#fff")
        context.fillStyle = gradient
        context.beginPath()
            // 画圆
        context.arc(15 + i * 30, 15 + j * 30, 14, 0, 2 * Math.PI)
        context.fill()
        context.beginPath()
        context.fillStyle = 'black'
        context.fillText(chessBord[i][j].step, 15 + i * 30, 15 + j * 30 - 3);

    }

}

function findSameGroup(i, j) { //查找同一片棋子
    var colorValue = chessBord[i][j].value
    if (!colorValue) {
        return
    }
    if (!chessBord[i][j].group) {
        chessBord[i][j].group = group
    }

    var currentGroup = chessBord[i][j].group

    if (isAlive(i, j)) { // 一个子是活的，整片是活的
        alive[currentGroup] = true
    }
    // console.log(i, j, '当前分组', currentGroup, alive[currentGroup])

    if (i - 1 > -1 && chessBord[i - 1][j].value === colorValue && !chessBord[i - 1][j].group) {
        chessBord[i - 1][j].group = currentGroup
        findSameGroup(i - 1, j)
    }
    if (j - 1 > -1 && chessBord[i][j - 1].value === colorValue && !chessBord[i][j - 1].group) {
        chessBord[i][j - 1].group = currentGroup
        findSameGroup(i, j - 1)
    }
    if (i + 1 < 19 && chessBord[i + 1][j].value === colorValue && !chessBord[i + 1][j].group) {
        chessBord[i + 1][j].group = currentGroup
        findSameGroup(i + 1, j)
    }
    if (j + 1 < 19 && chessBord[i][j + 1].value === colorValue && !chessBord[i][j + 1].group) {
        chessBord[i][j + 1].group = currentGroup
        findSameGroup(i, +1)
    }

}

function isAlive(i, j) { // 判断气数
    var life = 0
    if (chessBord[i][j].value !== undefined) {
        if (i - 1 > -1 && chessBord[i - 1][j].value === undefined) {
            life++
        }
        if (j - 1 > -1 && chessBord[i][j - 1].value === undefined) {
            life++
        }
        if (i + 1 < 19 && chessBord[i + 1][j].value === undefined) {
            life++
        }
        if (j + 1 < 19 && chessBord[i][j + 1].value === undefined) {
            life++
        }
    }
    return life
}

function alone(i, j) {
    var colorValue = chessBord[i][j].value
    if (i - 1 > -1 && chessBord[i - 1][j].value === colorValue) {
        return false
    }
    if (j - 1 > -1 && chessBord[i][j - 1].value === colorValue) {
        return false
    }
    if (i + 1 < 19 && chessBord[i + 1][j].value === colorValue) {
        return false
    }
    if (j + 1 < 19 && chessBord[i][j + 1].value === colorValue) {
        return false
    }
    return true
}

chess.onclick = function(e) {
    var x = e.offsetX
    var y = e.offsetY
    var i = Math.floor(x / 30)
    var j = Math.floor(y / 30)

    if (i === oneKillObj.oneKillX && j === oneKillObj.oneKillY && steps === oneKillObj.step) { // 打劫判断
        logMsg('====打劫咯..====')
        oneKillObj = {}
        return
    }
    if (start && firstStep) {
        socket.emit('one step', me, i, j);
    } else {
        socket.emit('isEnter', me, i, j);
    }

    if (chessBord[i][j].value == undefined && myTurn) {
        oneStep(i, j, me)
        firstStep = false
        socket.emit('one step', me, i, j);
    }
}


socket.on('singleSetp', function(socketid, me, i, j) {
    oneStep(i, j, me)
})

socket.on('startStep', function(firstId, i, j) {
    oneStep(i, j, me)
    myTurn = !myTurn
    firstStep = false
    if (!(firstId === socket.id)) {
        myTurn = !myTurn
        me = false
    }
})

socket.on('bEnter', function(msg) {
    start = true;
    logMsg(msg)
})

socket.on('notEnter', function(msg) {
    logMsg(msg)
})



socket.on('roomFilled', function(msg) {
    logMsg(msg)
})

socket.on('changeRoom', function(msg) {
    logMsg('退出当前房间吗？？ <a class="quit" href="javascript:;">我要退出</a>')
    $('.quit').on('click', function() {
        location.reload()
    })
})

// 进入房间
$('#enter-room').on('click', function() {
    if ($('#room-id').val().trim()) {
        socket.emit('joinRoom', $('#room-id').val())
        $('.go-info span').text('您进入的房间为: ' + $('#room-id').val())
    } else {
        logMsg('还没输入房间名哦。。')

    }

})

function record(me, i, j) {
    if (me) {
        chessBord[i][j].value = 1
    } else {
        chessBord[i][j].value = 2
    }
    chessBord[i][j].step = steps
}

function logMsg(msg) {
    var d = new Date()
    var date = '' + padZero(d.getHours()) + ':' + padZero(d.getMinutes()) + ':' + padZero(d.getSeconds())
    $('.list').prepend('<li>' + msg + '。--<span class="info-date">' + date + '</span></li>')
}

function padZero(num) {
    return String(num).length < 2 ? '0' + String(num) : String(num)
}
