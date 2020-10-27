'use strtic'


const Core = require('@alicloud/pop-core');
const _ = require('lodash');
const rdb = require('../redis/rdb');

// 阿里云控制台 - 短信服务 - 国内消息，如下信息全部从阿里云获取
const SignName = "北京吟游网络科技有限公司";
const TemplateCode = "SMS_195200345";
const accessKeyId = "LTAI4G7xqcXSFjXLRHiuRwL7";
const accessKeySecret = "VwWQLE1WuRA8xcmtmY67qNXq27Xp6f";

const client = new Core({
    accessKeyId,
    accessKeySecret,
    endpoint: 'https://dysmsapi.aliyuncs.com',
    apiVersion: '2017-05-25'
});

// 保存手机号和验证码的对应关系
// var phone_code_list = {};

/**
 * 发送短信验证码主逻辑
 * @param {*} phone 手机号
 */

function sendMsg(phone){
    console.log('111111111111')
	return new Promise((resolve, reject) => {
        const code = "" + _.random(1,9) + _.random(9) + _.random(9) + _.random(9) + _.random(9) + _.random(9);  // 设生成6位短信验证码
        resolve()
        try {
            client.request('SendSms', {
                RegionId: "cn-beijing",
                PhoneNumbers: phone,
                SignName,
                TemplateCode,
                TemplateParam: "{code:" + code + "}"
            }, {
                method: 'POST'
            }).then((result) => {
                console.log('阿里云短信执回:', result)
                if (result.Message && result.Message == "OK" && result.Code && result.Code == "OK") { // 短信发送成功
                    // var phone_code_list = {};
                    // // 保存验证码
                    // if (phone_code_list[phone]) {
                    //     phone_code_list[phone].push(code);
                    // } else {
                    //     phone_code_list[phone] = [code];
                    // }

                    // 把手机号和验证码对应关系存入redis

                    rdb.setCode(phone, code)
                    
                    // 三分钟后删除验证码
                    // setTimeout(() => {
                    //     _.pull(phone_code_list[phone], code);
                    //     if (phone_code_list[phone] && phone_code_list[phone].length == 0) {
                    //         delete phone_code_list[phone];
                    //     }
                    // }, 3 * 60 * 1000)
                    resolve(result)
                } else {
                    reject(result)
                }
            }, (ex) => {
                reject(ex)
            })
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * 检验验证码
 * @param {*} phone 手机号
 * @param {*} code 验证码
 */
function verify(phone, code) {
    return new Promise((resolve, reject)=>{
        rdb.findCode(phone, function(err, result){
            if(err){
                reject(err)
            }
            resolve(result.indexOf(code) > -1)
        })
    })
}
module.exports = {
    sendMsg: sendMsg,
    verify: verify
}
