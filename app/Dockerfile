# ---- build stage ----
FROM node:22-alpine AS build
WORKDIR /app
ENV CI=true
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build

# ---- run stage ----
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package*.json ./
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/app ./app
COPY --from=build /app/components ./components
COPY --from=build /app/next.config.js /app/next.config.js
COPY --from=build /app/tsconfig.json /app/tsconfig.json 2>/dev/null || true

EXPOSE 3000
CMD ["npm", "start"]
