FROM node:14.16.0 as BUILD

MAINTAINER Min "dotview@163.com"

WORKDIR /app

COPY . /app/

VOLUME ./node_modules /app/node_modules
#RUN apk update && \
#    apk add --update git && \
#    apk add --update openssh

RUN npm set chromedriver_cdnurl http://cdn.npm.taobao.org/dist/chromedriver && \
    npm set operadriver_cdnurl http://cdn.npm.taobao.org/dist/operadriver && \
    npm set phantomjs_cdnurl http://cdn.npm.taobao.org/dist/phantomjs && \
    npm set sass_binary_site http://cdn.npm.taobao.org/dist/node-sass && \
    npm set electron_mirror http://cdn.npm.taobao.org/dist/electron/ && \
    npm config set registry http://registry.npm.taobao.org

RUN npm install && npm run build:h5

FROM nginx:1.13.7

COPY --from=BUILD /app/dist /app
COPY --from=BUILD /app/nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 9000

RUN echo 'echo init ok!!'
