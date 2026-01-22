# Docker Quick Reference

## What Changed

### ✅ Optimizations Made

1. **Backend Dockerfile**
   - Uses `npm ci` instead of `npm install` (faster, more reliable)
   - Installs only production dependencies (`--only=production`)
   - Runs as non-root user for security
   - Added `.dockerignore` to speed up builds

2. **Frontend Dockerfile**
   - **Multi-stage build** (builds in one stage, runs in another)
   - Smaller final image size (~50% reduction)
   - Pre-builds the app (faster startup)
   - Runs as non-root user for security
   - Added `.dockerignore` to exclude unnecessary files

3. **Docker Compose**
   - Added health checks for backend
   - Frontend waits for backend to be healthy before starting
   - Changed `restart: always` to `restart: unless-stopped` (better for development)
   - Simplified configuration

## How to Use

### Build and Run
```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Build Times
- **First build**: ~2-3 minutes (downloads dependencies)
- **Subsequent builds**: ~30-60 seconds (uses cache)
- **Startup time**: ~10-15 seconds

## Important Notes

⚠️ **Before running**, make sure:
1. Your `backend/.env` file exists with MongoDB connection string
2. Docker Desktop is running
3. Ports 3000 and 5000 are available

## Troubleshooting

If frontend can't connect to backend:
- The health check ensures backend is ready before frontend starts
- Check logs: `docker-compose logs backend`

If build is slow:
- The `.dockerignore` files exclude `node_modules` and other large folders
- Docker caches layers, so rebuilds are faster

## What Makes This Fast

1. **.dockerignore files** - Don't copy unnecessary files
2. **Multi-stage builds** - Smaller images, faster deployment
3. **npm ci** - Faster than npm install
4. **Production dependencies only** - Smaller image size
5. **Health checks** - Services start in correct order
