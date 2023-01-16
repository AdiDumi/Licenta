FROM node:17-alpine

RUN npm install -g nodemon

WORKDIR /server_docker

COPY package.json .

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "run", "server"]