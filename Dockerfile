ARG NODE_VERSION=10.13

# Phase to compile ts
FROM node:${NODE_VERSION}-alpine as builder
# Create a working dir to use
RUN mkdir -p /opt/app
# Set it
WORKDIR /opt/app

ADD package.json ./
ADD yarn.lock ./
# Install dependencies for building bcrypt
RUN apk --no-cache add --virtual builds-deps build-base python
# Install node_modules
RUN yarn install --frozen-lockfile

# Add everything else
ADD . .
# Compile ts
RUN yarn build

# Phase to run the app?
FROM node:${NODE_VERSION}-alpine
# Set the environment variable
ENV NODE_ENV production
# Create a working dir to use
RUN mkdir -p /opt/app
# Set it
WORKDIR /opt/app
# Copy files from the previous phase
COPY --from=builder /opt/app/package.json .
COPY --from=builder /opt/app/yarn.lock .
COPY --from=builder /opt/app/schema.graphql .
COPY --from=builder /opt/app/dist ./dist

# Install dependencies for building bcrypt
RUN apk --no-cache add --virtual builds-deps build-base python
# Install node deps
RUN set -ex; \
  yarn install --frozen-lockfile --production; \
  yarn cache clean

EXPOSE 8080
CMD ["yarn", "migrate-and-start"]