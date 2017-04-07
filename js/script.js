var chess = document.getElementById('chess')
var context = chess.getContext('2d')
var step = document.getElementById('step')
var bgm = document.getElementById('bgm')
var me = true
var chessBord = []
var over = false

var wins = []
var myWin = []
var computerWin = []
for (var i = 0; i < 21; i++) {
    chessBord[i] = []
    wins[i] = []
    for (var j = 0; j < 21; j++) {
        chessBord[i][j] = 0//初始化落子点
        wins[i][j] = []//赢法数组
    }
}


var count = 0//赢法

//纵向
//wins[0][0][count]
//wins[0][1][count]
//wins[0][2][count]
//wins[0][3][count]
//wins[0][4][count]
for (var i = 0; i < 21; i++) {
    for (var j = 0; j < 17; j++) {
        for (var k = 0; k < 5; k++) {
            wins[i][j + k][count] = true
        }
        count++
    }
}


//横向
//wins[0][0][count]
//wins[1][0][count]
//wins[2][0][count]
//wins[3][0][count]
//wins[4][0][count]
for (var i = 0; i < 21; i++) {
    for (var j = 0; j < 17; j++) {
        for (var k = 0; k < 5; k++) {
            wins[j + k][i][count] = true
        }
        count++
    }
}

//斜
//wins[0][0][count]
//wins[1][1][count]
//wins[2][2][count]
//wins[3][3][count]
//wins[4][4][count]
for (var i = 0; i < 17; i++) {
    for (var j = 0; j < 17; j++) {
        for (var k = 0; k < 5; k++) {
            wins[i + k][j + k][count] = true
        }
        count++
    }
}

//反斜
//wins[0][20][count]
//wins[1][19][count]
//wins[2][18][count]
//wins[3][17][count]
//wins[4][16][count]
for (var i = 0; i < 17; i++) {
    for (var j = 20; j > 3; j--) {
        for (var k = 0; k < 5; k++) {
            wins[i + k][j - k][count] = true
        }
        count++
    }
}

for (var i = 0; i < count; i++) {
    myWin[i] = 0
    computerWin[i] = 0
}


context.strokeStyle = '#000'

var logo = new Image()
logo.src = "images/logo.jpg"
logo.onload = function() {
    context.drawImage(logo, 0, 0, 630, 630)
    drawChessBoard()
}

var drawChessBoard = function() {
    for (var i = 0; i < 21; i++) {
        context.moveTo(15 + i * 30, 15)
        context.lineTo(15 + i * 30, 615)
        context.stroke()
        context.moveTo(15, 15 + i * 30)
        context.lineTo(615, 15 + i * 30)
        context.stroke()
    }
}
var oneStep = function(i, j, me) {
    context.beginPath()
    context.arc(15 + i * 30, 15 + j * 30, 14, 0, 2 * Math.PI)
    context.closePath()
    var gradient = context.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 15, 15 + i * 30 + 2, 15 + j * 30 - 2, 0)
    if (me) {
        gradient.addColorStop(0, "#0a0a0a")
        gradient.addColorStop(1, "#636766")
    } else {
        gradient.addColorStop(0, "#ccc")
        gradient.addColorStop(1, "#f9f9f9")

    }
    context.fillStyle = gradient
    context.fill()
}
chess.onclick = function(e) {
    step.src = 'audio/black.wav'
    if (over) {
        return
    }
    if (!me) {
        return
    }
    var x = e.offsetX
    var y = e.offsetY
    var i = Math.floor(x / 30)
    var j = Math.floor(y / 30)
    if (chessBord[i][j] == 0) {
        oneStep(i, j, me)
        chessBord[i][j] = 1
        for (var k = 0; k < count; k++) {
            if (wins[i][j][k]) {
                myWin[k]++
                    computerWin[k] = 6
                if (myWin[k] == 5) {
                    bgm.src = 'audio/victory.mp3'
                    bgm.removeAttribute('loop')
                    over = true
                    setTimeout(function(){
                    window.alert('你赢了！')
                },0) 
                }
            }
        }
        if (!over) {
            me = !me
            computerAI()
        }
    }
}
var computerAI = function() {
    var myScore = []
    var computerScore = []
    var max = 0
    var u = 0
    var v = 0
    for (var i = 0; i < 21; i++) {
        myScore[i] = []
        computerScore[i] = []
        for (var j = 0; j < 21; j++) {
            myScore[i][j] = 0
            computerScore[i][j] = 0
        }
    }
    for (var i = 0; i < 21; i++) {
        for (var j = 0; j < 21; j++) {
            if (chessBord[i][j] == 0) {
                for (var k = 0; k < count; k++) {
                    if (wins[i][j][k]) {
                        if (myWin[k] == 1) {
                            myScore[i][j] += 200
                        } else if (myWin[k] == 2) {
                            myScore[i][j] += 400
                        } else if (myWin[k] == 3) {
                            myScore[i][j] += 2000
                        } else if (myWin[k] == 4) {
                            myScore[i][j] += 10000
                        }

                        if (computerWin[k] == 1) {
                            computerScore[i][j] += 320
                        } else if (computerWin[k] == 2) {
                            computerScore[i][j] += 520
                        } else if (computerWin[k] == 3) {
                            computerScore[i][j] += 3100
                        } else if (computerWin[k] == 4) {
                            computerScore[i][j] += 20000
                        }

                    }
                }
                if (myScore[i][j] > max) {
                    max = myScore[i][j]
                    u = i
                    v = j
                } else if (myScore[i][j] == max) {
                    if (computerScore[i][j] > computerScore[u][v]) {
                        u = i
                        v = j
                    }
                }

                if (computerScore[i][j] > max) {
                    max = computerScore[i][j]
                    u = i
                    v = j
                } else if (computerScore[i][j] == max) {
                    if (myScore[i][j] > myScore[u][v]) {
                        u = i
                        v = j
                    }
                }
            }
        }
    }
    oneStep(u, v, false)
    chessBord[u][v] = 2
    for (var k = 0; k < count; k++) {
        if (wins[u][v][k]) {
            computerWin[k]++
                myWin[k] = 6
            if (computerWin[k] == 5) {
                bgm.src = 'audio/over.mp3'
                bgm.removeAttribute('loop')
                setTimeout(function(){
                    window.alert('你输了')
                },0) 
                over = true
            }
        }
    }
    if (!over) {
        me = !me
    }
}
