# ============================================================
# ABDUGOFFOROV WEB PLATFORM — PRODUCTION DOCKERFILE
# Yengil, xavfsiz va optimallashtirilgan Alpine konteyner
# ============================================================

FROM node:22-alpine AS runner

WORKDIR /app

# Muhit o'zgaruvchilari
ENV NODE_ENV=production
ENV PORT=8000

# Loyiha fayllarini ko'chirish
COPY . .

# Xavfsizlik: root emas, standart 'node' foydalanuvchisi sifatida ishlatish
RUN chown -R node:node /app

USER node

EXPOSE 8000

# Sog'liq tekshiruvi (Healthcheck)
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8000/api/status || exit 1

CMD ["node", "server.js"]
