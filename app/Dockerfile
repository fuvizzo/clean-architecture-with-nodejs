FROM node:12.18-alpine as prod
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .

CMD node .

FROM node:12.18-alpine as dev
ENV NODE_ENV=development
WORKDIR /usr/src/app
COPY ./package.json ./
RUN npm install 
RUN npm install nodemon -g
COPY . .

CMD ["npm", "start"]
