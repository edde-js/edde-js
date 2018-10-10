FROM docker.x32.cz/edde-framework/snail:latest

ENV \
    APP_ROOT=/edde-js

RUN npm install -g lerna

WORKDIR /edde-js
COPY . .
RUN chmod +x *.sh
