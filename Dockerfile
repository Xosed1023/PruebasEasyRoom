# Install dependencies and build the application
FROM node:lts AS builder

LABEL org.opencontainers.image.source=https://github.com/Dime-Digital/easyroom-front


WORKDIR /app

ARG REACT_APP_GQL_API_WS
ARG REACT_APP_GQL_API
ARG REACT_APP_REST_API
ARG REACT_APP_AUTH_KEY
ARG REACT_APP_GOOGLE_OAUTH_API_CLIENT_ID
ARG REACT_APP_ACCES_KEY
ARG REACT_APP_SECRET_KEY
ARG REACT_APP_ARTICULOS_BUCKET
ARG REACT_APP_AVATARS_BUCKET_FOLDER
ARG REACT_APP_BUCKET_REGION
ARG REACT_APP_SPACES_ENDPOINT

COPY package.json yarn.lock tsconfig.json /app/
COPY src /app/src/
COPY public /app/public/
RUN sed -i "s#process.env.REACT_APP_GQL_API_WS#$REACT_APP_GQL_API_WS#g" /app/src/config/environment.ts
RUN sed -i "s#process.env.REACT_APP_GQL_API#$REACT_APP_GQL_API#g" /app/src/config/environment.ts 
RUN sed -i "s#process.env.REACT_APP_REST_API#$REACT_APP_REST_API#g" /app/src/config/environment.ts 
RUN sed -i "s#process.env.REACT_APP_GOOGLE_OAUTH_API_CLIENT_ID#$REACT_APP_GOOGLE_OAUTH_API_CLIENT_ID#g" /app/src/config/environment.ts 
RUN sed -i "s#process.env.REACT_APP_ACCES_KEY#$REACT_APP_ACCES_KEY#g" /app/src/config/environment.ts
RUN sed -i "s#process.env.REACT_APP_SECRET_KEY#$REACT_APP_SECRET_KEY#g" /app/src/config/environment.ts
RUN sed -i "s#process.env.REACT_APP_BUCKET_REGION#$REACT_APP_BUCKET_REGION#g" /app/src/config/environment.ts
RUN sed -i "s#process.env.REACT_APP_SPACES_ENDPOINT#$REACT_APP_SPACES_ENDPOINT#g" /app/src/config/environment.ts
RUN sed -i "s#process.env.REACT_APP_ARTICULOS_BUCKET#$REACT_APP_ARTICULOS_BUCKET#g" /app/src/config/environment.ts
RUN sed -i "s#process.env.REACT_APP_AVATARS_BUCKET_FOLDER#$REACT_APP_AVATARS_BUCKET_FOLDER#g" /app/src/config/environment.ts
RUN sed -i "s#process.env.REACT_APP_AUTH_KEY#$REACT_APP_AUTH_KEY#g" /app/src/config/encrypt.ts


RUN yarn install
RUN HUSKY=0 DISABLE_ESLINT_PLUGIN=true yarn build

# Serve the app with nginx
FROM nginx:latest

# Replace the default configuration file
COPY default.conf /etc/nginx/conf.d/default.conf

# The build directory files goes to the /var/www/ directory
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
