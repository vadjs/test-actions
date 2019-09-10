FROM alpine AS baseContainer

RUN apk add --no-cache \
  chromium \
  nss \
  freetype \
  freetype-dev \
  harfbuzz \
  ca-certificates \
  ttf-freefont \
  nodejs \
  npm

FROM baseContainer AS packageContainer

RUN mkdir -p /tmp/src/app
WORKDIR /tmp/src/app

COPY package.json .
COPY package-lock.json .
RUN npm ci


FROM packageContainer AS appContainer

COPY . .


FROM appContainer

RUN npm run lint


FROM appContainer

RUN export CHROME_BIN=/usr/bin/chromium-browser
RUN npm run ci:test


FROM appContainer AS buildContainer
RUN npm run build -- -c=production


FROM nginx:alpine
ARG API_URL
COPY --from=buildContainer /tmp/src/app/dist/auth-frontend/ /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY ./docker-entrypoint.sh /
RUN chmod +x docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
