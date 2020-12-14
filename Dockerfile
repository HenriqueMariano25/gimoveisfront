FROM vuejs/ci
MAINTAINER Henrique Mariano
COPY . /var/www
WORKDIR /var/www
RUN npm install
ENTRYPOINT npm run serve
EXPOSE 8080