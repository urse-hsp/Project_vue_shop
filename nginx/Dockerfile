# 构建阶段
FROM node:16.17.0  as BUILD
WORKDIR  /app
# 将npm install命令放在最后一步，并将package.json和package-lock.json文件复制到镜像中。
COPY package*.json ./
# 此步将可以充分利用 node_modules 的缓存
RUN npm install
COPY . .
RUN npm run build

# 运行阶段
# 使用 nginx最新版本作为基础镜像
# 分析一下 50M+ 的镜像体积，nginx:10-alpine 的镜像是16M，剩下的40M是静态资源。
FROM nginx:latest
# 替换nginx
# COPY --from=BUILD /app/nginx/nginx.conf /etc/nginx/nginx.conf
# 前端静态放入 /app
COPY --from=BUILD /app/dist /app
# 前端静态放入nginx服务代理
COPY --from=BUILD /app/dist /usr/share/nginx/html


# 声明运行时容器暴露的端口（容器提供的服务端口）
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# 多阶段构建。 第二个镜像指定copy第一个镜像的 最终只会留下第二个镜像，这个镜像里只有生产环境需要的依赖，体积更小。传输速度、运行速度也会更快。
# 第一阶段使用node镜像来构建应用程序，第二阶段使用nginx镜像来运行应用程序。这样可以减少镜像大小和构建时间，同时保证应用程序的稳定性和可靠性。