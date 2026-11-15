FROM node:24-bookworm-slim AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Astro embeds this optional public URL in the generated pages.
ARG SPOTIFY_ACTIVITY_STREAM
RUN npm run build

FROM caddy:2-alpine

COPY --from=build /app/dist/ /srv/
COPY Caddyfile /etc/caddy/Caddyfile
RUN sed -i 's|{{\.DIST_DIR}}|/srv|' /etc/caddy/Caddyfile
