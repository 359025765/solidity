FROM alpine:latest

RUN sed -i 's/http:\/\/dl-cdn.alpinelinux.org/https:\/\/mirrors.tuna.tsinghua.edu.cn/' /etc/apk/repositories;

RUN apk update; \
    apk add --no-cache \
    curl openssh tzdata git \
    nodejs nodejs-npm

RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

ARG NPM_REGISTRY
ENV NPM_REGISTRY https://registry.npm.taobao.org


RUN if [ ${NPM_REGISTRY} ]; then \
    npm config set registry ${NPM_REGISTRY} \
    ;fi

WORKDIR /home/app

EXPOSE 7545

CMD ["node"]
