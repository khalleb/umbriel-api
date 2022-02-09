FROM node:lts-alpine AS umbriel-dev-dependencies
WORKDIR /usr/app
COPY package.json yarn.* tsconfig.json ./
COPY ./src ./src
RUN yarn install --production=false --frozen-lockfile

FROM node:lts-alpine AS umbriel-dependencies
WORKDIR /usr/app
COPY package.json yarn.* ./
COPY ./src ./src
RUN yarn install --production=true --frozen-lockfile

FROM node:lts-alpine AS umbriel-build
WORKDIR /usr/app
COPY --from=umbriel-dev-dependencies /usr/app .
COPY . .
RUN yarn build


FROM node:lts-alpine AS runtime
RUN apk update && apk add jq
USER node
COPY --chown=node:node --from=umbriel-dependencies /usr/app/node_modules /home/node/app/node_modules/
COPY --from=umbriel-build --chown=node:node /usr/app/scripts /home/node/app/
COPY --from=umbriel-build --chown=node:node /usr/app/package.json /home/node/app/
COPY --from=umbriel-build --chown=node:node /usr/app/dist /home/node/app/dist/
COPY --from=umbriel-build --chown=node:node /usr/app/tmp /home/node/app/tmp/
COPY --from=umbriel-build --chown=node:node /usr/app/ormconfig.js /home/node/app/
COPY --from=umbriel-build --chown=node:node /usr/app/.env /home/node/app/

ENTRYPOINT ["/home/node/app/wrapper.sh"]
