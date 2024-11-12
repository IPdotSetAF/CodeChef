FROM node:20-alpine AS node-builder

WORKDIR /app

COPY Frontend .

RUN npm install
RUN npm run build

FROM python:3.11-alpine AS python-builder

WORKDIR /app

RUN apk add --no-cache --update alpine-sdk
RUN apk add --no-cache gcc python3-dev musl-dev libffi-dev libc-dev unixodbc unixodbc-dev curl

#RUN curl -O https://download.microsoft.com/download/e/4/e/e4e67866-dffd-428c-aac7-8d28ddafb39b/msodbcsql17_17.6.1.1-1_amd64.apk
#RUN apk add --allow-untrusted msodbcsql17_17.6.1.1-1_amd64.apk

COPY Tools/mssql-proxy .
RUN pip install --no-cache-dir -r requirements.txt pyinstaller
RUN pyinstaller --onefile mssql-proxy.py --name mssql-proxy 
#--add-binary /opt/microsoft/msodbcsql17/lib64/libmsodbcsql-17.6.so.1.1:.

FROM alpine:latest

RUN apk add --no-cache nginx unixodbc unixodbc-dev curl

RUN curl -O https://download.microsoft.com/download/e/4/e/e4e67866-dffd-428c-aac7-8d28ddafb39b/msodbcsql17_17.6.1.1-1_amd64.apk
RUN curl -O https://download.microsoft.com/download/e/4/e/e4e67866-dffd-428c-aac7-8d28ddafb39b/mssql-tools_17.10.1.1-1_amd64.apk
RUN apk add --allow-untrusted msodbcsql17_17.6.1.1-1_amd64.apk mssql-tools_17.10.1.1-1_amd64.apk

COPY --from=node-builder /app/dist/code-chef /usr/share/nginx/code-chef
COPY --from=python-builder /app/dist/mssql-proxy /usr/local/bin/mssql-proxy

COPY nginx.conf /etc/nginx/nginx.conf

RUN mkdir -p /run/nginx /var/log/api

ENV ALLOWED_ORIGIN="http://localhost:4200"

EXPOSE 4200 50505

CMD ["sh", "-c", "nginx && /usr/local/bin/mssql-proxy -o ${ALLOWED_ORIGIN}"]
