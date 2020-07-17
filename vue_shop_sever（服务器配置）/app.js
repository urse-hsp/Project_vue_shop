const express = require('express')
const compression = require('compression')
const app = express()

// 先压缩在托管
app.use(compression())
app.use(express.static('./dist'))

app.listen(80, () => {
    console.log('server running at http://127.0.0.1')
})

// 创建node项目 安装express，通过express快速创建web服务器，将vue打包生成的 dist文件夹 托管为静态志愿即可
// npm init -y
// npm i express -S
// 开启gzip压缩 减小文件体积，使传输速度更快
// npm install compression -D/-S

// pm2管理工具，关闭服务窗口，也可以运行
// 在服务器中安装pm2: npm i pm2 -g
// 启动项目: pm2 start脚本 --name自定义名称
// 查看运行项目: pm2 ls
// 重启项目: pm2 restart自定义名称
// 停止项目: pm2 stop自定义名称
// 删除项目: pm2 delete 自定义名称
