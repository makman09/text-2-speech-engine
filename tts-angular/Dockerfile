FROM node:13.10.1 as build

# Clean up the image cache (see the Docker best practices guide: https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#run)
RUN apt-get autoclean && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*

# Does changing this to USER from N4J_USER cause problem down the road
ENV USER node
ENV HOME /home/$USER
ENV CLIENT $HOME/client

ENV PATH $CLIENT/node_modules/.bin:$PATH

EXPOSE 4200

WORKDIR $CLIENT

COPY --chown=$USER:$USER package.json $CLIENT/package.json
COPY --chown=$USER:$USER yarn.lock $CLIENT/yarn.lock
RUN yarn install && chown -R $USER:$USER node_modules

COPY . $CLIENT

CMD ["yarn", "dev-start"]