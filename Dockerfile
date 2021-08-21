# dockerfile
FROM node as BUILD

MAINTAINER Min "hsp_email@163.com"

WORKDIR  /app
COPY . /app/

VOLUME ./node_modules /app/node_modules
RUN yarn && yarn build


# 使用 nginx最新版本作为基础镜像
FROM nginx
# 将当前文件夹的dist文件复制到容器的/usr/share/nginx/html目录
COPY --from=BUILD /app/dist /app
# COPY --from=BUILD /app/nginx/nginx.conf /etc/nginx/nginx.conf


# 声明运行时容器暴露的端口（容器提供的服务端口）
EXPOSE 8080

# CMD:指定容器启动时要运行的命令
CMD ["nginx", "-g", "daemon off;"]

RUN echo 'echo init ok!!'


# docker build -f /root/project/vue_shop/Dockerfile . -t vue
# docker run -p 8677:80  --name vue -dit vue
# docker run -p 8687:80 -v /root/nginx/nginx.conf:/etc/nginx/nginx.conf  -d vue:latest

# docker rm $(docker ps -a -q)

