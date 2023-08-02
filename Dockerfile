FROM node:12.19.0

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

WORKDIR /usr/src/app/client
COPY client/package*.json ./
RUN npm install

# Used to toggle between local & remote environments
ENV REACT_APP_ENV=development

# Local server URL, default value specified
ENV REACT_APP_LOCAL_SERVER_URL="http://localhost:3009/api"

# if deploying on remote server, specify URL here
ENV REACT_APP_PROD_SERVER_URL=

WORKDIR /usr/src/app/server
COPY server/package*.json ./
RUN npm install


# If you are building your code for production
# RUN npm ci --omit=dev

WORKDIR /usr/src/app

# Bundle app source
COPY . .

WORKDIR /usr/src/app/client
RUN npm run build

WORKDIR /usr/src/app

EXPOSE 3009
CMD [ "node", "server/src/index.js" ]
