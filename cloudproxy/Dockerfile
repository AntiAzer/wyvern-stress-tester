FROM --platform=${TARGETPLATFORM:-linux/amd64} node:15.2.1-alpine3.11

RUN apk add --no-cache chromium dumb-init && \
    find /usr/lib/chromium/locales -type f ! -name 'en-US.*' -delete

USER node
RUN mkdir -p /home/node/cloudproxy
WORKDIR /home/node/cloudproxy
COPY --chown=node:node package.json package-lock.json tsconfig.json ./
COPY --chown=node:node src ./src/

ENV PUPPETEER_PRODUCT=chrome \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
RUN npm install && \
    npm run build && \
    rm -rf src tsconfig.json && \
    npm prune --production

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["npm", "start"]
