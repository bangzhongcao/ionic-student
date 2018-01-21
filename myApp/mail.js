var nodemailer = require('nodemailer');
// var smtpTransport = require('nodemailer-smtp-transport');

var transporter = nodemailer.createTransport({
    service: 'qq',
    port: 465, // SMTP 端口
    secureConnection: true, // 使用 SSL
    auth: {
        user: '462156634@qq.com',
        //这里密码不是qq密码，是你设置的smtp密码
        pass: 'wopctlvmgispbhbb'
    }
});


var sendMail = function(mailOptions){
	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        return false;
	    }
	    return true;
	    // console.log('Message sent: ' + info.response);
	    transport.close(); 
	});
}

module.exports = sendMail;