var chess = document.getElementById('chess');
var context = chess.getContext('2d');
var step = document.getElementById('step');
var chessBord = [];
var socket = io();
var me = true; // 黑子为TRUE 
var myTurn = false;
var start = false;
var firstStep = true;
var steps = 0;
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
    context.font = "17px Georgia";
    context.textAlign = "center";
    context.textBaseline = 'middle';
    context.fillStyle = '#000';
    var padding = 15;

    for (var i = 0; i < 19; i++) {
        context.moveTo(padding + i * 30, padding);
        context.lineTo(padding + i * 30, 555);
        context.fillText(i, padding + i * 30, 7)
        context.stroke();
        context.moveTo(padding, padding + i * 30);
        context.lineTo(555, padding + i * 30);
        context.fillText(i, 7, padding + i * 30)
        context.stroke();
    }
    for (var i = 3; i < 19; i += 6) {
        for (var j = 3; j < 19; j += 6) {
            context.fillStyle = '#111'
            context.beginPath()
            context.arc(padding + i * 30, padding + j * 30, 5, 0, 2 * Math.PI)
            context.fill()
        }
    }
}
var oneStep = function(i, j, me) {
    steps++;
    record(me, i, j);
    // console.log('step', steps)
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
    var tempValue = chessBord[i][j].value

    // 打劫坐标
    var oneKillX;
    var oneKillY;

    // 分组
    for (var i = 0; i < 19; i++) {
        for (var j = 0; j < 19; j++) {
            if (chessBord[i][j].value && !chessBord[i][j].group && alone(i, j)) {
                console.log('alone', i, j)
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
    var killSelf = []
        // 画子
    for (var i = 0; i < 19; i++) {
        for (var j = 0; j < 19; j++) {
            if (alive[chessBord[i][j].group] === undefined && chessBord[i][j].value) {
                if (tempValue !== chessBord[i][j].value) { // 提对方
                    kill++
                    oneKillX = i
                    oneKillY = j
                    chessBord[i][j] = {}
                } else { // 提自己
                    killSelf.push([i, j])
                }
                console.log('===KILLED ' + kill + '===', i, j, chessBord[i][j])
            } else {
                drawSingle(i, j)
            }
        }
    }

    if (kill === 1 && !chessBord[tempX][tempY].value) {
        console.log('打劫')
        oneKillObj.oneKillX = oneKillX
        oneKillObj.oneKillY = oneKillY
        oneKillObj.step = steps
    }

    if (kill === 0 && false) {
        for (var a = 0; a < killSelf.length; a++) { //提自己
            var x = killSelf[a][0]
            var y = killSelf[a][1]
            chessBord[x][y] = {}
        }
    }
    console.log(alive)
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

function findSameGroup(i, j, currentGroup) { //查找同一片棋子
    var colorValue = chessBord[i][j].value

    if (!colorValue) {
        return
    }

    if (!chessBord[i][j].group && alone(i, j)) {
        currentGroup = chessBord[i][j].group = group
        console.log('ALONE=======', i, j, chessBord[i][j].group, currentGroup)
    } else if (chessBord[i][j].group) {
        currentGroup = chessBord[i][j].group
    }


    if (i - 1 > -1 && chessBord[i - 1][j].value === colorValue && chessBord[i - 1][j].group !== currentGroup) {
        if (currentGroup === undefined) {
            console.log('进来了1')
            currentGroup = chessBord[i - 1][j].group
        } else {
            chessBord[i - 1][j].group = currentGroup
        }
        findSameGroup(i - 1, j, currentGroup)
    }
    if (j - 1 > -1 && chessBord[i][j - 1].value === colorValue && chessBord[i][j - 1].group !== currentGroup) {
        if (currentGroup === undefined) {
            console.log('进来了2')
            currentGroup = chessBord[i][j - 1].group
        } else {
            chessBord[i][j - 1].group = currentGroup
        }
        findSameGroup(i, j - 1, currentGroup)
    }
    if (i + 1 < 19 && chessBord[i + 1][j].value === colorValue && chessBord[i + 1][j].group !== currentGroup) {
        if (currentGroup === undefined) {
            console.log('进来了3')

            currentGroup = chessBord[i + 1][j].group
        } else {
            chessBord[i + 1][j].group = currentGroup
        }
        findSameGroup(i + 1, j, currentGroup)
    }
    if (j + 1 < 19 && chessBord[i][j + 1].value === colorValue && chessBord[i][j + 1].group !== currentGroup) {
        if (currentGroup === undefined) {
            console.log('进来了4')

            currentGroup = chessBord[i][j + 1].group
        } else {
            chessBord[i][j + 1].group = currentGroup
        }
        findSameGroup(i, j + 1, currentGroup)
    }

    // console.log(i, j, '当前分组', currentGroup, alive[currentGroup])
    if (isAlive(i, j)) { // 一个子是活的，整片是活的
        console.log(i, j, 'CURRENT GROUP 为', currentGroup)
        alive[currentGroup] = true
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

socket.on('message', function(msg) {
    logMsg(msg)
})

socket.on('oneOut', function(msg) {
    logMsg(msg)
    popMsg(msg, '我也退出', '再看看', function() {
        location.reload()
    }, function() {
        document.querySelector('.pop-msg-wrapper').style = 'display:none'
    })
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

$('#quit-room').on('click', function() {
    location.reload()
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

function popMsg(title, confirm, cancel, callback1, callback2) {
    var container = document.createElement('div')
    container.innerHTML =
        '    <div class="pop-msg-wrapper">' +
        '        <div class="pop-msg-main">' +
        '            <p class="pop-msg-title">' + (title ? title : '确定？') + '</p>' +
        '            <button class="pop-msg-confirm">' + (confirm ? confirm : '确定') + '</button>' +
        '            <button class="pop-msg-cancel">' + (cancel ? cancel : '取消') + '</button>' +
        '        </div>' +
        '    </div>';
    document.body.appendChild(container)
    document.querySelector('.pop-msg-wrapper').style = '    position: fixed;top: 0;left: 0;width: 100%;height: 100%;background: rgba(0,0,0,0.5);font-size: 2rem;z-index: 9999;'
    document.querySelector('.pop-msg-main').style = '    width: 60%;height: 36%; position: absolute;top: 50%;left: 50%; -webkit-transform: translate(-50%,-50%);-ms-transform: translate(-50%,-50%);transform: translate(-50%,-50%);text-align: center;background: #fff;'
    document.querySelector('.pop-msg-title').style = '   height: 40%;text-align: center;padding-top:50px;font-size:2.5rem;'
    var buttons = document.querySelectorAll('.pop-msg-main button')
    buttons[0].style = buttons[1].style = '    display: inline-block;width: 20%;height: 10%;margin: 30px;background: #428bca;border:none;color:#fff '
    buttons[0].onclick = callback1
    buttons[1].onclick = callback2
}

function padZero(num) {
    return String(num).length < 2 ? '0' + String(num) : String(num)
}
