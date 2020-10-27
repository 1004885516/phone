const redis = require('redis');
const { toNumber } = require('lodash');


const client = redis.createClient( 6379, '127.0.0.1');

client.on("error", function(error){
    console.log("Error " + error);
    console.log("redis error");
});

client.on("ready", function(err){
    if(err){
        console.log("Error " + error);
    }else{
        console.log("redis ready");
    }
})

client.on("connect", function(err){
    if(err){
        console.log("Error " + error);
    }else{
        console.log("redis connect");
    }
})

client.on("reconnecting", function(err){
    if(err){
        console.log("Error " + err);
    }else{
        console.log("redis reconnecting");
    }
})

client.on("end", function(err){
    if(err){
        console.log("Error " + error);
    }else{
        console.log("redis end");
    }
})

client.on("warning", function(err){
    if(err){
        console.log("Error " + error);
    }else{
        console.log("redis warning");
    }
})

function setCode(phone, code){
    client.sadd(phone, code, redis.print);
    client.expire(phone, 180)
}

function findCode(phone, cb){
    client.smembers(phone, function(err, result){
        if(err){
            console.log('err', err)
            cb(err, null)
        }
        cb(null, result)
    })
};

function setLoginid(loginid){
    client.set('loginid', loginid)
}

function getLoginid(cb){
    client.get('loginid', function(err, loginid){
        if(err){
            console.log('err', err)
            cb(err, null)
        }
        cb(null, loginid)
    })
}

function setFastLoginid(fastLoginid){
    client.set('fastLoginid', fastLoginid)
}


function getFastLoginid(cb){
    client.get('fastLoginid', function(err, fastLoginid){
        if(err){
            console.log('err', err)
            cb(err, null)
        }
        cb(null, fastLoginid)
    })
}


module.exports = {
    setCode: setCode,
    findCode: findCode,
    setLoginid: setLoginid,
    getLoginid: getLoginid,
    setFastLoginid: setFastLoginid,
    getFastLoginid: getFastLoginid
}