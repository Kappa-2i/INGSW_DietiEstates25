# Usa immagine node
FROM node:18

# Setti la cartella di lavoro
WORKDIR /app

# Copi solo package.json e package-lock.json per installare le dipendenze prima
COPY package*.json ./

# Installa dipendenze
RUN npm install

# Copi TUTTO il progetto backend dentro /app
COPY . .

# Espone la porta 8000
EXPOSE 8000

# Comando di avvio
CMD ["node", "server.js"]  # perché dentro /app c'è server.js, non "server/server.js"
