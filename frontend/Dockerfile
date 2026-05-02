FROM nginx:alpine

COPY pages/ /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/
COPY src/ /usr/share/nginx/html/src/
COPY config.js /usr/share/nginx/html/config.js

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80