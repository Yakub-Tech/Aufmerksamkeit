FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build

ENV NODE_ENV=production

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && if [ \"$SEED_DEMO\" = \"true\" ]; then node prisma/seed.js; fi && npm start -- --hostname 0.0.0.0"]
