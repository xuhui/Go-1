/**
 * Created by Administrator on 2017/6/15 0015.
 */
$(function() {
    $.ajax('isLogin', {
        success: function(data) {
            console.log(data);
        },
        error: function(error) {
            console.log(error);
        }
    });

    $('.reg').hide();
    $('.to-reg').on('click', function() {
        $('.log').hide();
        $('.reg').show();
    })
    $('.to-log').on('click', function() {
        $('.reg').hide();
        $('.log').show();
    })

    $('.log-submit').on('click', function() {
        var reg = /^[a-zA-Z](\d|\w){3,15}$/;
        var regCn = /^([\u4e00-\u9fa5]|\d|\w){2,16}$/;
        var username = $('#log-username').val();
        var password = $('#log-password').val();

        if (!(reg.test(username))) {
            $('.log-info').text('用户名格式不正确 (请以字母开头，可包含字母、数字、下划线,长度 4-16)。');

        } else if (!(reg.test(password))) {
            $('.log-info').text('密码格式不正确 (请以字母开头，可包含字母、数字、下划线,长度 4-16)。');

        } else {
            $.post('login', {
                username: username,
                password: password,
            }, function(data) {
                console.log(data)
            })
            console.log(username, password);
            $('.log-info').text('');

        }
    });

    $('.reg-submit').on('click', function() {
        var reg = /^[a-zA-Z](\d|\w){3,15}$/;
        var regCn = /^([\u4e00-\u9fa5]|\d|\w){2,16}$/;
        var username = $('#reg-username').val();
        var password = $('#reg-password').val();
        var passwordConfirm = $('#reg-password-confirm').val();
        var nickname = $('#reg-nickname').val();
        var sign = $('#reg-sign').val();

        if (!(reg.test(username))) {
            $('.reg-info').text('用户名格式不正确 (请以字母开头，可包含字母、数字、下划线,长度 4-16)。');

        } else if (!(reg.test(password))) {
            $('.reg-info').text('密码格式不正确 (请以字母开头，可包含字母、数字、下划线,长度 4-16)。');

        } else if (!(password === passwordConfirm)) {
            $('.reg-info').text('两次密码不一致');

        } else if (!(regCn.test(nickname))) {
            $('.reg-info').text('昵称格式不正确 (可包含中文、字母、数字、下划线,长度 2-16)。');

        } else {
            $('#upload-form').submit();
            $.post('register', {
                username: username,
                password: password,
                nickname: nickname,
                sign: sign,
            }, function(data) {
                console.log(data)
            })
            console.log(username, password, passwordConfirm);
            $('.reg-info').text('');

        }
    });

    $('#upload-input').on('change', function() {
        PreviewImage(this, 'avatar', 'avatar');
    });

    function PreviewImage(fileObj, imgPreviewId, divPreviewId) {
        if (!Array.prototype.indexOf) {
            Array.prototype.indexOf = function(searchElement, fromIndex) {
                var k;
                if (this == null) {
                    throw new TypeError('"this" is null or not defined');
                }
                var O = Object(this);
                var len = O.length >>> 0;
                if (len === 0) {
                    return -1;
                }
                var n = +fromIndex || 0;
                if (Math.abs(n) === Infinity) {
                    n = 0;
                }
                if (n >= len) {
                    return -1;
                }
                k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
                while (k < len) {
                    if (k in O && O[k] === searchElement) {
                        return k;
                    }
                    k++;
                }
                return -1;
            };
        }
        var allowExtention = ['jpg', 'png', 'gif', 'bmp']; //.jpg,.bmp,.gif,.png,允许上传文件的后缀名
        var extention = fileObj.value.substring(fileObj.value.lastIndexOf(".") + 1).toLowerCase(); //获取当前上传文件的扩展名
        var browserVersion = window.navigator.userAgent.toUpperCase();
        if (allowExtention.indexOf(extention) > -1) {
            if (fileObj.files) { //兼容chrome、火狐7+、360浏览器5.5+等，应该也兼容ie10，HTML5实现预览
                if (window.FileReader) {
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        document.getElementById(imgPreviewId).setAttribute("src", e.target.result);
                    }
                    reader.readAsDataURL(fileObj.files[0]);
                } else if (browserVersion.indexOf("SAFARI") > -1) {
                    alert("不支持Safari浏览器6.0以下版本的图片预览!");
                } else {
                    alert("不支持您当前使用的浏览器的图片预览!");
                }
            } else if (browserVersion.indexOf("MSIE") > -1) { //ie、360低版本预览
                if (browserVersion.indexOf("MSIE 6") > -1) { //ie6
                    document.getElementById(imgPreviewId).setAttribute("src", fileObj.value);
                } else { //ie[7-9]
                    fileObj.select();
                    fileObj.blur(); //不加上document.selection.createRange().text在ie9会拒绝访问
                    if (browserVersion.indexOf("MSIE 9") > -1) {
                        document.getElementById(divPreviewId).focus(); //参考http://gallop-liu.iteye.com/blog/1344778
                    }
                    var newPreview = document.getElementById(divPreviewId + "New");
                    if (newPreview == null) {
                        newPreview = document.createElement("div");
                        newPreview.setAttribute("id", divPreviewId + "New");
                        newPreview.style.width = document.getElementById(imgPreviewId).width + "px";
                        newPreview.style.height = document.getElementById(imgPreviewId).height + "px";
                        newPreview.style.border = "solid 1px #d2e2e2";
                    }
                    var tempDivPreview = document.getElementById(divPreviewId);
                    tempDivPreview.parentNode.insertBefore(newPreview, tempDivPreview);
                    newPreview.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale')";
                    newPreview.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = document.selection.createRange().text;
                    tempDivPreview.style.display = "none";
                }
            } else if (browserVersion.indexOf("FIREFOX") > -1) { //firefox
                var firefoxVersion = parseFloat(browserVersion.toLowerCase().match(/firefox\/([\d.]+)/)[1]);
                if (firefoxVersion < 7) { //firefox7以下版本
                    document.getElementById(imgPreviewId).setAttribute("src", fileObj.files[0].getAsDataURL());
                } else { //firefox7.0+                    
                    document.getElementById(imgPreviewId).setAttribute("src", window.URL.createObjectURL(fileObj.files[0]));
                }
            } else {
                alert("不支持您当前使用的浏览器的图片预览!");
            }
        } else {
            alert("仅支持" + allowExtention + "为后缀名的文件!");
            fileObj.value = ""; //清空选中文件
            if (browserVersion.indexOf("MSIE") > -1) {
                fileObj.select();
                document.selection.clear();
            }
            fileObj.outerHTML = fileObj.outerHTML;
        }
    }




});
