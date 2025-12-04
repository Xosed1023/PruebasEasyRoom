# Install dependencies and build the application
FROM node:lts AS builder

LABEL org.opencontainers.image.source=https://github.com/Dime-Digital/easyroom-mobile

WORKDIR /app

ARG VITE_APP_GQL_API_WS
ARG VITE_APP_GQL_API
ARG VITE_APP_REST_API
ARG VITE_APP_AUTH_KEY
ARG VITE_APP_ACCES_KEY
ARG VITE_APP_SECRET_KEY
ARG VITE_APP_ARTICULOS_BUCKET
ARG VITE_APP_AVATARS_BUCKET_FOLDER
ARG VITE_APP_BUCKET_REGION
ARG VITE_APP_SPACES_ENDPOINT

COPY package.json yarn.lock tsconfig.json tsconfig.app.json tsconfig.node.json vite.config.ts index.html /app/
COPY src /app/src/
COPY public /app/public/
RUN sed -i "s#process.env.VITE_APP_GQL_API_WS#$VITE_APP_GQL_API_WS#g" /app/src/config/environment.ts
RUN sed -i "s#process.env.VITE_APP_GQL_API#$VITE_APP_GQL_API#g" /app/src/config/environment.ts 
RUN sed -i "s#process.env.VITE_APP_REST_API#$VITE_APP_REST_API#g" /app/src/config/environment.ts 
RUN sed -i "s#process.env.VITE_APP_ACCES_KEY#$VITE_APP_ACCES_KEY#g" /app/src/config/environment.ts
RUN sed -i "s#process.env.VITE_APP_SECRET_KEY#$VITE_APP_SECRET_KEY#g" /app/src/config/environment.ts
RUN sed -i "s#process.env.VITE_APP_BUCKET_REGION#$VITE_APP_BUCKET_REGION#g" /app/src/config/environment.ts
RUN sed -i "s#process.env.VITE_APP_SPACES_ENDPOINT#$VITE_APP_SPACES_ENDPOINT#g" /app/src/config/environment.ts
RUN sed -i "s#process.env.VITE_APP_ARTICULOS_BUCKET#$VITE_APP_ARTICULOS_BUCKET#g" /app/src/config/environment.ts
RUN sed -i "s#process.env.VITE_APP_AVATARS_BUCKET_FOLDER#$VITE_APP_AVATARS_BUCKET_FOLDER#g" /app/src/config/environment.ts
RUN sed -i "s#process.env.VITE_APP_AUTH_KEY#$VITE_APP_AUTH_KEY#g" /app/src/config/encrypt.ts


RUN yarn install
RUN yarn global add serve
RUN HUSKY=0 DISABLE_ESLINT_PLUGIN=true yarn build

CMD ["serve", "-s", "dist", "-p", "8080"]
