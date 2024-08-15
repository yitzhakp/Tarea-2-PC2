FROM nginx:1.18.0-alpine
COPY var/www/html/index.html /etc/nginx/html/
WORKDIR /etc/nginx/templates
COPY default.conf.template ./default.conf.template
EXPOSE 80