FROM alpine:3.21

ARG PB_VERSION=0.36.1

RUN apk add --no-cache unzip ca-certificates sqlite

ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb && rm /tmp/pb.zip

COPY pb_migrations /pb/pb_migrations
COPY entrypoint.sh /pb/entrypoint.sh
RUN chmod +x /pb/entrypoint.sh

EXPOSE 8090

CMD ["/pb/entrypoint.sh"]
