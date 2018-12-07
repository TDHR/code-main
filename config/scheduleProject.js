// 定时任务，每15s生成一个二维码，并保存到数据库中
const p = require('./db');
const rpcMethod = require('../rpc/index');
let  schedule = require('node-schedule');
let addressList = ['1MDfA3XBZM5SMsuyyR23ZmGBQk9HCGmwV4','185Q5poNDgNzQkz3wzcRaSoNerf7naKBzY','1CUKmu8xg5AYetwLWvebkA1sQVoymfTZw7'];
// let addressList = ['187Xpykh4XDqUPBsoiafqpABfV8Fhct51Y'];

let rule = new schedule.RecurrenceRule();
exports.createCode =async function() {

    // var date = new Date(2018, 10, 1, 17, 45, 0);
    rule.minute=[0,5,10,15,20,25,30,35,40,45,50,55];
    rule.second = 0;
    // rule.second = [0,5,10,15,20,25,30,35,40,45,50,55];

    let j = schedule.scheduleJob(rule,function () {
        initData();
    });

};
//整理数据
async function initData() {
    let index = Math.floor((Math.random()*addressList.length));
    let address = addressList[index];
    let now =parseInt(new Date().getTime());
    console.log(address);
    let originMessage = `id:${now}`;
    let singMessage  =await getSignMessage(address,originMessage);//获取签名信息；
    // console .log(singMessage)
    let  data = {address:address,originMessage:originMessage,signMessage:singMessage};
    // if(address === '187Xpykh4XDqUPBsoiafqpABfV8Fhct51Y') {
    //     insertCodeTmp(data)
    // }else {
        insertCode(data)
    // }


}
//将生成的二维码数据中插入数据库中
async function insertCode(data) {
    //s=HweOKK2CcM1vCDtAm6/Mg5hN2YzX+F1zCh3XnBein57xfoiF7UemhSlnzzWDr9w/pBaHrZBo1XzPS05NV/PJ948=&o=id:18419&id=18419&a=1BtvWKc9bdReVcP74WngsmuRiJrkjUiBNc

    return new Promise((resolve,reject) => {
        let sql = `insert into code_message (address,originMessage,signMessage) values('${data.address}','${data.originMessage}','${data.signMessage}')`;
        p.query(sql,function (error,results,fields) {
            if(error) {
                console.log(JSON.stringify(error))
                reject(error);
            }
            else {
                console.log('插入成功');
                resolve({
                    message:'插入成功'
                })
            }
        })
    })
}
//获取签名信息
async function getSignMessage(address,originMessage) {

    let signMessage = await rpcMethod.signmessage(address,originMessage);
    // console.log(signMessage)
    return signMessage;
}

//将生成的二维码数据中插入数据库中
async function insertCodeTmp(data) {
    //s=HweOKK2CcM1vCDtAm6/Mg5hN2YzX+F1zCh3XnBein57xfoiF7UemhSlnzzWDr9w/pBaHrZBo1XzPS05NV/PJ948=&o=id:18419&id=18419&a=1BtvWKc9bdReVcP74WngsmuRiJrkjUiBNc

    return new Promise((resolve,reject) => {
        let sql = `insert into code_tmp (address,originMessage,signMessage,codeId) values('${data.address}','${data.originMessage}','${data.signMessage}',${data.codeId})`;
        p.query(sql,function (error,results,fields) {
            if(error) reject(error);
            else {
                console.log('插入成功');
                resolve({
                    message:'插入成功'
                })
            }
        })
    })
}