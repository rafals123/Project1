#Author: Rafal Seredowski
#Stage 1 of image build
#Using a base image with the "from scratch" method
FROM scratch AS builder 
#Using a base image with minimal system Linux Alpine
ADD alpine-minirootfs-3.19.1-x86_64.tar /
#Specifying the working directory where the application server.js will be created
WORKDIR /usr/app
#Copying the files from the local filesystem to the container environment
COPY ./src/package.json ./src/server.js ./
#Updating APK packages, installing node.js and npm, also cleaning the cache memory
#Moreover running the installation of dependencies defined in the package.json file
RUN apk update && apk add --no-cache nodejs npm && npm install && rm -rf /var/cache/apk/*

#Stage 2 of image build
#Using an Alpine image
FROM alpine:3.8
#Defining VERSION arg and setting environment variable
ARG VERSION
ENV APP_VERSION=${VERSION:-v1}
#Specifying the working directory
WORKDIR /usr/app
#Copying the files from previous build stage
COPY --from=builder /usr/app /usr/app
#Updating APK packages, installing node.js, also cleaning the cache memory
RUN apk update && apk add --no-cache nodejs && rm -rf /var/cache/apk/*
#Information about the port for container listening
EXPOSE 80
#Running server.js application
CMD node server.js  
#Using HEALTHCHECK command to verify container functionality
HEALTHCHECK --interval=10s --timeout=1s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost:3000 || exit 1