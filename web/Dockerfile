FROM node:12 as builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM nginx 
COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
COPY ./.htaccess /usr/share/nginx/html/.htaccess