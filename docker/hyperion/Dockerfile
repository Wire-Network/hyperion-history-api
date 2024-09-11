# Use a specific version of node that is compatible with your project
FROM node:20

# Install pm2 globally
RUN npm install pm2 -g

# Set the working directory inside the container
WORKDIR /hyperion-history-api

# Since the hyperion-history-api directory is now within the same directory as the Dockerfile
COPY ../../../hyperion-history-api/ /hyperion-history-api/

# Install dependencies
RUN npm install


# FROM node:16.5
# RUN npm install pm2 -g
# RUN git clone https://github.com/eosrio/hyperion-history-api.git
# WORKDIR /hyperion-history-api
# RUN git checkout dev-3.3
# RUN npm install --production
