FROM node:14-alpine
ENV NODE_ENV=production
ENV USER_SERVICE_URL=http://localhost:4000
ENV NODE_SERVER_POST=8000
ENV NODE_SERVER_HOST=localhost
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
