# 在线3D模型预览

入口：[https://yuyun2000.github.io/m5stack-models/](https://yuyun2000.github.io/m5stack-models/)。浏览器执行Three.js/WebGL渲染，模型按需加载，选择型号与配置后可分享地址，例如[Dial完整模型](https://yuyun2000.github.io/m5stack-models/?model=dial&configuration=complete)。模型状态和能力边界与源码目录一致。

仓库Pages来源配置为GitHub Actions。[pages.yml](../.github/workflows/pages.yml)在`main`的页面/模型相关推送或手动运行时，安装锁定依赖、运行demo检查、构建静态站点、检查贴纸打包，再上传并部署`dist/`。仅`docs/`和README的独立变更不重复部署。构建和部署分为两个作业；仅部署作业具有Pages写入和OIDC权限。官方Actions固定到审核过的提交。

本地仍使用`npm run build`和`./manage.sh start`。构建采用相对资源base，目录请求相对于页面地址解析，因此根路径、本项目的`/m5stack-models/`和显式`index.html`入口均可使用；型号与配置采用query参数，无需服务端路由或404改写。`npm run check:demo`覆盖这些入口的实际控制器初始化。

上线检查应同时确认Actions成功、Pages HTTPS地址、产品目录、目标型号lazy chunk和贴图，并实际操作画布。`dist`体积约172 MiB，首次打开较复杂型号会下载对应几何；后续缓存与按需加载由浏览器负责。官方参考图仍来自公开外链，模型本身不依赖本地后端。

仅上传公开源码构建的`dist/`，不上传仓库历史、开发依赖、工作目录或私有素材。MIT和第三方通知随站点保留。私有CSV、矢量原稿与映射继续留在分发树外；托管不改变几何、图像或商标的权利边界。
