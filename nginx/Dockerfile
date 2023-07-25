FROM node:16.17.0 as BUILD
WORKDIR  /app
COPY . /app/
RUN npm install && npm build


# 使用 nginx最新版本作为基础镜像
FROM nginx
COPY --from=BUILD /app/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=BUILD /app/dist /app

# 声明运行时容器暴露的端口（容器提供的服务端口）
EXPOSE 9000
RUN echo 'echo init ok!!'
