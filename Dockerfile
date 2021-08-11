FROM node:14.16.0 as BUILD

MAINTAINER Min "hsp_email@163.com"

# 指定工作目录
WORKDIR /app 

COPY . /app/

VOLUME ./node_modules /app/node_modules


# RUN npm set chromedriver_cdnurl http://cdn.npm.taobao.org/dist/chromedriver && \
#     npm set operadriver_cdnurl http://cdn.npm.taobao.org/dist/operadriver && \
#     npm set phantomjs_cdnurl http://cdn.npm.taobao.org/dist/phantomjs && \
#     npm set sass_binary_site http://cdn.npm.taobao.org/dist/node-sass && \
#     npm set electron_mirror http://cdn.npm.taobao.org/dist/electron/ && \
#     npm config set registry http://registry.npm.taobao.org

RUN yarn && yarn build

FROM nginx:1.13.7

COPY --from=BUILD /app/dist /app
COPY --from=BUILD /app/nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 9000

RUN echo 'deploy ok!!'
