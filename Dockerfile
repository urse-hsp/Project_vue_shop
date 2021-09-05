FROM node as BUILD
MAINTAINER Min "hsp_email@163.com"
WORKDIR  /app
COPY . /app/
# RUN yarn && yarn build


# 使用 nginx最新版本作为基础镜像
FROM nginx
COPY --from=BUILD /app/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=BUILD /app/dist /app


# 声明运行时容器暴露的端口（容器提供的服务端口）
EXPOSE 9000

RUN echo 'echo init ok!!'


# docker build -f /root/project/vue_shop/Dockerfile . -t vueadmin
# docker run -p 10520:80  --name vueadmin -dit vueadmin
# docker run -p 80:80 -v /root/nginx/nginx.conf:/etc/nginx/nginx.conf  -d nginx:latest

# docker rm $(docker ps -a -q)
# docker image prune -a -f
