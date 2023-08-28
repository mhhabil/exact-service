FROM asia.gcr.io/hospital-bigdata/bcgovimages/alpine-node-libreoffice

# WORKDIR /app

RUN apk update
RUN apk add py-pip

RUN pip install unoserver

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --prod

RUN yarn add webpack webpack-node-externals tsconfig-paths-webpack-plugin -D

COPY . ./

RUN yarn build:dev

RUN yarn remove webpack webpack-node-externals tsconfig-paths-webpack-plugin
# COPY ./dist /app/dist

CMD [ "yarn", "start" ]

EXPOSE 3022