const rpcMethod = require('../../rpc/index');
const p = require('../../config/db');
const querystring = require('querystring');
const addressMessage = require('../../config/message.json');
//获取url参数
const getUrlParam = (url) => {
    //req.url
    var params = url.split('?')[1];
    var paramsJson = querystring.parse(params);

    return paramsJson;
};
exports.index = async (ctx)=> {
    let params = getUrlParam(ctx.url);
    // console.log(params);
    let address = params.address;
    let amount = params.amount;
    let productAddress = params.productAddress;

    let reward = await queryProductMessage(productAddress);//查询此地址应当打多少个币
    // let assetId = addressMessage[productAddress].assetID;
    let assetId = reward.result;
    console.log('交易ID'+assetId);
    if(amount){
        // assetId = `100006:${amount}`;
        console.log('amount'+amount);
        assetId = `100006:${amount}`;
    }
    if(!assetId || productAddress === '16nTo9eyf3gGSVTbyobYkaWBZzGEKpa3XU'){
        assetId = "100001:1"
    }
    // console.log(address);
    // let priAddress = await rpcMethod.getAddr();
    // console.log('address:'+priAddress)
    // let txID = await rpcMethod.sendToAddress(address);
    // console.log('toAddress' + address);
    let myAddress = await rpcMethod.getAddr();//获取项目地址
    //还应该再去验证传过来的产品地址是否属于当前项目地址，测试阶段省去这一步
    let txData = await rpcMethod.sendToAddress(address,assetId);
    console.log('交易信息'+JSON.stringify(txData));
    ctx.body = {
        success:true,
        txData:txData,
        toAddress:address,
        fromAddress:myAddress
    }
};
//通过地址查询应当打多少个币出去
const queryProductMessage = function (productAddress) {
    return new Promise((resolve,reject) => {
        let queryProductMessageSql = `SELECT assetId,reward FROM  code_product  WHERE proAddress=?`;
        p.query(queryProductMessageSql,[productAddress],function (error, result, fields) {
            if(error){
                let queryMessage = {
                    status:false,
                    message:'查询失败'
                }
                reject(queryMessage);
            }else {
                let queryMessage = {
                    status:true,
                    message:'查询成功',
                    result:`${result[0].assetId}:${result[0].reward}`
                }
                resolve(queryMessage)
            }

        })
    });

};
//返回签名信息接口
exports.signMessage = async function (ctx) {
    let originMessage = ctx.request.body.originMessage;//信息
    let originSignMessage = `id:${originMessage}`;//需要签名的信息
    let address = ctx.request.body.address;//签名地址
    let message = await rpcMethod.signmessage(address,originSignMessage);
    let url = 'https://reitschain.com/co';
    let codeMessage = `s=${message}&o=${originSignMessage}&id=${originMessage}&a=${address}`;
    let responseMessage = `${url}?${codeMessage}`;
    ctx.body = {
        success:true,
        codeMessage:responseMessage
    }
};
//给产生的新地址打一个qro
exports.sendQro = async function (ctx) {
    let address = ctx.request.body.address;
    let txData = await rpcMethod.sendToAddress(address,'100006:1');
    let myAddress = await rpcMethod.getAddr();//获取项目地址

    ctx.body = {
        success:true,
        txData:txData,
        toAddress:address,
        fromAddress:myAddress
    }
}