#制定node镜像的版本
FROM node:10.24.0 as BUILD
#声明作者
MAINTAINER Min "hsp_email@163.com"

# 切换目录
WORKDIR /app

#移动当前目录下面的文件到app目录下
ADD . /app/
#进入到app目录下面，类似cd
WORKDIR /app
#安装依赖# RUN npm install && npm run build:h5
RUN npm install && npm run build

FROM nginx:1.13.7
COPY --from=BUILD /app/dist /app
COPY --from=BUILD /app/nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 9000


#对外暴露的端口
EXPOSE 3000
#程序启动脚本
# CMD ["npm", "start"]
RUN echo 'echo init ok!!'