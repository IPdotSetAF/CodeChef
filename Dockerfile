FROM node:20-alpine AS node-builder

WORKDIR /app

COPY Frontend .

RUN npm install
RUN npm run build

FROM python:3.11-alpine AS python-builder

WORKDIR /app

RUN apk add --no-cache --update alpine-sdk
RUN apk add --no-cache gcc python3-dev musl-dev libffi-dev libc-dev

COPY Tools/mssql-proxy .

RUN sh -c ./odbc-driver-installer.sh 
RUN pip install --no-cache-dir -r requirements.txt pyinstaller

RUN pyinstaller mssql-proxy.linux.spec

FROM alpine:latest

RUN apk add --no-cache nginx

COPY --from=node-builder /app/dist/code-chef /usr/share/nginx/code-chef
COPY --from=python-builder /app/dist/mssql-proxy /usr/local/bin/mssql-proxy

COPY nginx.conf /etc/nginx/nginx.conf

RUN mkdir -p /run/nginx /var/log/api

ENV ALLOWED_ORIGIN="http://localhost:4200"

EXPOSE 4200 50505

CMD ["sh", "-c", "nginx && /usr/local/bin/mssql-proxy -o ${ALLOWED_ORIGIN}"]
