FROM debian

RUN apt update
RUN apt -y install tor

COPY ./service /etc/tor/service
RUN chmod 700 /etc/tor/service
RUN chmod 600 /etc/tor/service/hs_ed25519_secret_key

COPY ./torrc /etc/tor/torrc