#!/bin/bash

echo "=========================================="
echo "🔍 Production Server Diagnostic Tool"
echo "=========================================="
echo ""

# 1. Check .env file
echo "1️⃣ Checking .env file..."
if [ -f "/www/wwwroot/webmadrasah/.env" ]; then
  echo "   ✅ .env exists"
  echo "   📄 Content (hiding secrets):"
  grep -E "^(DATABASE_URL|DIRECT_URL|AUTH_SECRET)=" /www/wwwroot/webmadrasah/.env | sed 's/=.*$/= ***MASKED***/'
else
  echo "   ❌ .env NOT FOUND at /www/wwwroot/webmadrasah/.env"
  echo "   ⚠️  Copy from backup or recreate!"
fi

echo ""

# 2. Check PM2 process
echo "2️⃣ Checking PM2 process..."
cd /www/wwwroot/webmadrasah
if command -v pm2 &> /dev/null; then
  pm2 list | grep webmadrasah || echo "   ❌ PM2 process 'webmadrasah' not found"
  echo "   📊 PM2 Status:"
  pm2 status webmadrasah 2>/dev/null || echo "   No PM2 process"
else
  echo "   ❌ PM2 not installed"
fi

echo ""

# 3. Check application logs
echo "3️⃣ Checking application logs (last 20 lines)..."
if pm2 logs webmadrasah --lines 20 2>/dev/null; then
  echo "   ✅ Logs shown above"
else
  echo "   ⚠️  Could not fetch PM2 logs"
  echo "   Trying direct log file..."
  ls -la /www/wwwroot/webmadrasah/.pm2/logs/ 2>/dev/null || echo "   No PM2 logs directory"
fi

echo ""

# 4. Test database connection
echo "4️⃣ Testing database connection..."
if [ -f "/www/wwwroot/webmadrasah/.env" ]; then
  source /www/wwwroot/webmadrasah/.env
  if [ -n "$DATABASE_URL" ]; then
    echo "   Testing with DATABASE_URL (masked)..."
    cd /www/wwwroot/webmadrasah
    npx prisma migrate status 2>&1 | head -15 || echo "   ❌ Database connection failed"
  else
    echo "   ❌ DATABASE_URL not set in .env"
  fi
else
  echo "   ⏸️  Skipping (no .env)"
fi

echo ""

# 5. Check if application can start
echo "5️⃣ Checking if application starts..."
cd /www/wwwroot/webmadrasah
if [ -f "package.json" ]; then
  echo "   Package.json exists ✓"
  if command -v node &> /dev/null; then
    node --version
    echo "   Testing: npm run build (quick test)..."
    timeout 60 npm run build 2>&1 | tail -20 || echo "   ⚠️  Build test failed or timeout"
  else
    echo "   ❌ Node.js not found"
  fi
else
  echo "   ❌ package.json not found"
fi

echo ""
echo "=========================================="
echo "📋 Diagnostic Complete"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Fix any issues identified above"
echo "2. Ensure .env has DATABASE_URL, DIRECT_URL, AUTH_SECRET"
echo "3. Run: npm run setup:prod if first deployment"
echo "4. Restart PM2: pm2 restart webmadrasah"
echo ""
