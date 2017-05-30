var chess = document.getElementById('chess')
var context = chess.getContext('2d')
var step = document.getElementById('step')
var chessBord = [];
var socket = io();
var me = true;
var myTurn = false;
var start = false;
var firstStep = true
var computerWin = []
var steps=0
for (var i = 0; i < 19; i++) {
    chessBord[i] = []
    for (var j = 0; j < 19; j++) {
        chessBord[i][j] = null //初始化落子点
    }
}

context.strokeStyle = '#000'

var logo = new Image()
logo.src = "images/logo.jpg"
logo.onload = function() {
    context.drawImage(logo, 0, 0, 630, 630)
    drawChessBoard()
}

var drawChessBoard = function() {
    for (var i = 0; i < 19; i++) {
        context.moveTo(15 + i * 30, 15)
        context.lineTo(15 + i * 30, 555)
        context.stroke()
        context.moveTo(15, 15 + i * 30)
        context.lineTo(555, 15 + i * 30)
        context.stroke()
    }
}
var randomStr = ['果然不简单！', '好棋啊！', '秒！', '哎哟不错哦！', '跟AlphaGo一样厉害！', '看得出来是行家！', '这一步一般人可想不出来！', '果然英雄出少年！']
var oneStep = function(i, j, me) {
    record(me, i, j)
    steps++

    var random = parseInt(Math.random() * randomStr.length)
    logMsg((me ? '黑' : '白') + '棋下在了( ' + i + ' , ' + j + ' )位置,' + randomStr[random])
    myTurn = !myTurn
    context.beginPath()
    // 画圆
    context.arc(15 + i * 30, 15 + j * 30, 14, 0, 2 * Math.PI)
    context.closePath()
    context.font="18px Georgia";
    context.textAlign="center"; 
    context.textBaseline='middle';

    if(chessBord[i][j]===0){
        var gradient = context.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 15, 15 + i * 30 + 2, 15 + j * 30 - 2, 0)
        gradient.addColorStop(0, "#0a0a0a")
        gradient.addColorStop(1, "#636766")
        context.fillStyle=gradient
        context.fill()
        context.beginPath()
        context.fillStyle='yellow'
        context.fillText(steps,15 + i * 30 , 15 + j * 30-3);



    }else if(chessBord[i][j]===1){
        var gradient = context.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 15, 15 + i * 30 + 2, 15 + j * 30 - 2, 0)
        gradient.addColorStop(0, "#eee")
        gradient.addColorStop(1, "#fff")
        context.fillStyle=gradient
        context.fill()
        context.beginPath()
        context.fillStyle='black'
        context.fillText(steps,15 + i * 30 , 15 + j * 30-3);

    }
    for(var i=0;i<19;i++){
        for (var j=0;j<19;j++){
            var life=0
            if(chessBord[i][j]!==null ){
                if(i-1>-1 && chessBord[i-1][j]===null){
                    life++
                }
                if(j-1>-1 && chessBord[i][j-1]===null ){
                    life++
                }                
                if(i+1<19 && chessBord[i+1][j]===null ){
                    life++
                }                
                if(j+1<19 && chessBord[i][j+1]===null ){
                    life++
                }
            }                
        }
    }

    // context.fillStyle = gradient
    // context.fill()

}

chess.onclick = function(e) {

    var x = e.offsetX
    var y = e.offsetY
    var i = Math.floor(x / 30)
    var j = Math.floor(y / 30)
    if (start && firstStep) {
        socket.emit('one step', me, i, j);
    } else {
        socket.emit('isEnter', me, i, j);
    }

    if (chessBord[i][j] == null && myTurn) {
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

var temp
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
        temp=$('#room-id').val()
        $('.go-info span').text('您进入的房间为: ' + $('#room-id').val())
    } else {
        logMsg('还没输入房间名哦。。')

    }

})

function record(me, i, j) {
    if (me) {
        chessBord[i][j] = 0
    } else {
        chessBord[i][j] = 1
    }
}

function logMsg(msg) {
    var d = new Date()
    var date = '' + padZero(d.getHours()) + ':' + padZero(d.getMinutes()) + ':' + padZero(d.getSeconds())
    $('.list').prepend('<li>' + msg + '。--<span class="info-date">' + date + '</span></li>')
}

function padZero(num) {
    return String(num).length < 2 ? '0' + String(num) : String(num)
}
