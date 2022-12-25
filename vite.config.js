import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import createVitePlugins from './vite/plugins'


// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd())
  const { VITE_APP_ENV, VITE_APP_API_PROXY } = env
  return {
    // 部署生产环境和开发环境下的URL。
    // 默认情况下，vite 会假设你的应用是被部署在一个域名的根路径上
    // 例如 https://www.ruoyi.vip/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.ruoyi.vip/admin/，则设置 baseUrl 为 /admin/。
    base: VITE_APP_ENV === 'production' ? '/workbench/' : '/workbench/',
    plugins: createVitePlugins(env, command === 'build'),
    resolve: {
      // https://cn.vitejs.dev/config/#resolve-alias
      alias: {
        // 设置路径
        '~': path.resolve(__dirname, './'),
        // 设置别名
        '@': path.resolve(__dirname, './src')
      },
      // https://cn.vitejs.dev/config/#resolve-extensions
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    build:{
      outDir: 'dist',
      rollupOptions:{
        output: {
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: assetInfo => {
            var info = assetInfo.name.split('.')
            var type = info[info.length - 1]
            var extType = info[info.length - 1]
            if (
              /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name)
            ) {
              extType = 'media'
            } else if (/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(assetInfo.name)) {
              extType = 'image'
              if(/\/src\/assets\/images\/FileType\//.test(assetInfo.name)){
                return `${extType}/FileType/[name].${type}`
              }else{
                return `${extType}/[name]-[hash].${type}`
              }
            } else if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name)) {
              extType = 'fonts'
            }
            return `${extType}/[name]-[hash].${type}`
          },
        }
      }
    },
    // vite 相关配置
    server: {
      port: 8088,
      host: true,
      open: false,
      proxy: {
        // https://cn.vitejs.dev/config/#server-proxy
        '/dev-api': {
          secure: false,
          target: VITE_APP_API_PROXY,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/dev-api/, '')
        },
        '/test-api': {
          secure: false,
          target: VITE_APP_API_PROXY,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/test-api/, '')
        },
        '/formal-api': {
          secure: false,
          target: VITE_APP_API_PROXY,
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/formal-api/, '')
        }
      }
    },
    //fix:error:stdin>:7356:1: warning: "@charset" must be the first rule in the file
    css: {
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') {
                  atRule.remove();
                }
              }
            }
          }
        ]
      }
    }
  }
})
