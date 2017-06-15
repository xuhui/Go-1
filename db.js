var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'wyl',
    password: '1234',
    port: '3306',
    database: 'go',
});

connection.connect();


var sql = "SELECT * FROM user";
// 查
connection.query(sql, function(err, result) {
    if (err) {
        console.log('[SELECT ERROR] - ', err.message);
        return;
    }

    console.log('--------------------------SELECT----------------------------');
    console.log(result);
    console.log('------------------------------------------------------------\n\n');
});

var addSql = 'INSERT INTO user(id,username,password) VALUES(null,?,?)';
var addSqlParams = ['菜鸟工具', 'https://c.runoob.com'];
// 增
connection.query(addSql, addSqlParams, function(err, result) {
    if (err) {
        console.log('[INSERT ERROR] - ', err.message);
        return;
    }

    console.log('--------------------------INSERT----------------------------');
    console.log('result changed',result);
    console.log('-----------------------------------------------------------------\n\n');
});

// var modSql = 'UPDATE user SET name = ?,url = ? WHERE Id = ?';
// var modSqlParams = ['菜鸟移动站', 'https://m.runoob.com', 6];
// // 改
// connection.query(modSql, modSqlParams, function(err, result) {
//     if (err) {
//         console.log('[UPDATE ERROR] - ', err.message);
//         return;
//     }
//     console.log('--------------------------UPDATE----------------------------');
//     console.log('UPDATE affectedRows', result.affectedRows);
//     console.log('-----------------------------------------------------------------\n\n');
// });
//
//
// var delSql = `DELETE FROM user WHERE name=?`;
// // 删
// connection.query(delSql, '菜鸟工具', function(err, result) {
//     if (err) {
//         console.log('[DELETE ERROR] - ', err.message);
//         return;
//     }
//
//     console.log('--------------------------DELETE----------------------------');
//     console.log('DELETE affectedRows', result.affectedRows);
//     console.log('-----------------------------------------------------------------\n\n');
// });


connection.end();
