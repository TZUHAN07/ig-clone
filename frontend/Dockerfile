FROM nginx:alpine

COPY pages/ /usr/share/nginx/html/pages/
COPY assets/ /usr/share/nginx/html/pages/assets/
COPY src/ /usr/share/nginx/html/pages/src/
COPY config.js /usr/share/nginx/html/pages/config.js

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80