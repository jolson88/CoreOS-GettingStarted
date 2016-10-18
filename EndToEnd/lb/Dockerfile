FROM nginx
MAINTAINER jolson88@outlook.com
RUN mkdir /opt/lb
ADD ./gen-nginx-conf.sh /opt/lb/
ADD ./lb-startup.sh /opt/lb/
RUN chmod +rx /opt/lb/gen-nginx-conf.sh
RUN chmod +rx /opt/lb/lb-startup.sh
RUN apt-get -y -qq update && \
	apt-get install -y -qq curl && \
	apt-get clean
# install jq to parse json within bash scripts
RUN curl -o /usr/local/bin/jq http://stedolan.github.io/jq/download/linux64/jq && \
  chmod +x /usr/local/bin/jq

# Define working directory.
WORKDIR /opt/lb
ENTRYPOINT ["/opt/lb/lb-startup.sh"]
