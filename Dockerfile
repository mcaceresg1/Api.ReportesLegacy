FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "index.js"] 