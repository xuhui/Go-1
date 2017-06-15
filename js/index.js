/**
 * Created by Administrator on 2017/6/15 0015.
 */
(function () {
    $.ajax('isLogin', {
        success: function (data) {
            console.log(data);
        },
        error: function (error) {
            console.log(error);
        }
    });

    $('.reg').hide();
    $('.to-reg').on('click',function(){
        $('.log').hide();
        $('.reg').show();
    })
    $('.to-log').on('click',function(){
        $('.reg').hide();
        $('.log').show();
    })

    $('.log-submit').on('click',function(){
        var reg=/^[a-zA-Z](\d|\w){3,}$/;
        var username=$('#log-username').val();
        var password=$('#log-password').val();
        if(reg.test(username)&&reg.test(password)){
            console.log(username,password)
        }else if(reg.test(username)){
            $('.log-info').text('密码格式不正确 (请以字母开头，可包含字母、数字、下划线)。')
        }else {
            $('.log-info').text('用户名格式不正确 (请以字母开头，可包含字母、数字、下划线)。')
        }
    })
}())
