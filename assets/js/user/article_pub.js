$(function () {

  const layer = layui.layer
  const form = layui.form


  initCate()
  // 初始化富文本编辑器
  initEditor()



  function initCate() {
    $.ajax({
      method: 'get',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('初始化文章分类失败')
        }
        // 调用模板引擎 ，渲染分类的下拉菜单
        const htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        // 一定要调用render()方法，否则渲染不出来
        form.render()
      }
    })
  }


  // 1. 初始化图片裁剪器
  var $image = $('#image')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }

  // 3. 初始化裁剪区域
  $image.cropper(options)

  // 为选择封面的按钮，绑定点击事件处理函数
  $('#btnImgChange').on('click', function () {
    $('#coverFile').click()
  })

  // 监听overFile 的change 事件，获取用户选择的文件列表
  $('#coverFile').on('change', function (e) {
    // 获取到文件的列表数组
    const files = e.target.files
    // 判断用户是否选择了文件
    if (files.length === 0) {
      return
    }

    // g根据文件，创建对应的 URL 地址
    const newImgURL = URL.createObjectURL(files[0])
    // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域
    $image
      .cropper('destroy')      // 销毁旧的裁剪区域
      .attr('src', newImgURL)  // 重新设置图片路径
      .cropper(options)        // 重新初始化裁剪区域
  })

  // 定义文章的发布状态
  let art_state = '发布'

  // 为存为草稿，绑定点击处理函数
  $('#btnSave2').on('click', function () {
    art_state = '草稿'
  })



  // 为表单绑定提交事件
  $('#form-pub').on('submit', function (e) {
    e.preventDefault()
    // 基于form 表单，快速创建一个FormData对象
    const fd = new FormData($(this)[0])
    // 将文章的状态存放在FD中
    fd.append('state', art_state)

    // fd.forEach(function (v, k) {
    //   console.log(k, v);
    // })

    // 将封面裁剪后的图片，输出为一个文件对象
    $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作

        // 将文件对象追加到 fd 中
        fd.append('cover_img', blob)
        // 发起ajax请求
        publishArticle(fd)
      })


    function publishArticle(fd) {
      $.ajax({
        method: 'post',
        url: '/my/article/add',
        data: fd,
        // 注意：如果向服务器提交的是 FormData 格式的数据，
        // 必须添加以下两个配置项
        contentType: false,
        processData: false,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('添加文章失败')
          }
          layer.msg('添加文章成功')
          // 文章列表添加成功后，跳转到文章列表页面
          location.href = './article_list.html'
        }
      })
    }
  })

})