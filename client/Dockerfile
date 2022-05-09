FROM node:17-alpine

WORKDIR .

COPY package.json ./

COPY package-lock.json ./

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start"]