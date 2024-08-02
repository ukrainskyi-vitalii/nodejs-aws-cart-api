FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx nest build --webpack --webpackPath webpack.config.js

FROM node:18-alpine

WORKDIR /app

COPY --from=build /app/dist ./dist

EXPOSE 4000

CMD ["node", "dist/main.js"]
