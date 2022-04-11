FROM ubuntu:20.04

RUN apt-get update && apt-get install -y \
    git-core \
    curl \
    python-software-properties \
    build-essential --fix-missing

RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -E -

RUN apt-get install -y nodejs
# FROM node
COPY package*.json ./

RUN rm -rf /node-modules

RUN npm install

COPY /public /var/lib/data 
# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "node", "./bin/www" ]