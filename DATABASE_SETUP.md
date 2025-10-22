# MySQL Database Migration Guide

This guide explains how to migrate RNCFleets from localStorage to MySQL database.

## 📋 Prerequisites

- MySQL installed locally or access to MySQL RDS on AWS
- MySQL Workbench (for running SQL scripts)
- Node.js 18+ installed

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pnpm install
# or
npm install
```

This will install `mysql2` package for database connectivity.

### 2. Set Up MySQL Database

#### Option A: Local MySQL

1. Open MySQL Workbench
2. Connect to your local MySQL server
3. Create database:
   ```sql
   CREATE DATABASE fleetdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

#### Option B: AWS RDS

1. Create an RDS MySQL instance in AWS Console
2. Configure security groups to allow connections
3. Note the endpoint URL, username, and password

### 3. Run Database Scripts

In MySQL Workbench:

1. **Create Schema** - Open and execute `database/schema.sql`
   - This creates all tables (companies, admins, vehicles, etc.)

2. **Seed Data** - Open and execute `database/seed-data.sql`
   - This adds 10 companies, 100 vehicles, and sample data

### 4. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` with your database credentials:

   **For Local MySQL:**
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=fleetdb
   DB_PORT=3306
   DB_SSL=false
   ```

   **For AWS RDS:**
   ```env
   DB_HOST=your-instance.region.rds.amazonaws.com
   DB_USER=admin
   DB_PASSWORD=your_secure_password
   DB_NAME=fleetdb
   DB_PORT=3306
   DB_SSL=true
   ```

### 5. Test Database Connection

1. Start the development server:
   ```bash
   pnpm dev
   ```

2. Open http://localhost:3000/test-db in your browser

3. You should see:
   - ✅ Connection Successful message
   - Company count, Admin count, Vehicle count
   - Sample data from the database

If you see an error, check:
- MySQL is running
- `.env.local` has correct credentials
- Database and tables exist
- Dev server was restarted after changing `.env.local`

## 📁 File Structure

```
lib/
  db.ts                          # MySQL connection pool
app/
  api/
    vehicles/route.ts            # GET/POST vehicles
    companies/route.ts           # GET/POST companies
    admins/route.ts              # GET/POST admins
  test-db/
    page.tsx                     # Database connection test page
database/
  schema.sql                     # Table definitions
  seed-data.sql                  # Sample data (10 sets)
.env.example                     # Environment variables template
.env.local                       # Your local config (create this)
```

## 🔌 API Endpoints

### Vehicles
- `GET /api/vehicles` - Fetch all vehicles
- `GET /api/vehicles?company_id=xxx` - Filter by company
- `POST /api/vehicles` - Create new vehicle

### Companies
- `GET /api/companies` - Fetch all companies
- `POST /api/companies` - Create new company

### Admins
- `GET /api/admins` - Fetch all admins
- `GET /api/admins?company_id=xxx` - Filter by company
- `POST /api/admins` - Create new admin

## 🔄 Migrating Existing Pages

To migrate a page from localStorage to MySQL:

### Before (localStorage):
```typescript
const vehicles = JSON.parse(localStorage.getItem('fleet_vehicles') || '[]')
```

### After (MySQL):
```typescript
const res = await fetch('/api/vehicles?company_id=' + companyId)
const { data: vehicles } = await res.json()
```

## 🔐 Security Notes

⚠️ **Important for Production:**

1. **Hash Passwords** - The current admin password storage is plain text. Use `bcrypt`:
   ```typescript
   import bcrypt from 'bcryptjs'
   const hashedPassword = await bcrypt.hash(password, 10)
   ```

2. **Use SSL for RDS** - Enable SSL and use proper certificates:
   ```typescript
   ssl: {
     ca: fs.readFileSync('./rds-ca-bundle.pem')
   }
   ```

3. **Environment Variables** - Never commit `.env.local` to git!

4. **SQL Injection** - All queries use parameterized statements (✅ already safe)

## 📊 Database Schema Overview

### Main Tables
- `companies` - Fleet management companies
- `admins` - Admin users per company
- `vehicles` - Fleet vehicles
- `services` - Service types
- `maintenance_records` - Service history
- `service_requests` - Pending service requests
- `service_reminders` - Upcoming service reminders
- `team_users` - Team members per company

## 🧪 Testing

```bash
# Local development
pnpm dev
# Visit http://localhost:3000/test-db

# Production build test
pnpm build
pnpm start
# Visit http://localhost:3000/test-db
```

## 🚀 Deployment to EC2

1. **Upload .env.local** to EC2:
   ```bash
   scp .env.local ec2-user@your-instance:/path/to/app/.env.local
   ```

2. **Or set environment variables** on EC2:
   ```bash
   export DB_HOST=your-rds-endpoint.rds.amazonaws.com
   export DB_USER=admin
   export DB_PASSWORD=your_password
   export DB_NAME=rncfleets
   export DB_SSL=true
   ```

3. **Install and build**:
   ```bash
   pnpm install
   pnpm build
   pnpm start
   ```

## 📝 Sample Data

The seed script creates:
- ✅ 10 Companies
- ✅ 11 Admins (1 superadmin + 10 company admins)
- ✅ 100 Vehicles (10 per company)
- ✅ 100 Services
- ✅ 100 Maintenance Records
- ✅ 100 Service Requests
- ✅ 100 Service Reminders
- ✅ 50 Team Users

All passwords are: `admin123` (change in production!)

## 🆘 Troubleshooting

### "Cannot find module 'mysql2'"
```bash
pnpm install mysql2
```

### "Connection refused"
- Check MySQL is running: `mysql -u root -p`
- Check port 3306 is not blocked

### "Access denied for user"
- Verify username/password in `.env.local`
- Grant permissions: `GRANT ALL ON fleetdb.* TO 'user'@'%';`

### "Unknown database 'fleetdb'"
- Create database: `CREATE DATABASE fleetdb;`
- Run schema.sql

### Changes to .env.local not working
- Restart dev server (Ctrl+C, then `pnpm dev`)

## 📚 Next Steps

1. ✅ Test database connection at `/test-db`
2. 🔄 Migrate dashboard pages from localStorage to API calls
3. 🔐 Implement proper authentication
4. 📊 Add more API endpoints (maintenance, services, etc.)
5. 🚀 Deploy to production with RDS

---

Need help? Check the error logs in terminal or browser console.
