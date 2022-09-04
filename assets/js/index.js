$(function () {

  getUserInfo()

  const layer = layui.layer


  $('#btnLogout').on('click', function () {

    layer.confirm('确定退出登录?', { icon: 3, title: '提示' },
      function (index) {
        // 清空本地存储的token
        localStorage.removeItem('token')
        // 重新跳转到登录页面
        location.href = './login.html'
        //do something

        layer.close(index);
      });
  })
});



// 获取用户信息
function getUserInfo() {
  $.ajax({
    type: "GET",
    url: "/my/userinfo",
    // headers: {
    //   Authorization: localStorage.getItem("token") || ''
    // },
    success: function (res) {
      // console.log(res);
      if (res.status !== 0) {
        return layui.layer.msg('获取用户信息失败')
      }

      // 调用 renderAvatar 渲染用户的头像
      renderAvatar(res.data)
    },

    // 不论成功或失败，都会调用complete回调函数
    // complete: function (res) {
    //   console.log(res);
    //   // 在conplete回调函数中，可以使用 res.responseJSON() 拿到服务器响应回来的的数据
    //   if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
    //     // 强制清空token
    //     localStorage.removeItem('token')
    //     // 强制跳转到登录页面
    //     location.href = './login.html'
    //   }
    // }

  })
}


// 渲染用户的头像
function renderAvatar(user) {
  // 获取用户的名称
  const name = user.nickname || user.username
  // 设置欢迎的文本
  $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
  // 按需渲染用户的头像
  if (user.user_pic !== null) {
    // 渲染图片头像
    $('.layui-nav-img').attr('src', user.user_pic).show()
    $('.text-avatar').hide()
  } else {
    // 渲染文本头像
    $('.layui-nav-img').hide()
    const first = name[0].toUpperCase()
    $('.text-avatar').html(first).show()
  }
}