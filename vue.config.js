module.exports = {
    chainWebpack: config => {
        // 发布模式 prod
        config.when(process.env.NODE_ENV === 'production', config => {
            config
                .entry('app') // 得到默认的打包入口
                .clear() // 默认打包入口清空，就没默认打包入口了
                .add('./src/main-prod.js') // 新增打包入口

            config.set('externals', { // externals加载外部的cnd资源 不会打包设置的这些文件，而是去window全局中寻找
                vue: 'Vue',
                'vue-router': 'VueRouter',
                axios: 'axios',
                lodash: '_',
                echarts: 'echarts',
                nprogress: 'NProgress',
                vueQuillEditor: 'vueQuillEditor'
            })
            config.plugin('html').tap(args => {
                args[0].isProd = true
                return args
            })
        })

        // 开发模式 dev
        config.when(process.env.NODE_ENV === 'development', config => {
            config
                .entry('app')
                .clear()
                .add('./src/main-dev.js')

            config.plugin('html').tap(args => {
                args[0].isProd = false
                return args
            })
        })
    }
}
