$(function () {

  const layer = layui.layer
  const form = layui.form

  initArtCateList()

  // 获取文章分类的列表
  function initArtCateList() {
    $.ajax({
      method: 'get',
      url: '/my/article/cates',
      success: function (res) {
        // console.log(res)
        const htmlStr = template('tpl_cate', res)
        $('tbody').html(htmlStr)
      }
    })
  }

  // 为添加类别按钮绑定按钮事件
  let indexAdd = null
  $('#btnAddCate').on('click', function () {
    indexAdd = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类'
      , content: $('#dialog-add').html()
    })

  })


  // 通过代理方式，事件委托，为form-add添加提交submit事件
  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('新增分类失败！')
        }
        initArtCateList()
        layer.msg('新增分类成功！')
        // 根据索引，关闭对应的弹出层
        layer.close(indexAdd)
      }
    })
  })

  let indexEdit = null
  // 通过代理方式，事件委托，为btn-edit添加提交click事件
  $('tbody').on('click', '#btn-edit', function (e) {
    e.preventDefault()
    // 弹出一个修改文章分类的层

    indexEdit = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '修改文章分类',
      content: $('#dialog-edit').html()
    })

    const id = $(this).attr('data-id')
    // 发起请求获取对应分类的数据
    $.ajax({
      method: 'get',
      url: '/my/article/cates/' + id,
      success: function (res) {
        // console.log(res);
        form.val('form-edit', res.data)
      }
    })

  })

  // 通过代理方式，事件委托，为修改分类的表单绑定submit事件
  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault()

    $.ajax({
      method: 'post',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('修改分类失败')
        }
        initArtCateList()
        layer.msg('修改分类成功')
        layer.close(indexEdit)
      }
    })
  })

  // 通过代理方式，事件委托，为删除按钮绑定click事件
  $('body').on('click', '.btn-delete', function () {
    const id = $(this).attr('data-id')

    // 提示是否删除
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      //do something
      $.ajax({
        method: 'get',
        url: '/my/article/deletecate/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除文章分类失败')
          }

          layer.msg('删除文章分类成功')
          layer.close(index);
          initArtCateList()
        }
      })


    });
  })

})