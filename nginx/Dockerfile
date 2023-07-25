# 构建阶段
FROM node:14.17.3 as BUILD
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
# COPY --from=BUILD /app/dist /app
# 前端静态放入nginx服务代理
COPY --from=BUILD /app/dist /usr/share/nginx/html


# 声明运行时容器暴露的端口（容器提供的服务端口）
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


# 换源方案 加速install
# RUN npm install --omit=dev --registry=https://registry.npm.taobao.org
