exports.getVerifyCode = async (req, res)=>{

	const phone = req.body.mobilephone;

	if(!phone){
		var data={
			error:'请输入手机号!'
		}
		data = JSON.stringify(data);  
		return res.send(200, data);
	}

	const reg = /^1[34578]\d{9}$/;

	if(!reg.test(phone)){
		var data={
			error:'请输入正确格式的手机号!'
		}
		data = JSON.stringify(data);  
		return res.send(200, data);
	}

	const result = sendMsg(phone);

	var data={
		error:'00',
		verifyData: result
	}
	data = JSON.stringify(data);
	return res.send(200,data);
}

// 手机号注册
exports.phoneRegister = async function(req,res){

	const { mobilephone, verifyCode, password, gameid} = req.body;
	if(!mobilephone){
		var data={
				error:'请输入手机号!'
		}
		data = JSON.stringify(data);  
		return res.send(200, data);
	}

	const reg = /^1[34578]\d{9}$/;

	if(!reg.test(mobilephone)){
		var data={
			error:'请输入正确格式的手机号!'
		}
		data = JSON.stringify(data);  
		return res.send(200, data);
	}

	if(!verifyCode){
		var data={
				error:'请输入验证码!'
		}
		data = JSON.stringify(data);  
		return res.send(200, data);
	}

	const valid = await verify(mobilephone, verifyCode);

	if(!valid){
		var data={
				error:'验证码错误!'
		}
		data = JSON.stringify(data);  
		return res.send(200,data);
	}
	
	if(!password){
		var data={
				error:'请输入密码!'
		}
		data = JSON.stringify(data);  
		return res.send(200,data);
	}
	const regPwd =/^[0-9a-zA-Z]+$/;

	if(!regPwd.test(password)){
		var data={
			error:'请输入正确格式的密码!'
		}
		data = JSON.stringify(data);  
		return res.send(200,data);
	}
}