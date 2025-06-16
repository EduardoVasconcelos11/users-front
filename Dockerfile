# Use Node.js LTS como base
FROM node:18-alpine AS builder

# Define diretório de trabalho
WORKDIR /app

# Copia package.json e package-lock.json
COPY package.json package-lock.json ./

# Instala dependências
RUN npm install

# Copia o restante do código
COPY . .

# Constrói a aplicação React
RUN npm run build

# Usa um servidor leve para servir a aplicação
FROM nginx:alpine

# Copia os arquivos construídos
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia configuração personalizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 5173
EXPOSE 5173

# Inicia o Nginx
CMD ["nginx", "-g", "daemon off;"]