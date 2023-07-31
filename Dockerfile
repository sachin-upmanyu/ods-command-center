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
