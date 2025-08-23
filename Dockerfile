# Etapa de construcción
FROM node:18-alpine AS builder

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar todas las dependencias (incluyendo devDependencies para TypeScript)
RUN npm ci

# Copiar código fuente
COPY . .

# Compilar TypeScript
RUN npm run build

# Etapa de producción
FROM node:18-alpine AS production

# Instalar Python y pip
RUN apk add --no-cache python3 py3-pip

# Crear usuario no root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production && npm cache clean --force

# Copiar archivos compilados desde la etapa de construcción
COPY --from=builder /app/dist ./dist

# Copiar archivos de configuración
COPY --from=builder /app/src/infrastructure/config ./src/infrastructure/config

# Copiar archivos TypeScript necesarios para Swagger en desarrollo
COPY --from=builder /app/src ./src

# Copiar script de Python y dependencias
COPY pdf-generator.py ./pdf-generator.py
COPY requirements.txt ./requirements.txt
COPY logo_script.png ./logo_script.png

# Instalar dependencias de Python
RUN pip3 install --break-system-packages -r requirements.txt

# Cambiar propietario de los archivos
RUN chown -R nodejs:nodejs /app

# Cambiar al usuario no root
USER nodejs

# Exponer puerto
EXPOSE 3000

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3000

# Comando de inicio
CMD ["node", "dist/index.js"] 