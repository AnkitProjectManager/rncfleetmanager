# RNCFleets Deployment Guide

## Prerequisites

- Node.js 18+ and npm
- Git
- A modern web browser

## Local Development

### 1. Clone and Install

\`\`\`bash
git clone https://github.com/yourusername/rncfleets.git
cd rncfleets
npm install
\`\`\`

### 2. Start Development Server

\`\`\`bash
npm run dev
\`\`\`

Open http://localhost:3000 in your browser.

### 3. Demo Credentials

- Email: `demo@rncfleets.com`
- Password: `demo123`

## Production Deployment

### Option 1: Deploy to Vercel

1. Push your code to GitHub
2. Go to https://vercel.com/new
3. Import your repository
4. Configure environment variables
5. Deploy

\`\`\`bash
vercel deploy --prod
\`\`\`

### Option 2: Docker Deployment

Create a `Dockerfile`:

\`\`\`dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
\`\`\`

Build and run:

\`\`\`bash
docker build -t rncfleets:latest .
docker run -p 3000:3000 rncfleets:latest
\`\`\`

### Option 3: Traditional Server

1. SSH into your server
2. Clone the repository
3. Install dependencies: `npm install`
4. Build: `npm run build`
5. Start with PM2: `pm2 start npm --name rncfleets -- start`

## Environment Variables

Create a `.env.local` file:

\`\`\`env
NEXT_PUBLIC_API_URL=https://api.rncfleets.local
DATABASE_URL=postgresql://user:password@localhost:5432/rncfleets
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
\`\`\`

## Database Setup

### PostgreSQL

\`\`\`sql
CREATE DATABASE rncfleets;
CREATE USER rncfleets_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE rncfleets TO rncfleets_user;
\`\`\`

### Run Migrations

\`\`\`bash
npm run migrate
\`\`\`

## SSL/TLS Configuration

### Using Let's Encrypt with Nginx

\`\`\`bash

sudo certbot certonly --standalone -d rncfleets.yourdomain.com
\`\`\`

Configure Nginx:

\`\`\`nginx
server {
    listen 443 ssl http2;
    server_name rncfleets.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/rncfleets.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/rncfleets.yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
\`\`\`

## Monitoring

### Application Monitoring

\`\`\`bash
npm install pm2 -g
pm2 start npm --name rncfleets -- start
pm2 monit
\`\`\`

### Log Aggregation

Configure logging to external service (Datadog, New Relic, etc.)

## Backup Strategy

### Database Backups

\`\`\`bash
# Daily backup
0 2 * * * pg_dump rncfleets > /backups/rncfleets-$(date +\%Y\%m\%d).sql
\`\`\`

### Configuration Backups

\`\`\`bash
# Backup configuration files
tar -czf /backups/rncfleets-config-$(date +\%Y\%m\%d).tar.gz /app/config/
\`\`\`

## Security Hardening

1. **Enable HTTPS**: Use SSL/TLS certificates
2. **API Rate Limiting**: Implement rate limiting on API endpoints
3. **CORS Configuration**: Restrict CORS to trusted domains
4. **Security Headers**: Add security headers (CSP, X-Frame-Options, etc.)
5. **Database Security**: Use strong passwords, enable encryption at rest
6. **Secrets Management**: Use environment variables for sensitive data

## Performance Optimization

1. **Enable Caching**: Configure Redis for session and data caching
2. **CDN**: Use CDN for static assets
3. **Database Indexing**: Create indexes on frequently queried columns
4. **Load Balancing**: Use load balancer for horizontal scaling

## Troubleshooting

### Port Already in Use

\`\`\`bash
lsof -i :3000
kill -9 <PID>
\`\`\`

### Database Connection Issues

\`\`\`bash
# Test connection
psql -h localhost -U rncfleets_user -d rncfleets
\`\`\`

### Memory Issues

\`\`\`bash
# Increase Node.js memory
NODE_OPTIONS=--max-old-space-size=4096 npm start
\`\`\`

## Support

For deployment issues, contact support@rncfleets.local
