FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Install dependencies including legacy peer deps as needed
RUN npm install --legacy-peer-deps

COPY . .

# Build args
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build the Next.js application
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]