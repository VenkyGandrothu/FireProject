# Prisma Setup Guide for NikaloSafe Backend

This guide explains how to set up and use Prisma ORM in your NikaloSafe backend project.

## 🚀 What's Been Added

### 1. Prisma Dependencies
- `@prisma/client` - The Prisma client for database operations
- `prisma` - The Prisma CLI for database management

### 2. Prisma Configuration
- `prisma/schema.prisma` - Database schema definition
- `src/config/prisma.js` - Prisma client configuration
- `env.example` - Environment variables template

### 3. Example Models and Controllers
- `src/models/customerModelPrisma.js` - Customer model using Prisma
- `src/models/buildingModelPrisma.js` - Building model using Prisma
- `src/controllers/customerControllerPrisma.js` - Example controller using Prisma

## 📋 Setup Instructions

### 1. Environment Configuration
Create a `.env` file in the backend root directory with your database credentials:

```env
# Database Configuration
DB_USER=your_db_user
DB_HOST=localhost
DB_NAME=your_db_name
DB_PASSWORD=your_db_password
DB_PORT=5432

# Prisma Database URL
DATABASE_URL="postgresql://your_db_user:your_db_password@localhost:5432/your_db_name?schema=core"
```

### 2. Database Schema
The Prisma schema includes all your existing models:
- Customer
- Building
- CustomerBuilding (relationship)
- Floor
- QRCode
- PhysicalSensor
- VirtualSensor
- ExitPath
- LinkedQrPath (junction table)

### 3. Generate Prisma Client
```bash
npm run db:generate
```

### 4. Push Schema to Database (for development)
```bash
npm run db:push
```

### 5. Create and Apply Migrations (for production)
```bash
npm run db:migrate
```

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema changes to database (development) |
| `npm run db:pull` | Pull database schema to Prisma |
| `npm run db:migrate` | Create and apply migrations |
| `npm run db:migrate:deploy` | Deploy migrations to production |
| `npm run db:migrate:reset` | Reset database and apply all migrations |
| `npm run db:studio` | Open Prisma Studio (database GUI) |

## 📚 Usage Examples

### Basic CRUD Operations

```javascript
import prisma from '../config/prisma.js';

// Create a customer
const customer = await prisma.customer.create({
  data: {
    customer_name: 'John Doe',
    customer_email: 'john@example.com',
    customer_phone: '+1234567890',
  },
});

// Find all customers
const customers = await prisma.customer.findMany({
  orderBy: { customer_id: 'desc' },
});

// Find customer with buildings
const customerWithBuildings = await prisma.customer.findUnique({
  where: { customer_id: 1 },
  include: {
    customerBuildings: {
      include: {
        building: true,
      },
    },
  },
});

// Update customer
const updatedCustomer = await prisma.customer.update({
  where: { customer_id: 1 },
  data: { customer_name: 'Jane Doe' },
});

// Delete customer
const deletedCustomer = await prisma.customer.delete({
  where: { customer_id: 1 },
});
```

### Complex Queries with Relations

```javascript
// Get building with all floors and sensors
const building = await prisma.building.findUnique({
  where: { building_id: 1 },
  include: {
    floors: {
      include: {
        physicalSensors: true,
        virtualSensors: true,
        qrCodes: true,
        exitPaths: {
          include: {
            linkedQrPaths: {
              include: {
                qrCode: true,
              },
            },
          },
        },
      },
    },
  },
});
```

## 🔄 Migration from Raw SQL

### Before (Raw SQL)
```javascript
import { query } from "../config/db.js";

export async function createCustomer({ name, email, phonenumber }) {
  const sql = `
    INSERT INTO customer (customer_name, customer_email, customer_phone)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [name, email, phonenumber];
  const result = await query(sql, values);
  return result.rows[0];
}
```

### After (Prisma)
```javascript
import prisma from '../config/prisma.js';

export async function createCustomer({ name, email, phonenumber }) {
  const customer = await prisma.customer.create({
    data: {
      customer_name: name,
      customer_email: email,
      customer_phone: phonenumber,
    },
  });
  return customer;
}
```

## 🎯 Benefits of Using Prisma

1. **Type Safety** - Full TypeScript support with auto-generated types
2. **IntelliSense** - Better IDE support with autocomplete
3. **Relations** - Easy handling of database relationships
4. **Migrations** - Version-controlled database schema changes
5. **Query Builder** - Intuitive API for complex queries
6. **Performance** - Optimized queries and connection pooling
7. **Developer Experience** - Prisma Studio for database management

## 🔧 Prisma Studio

Access Prisma Studio to visually manage your database:
```bash
npm run db:studio
```

This opens a web interface where you can:
- View and edit data
- Run queries
- Manage relationships
- Import/export data

## 📝 Next Steps

1. **Update Environment Variables** - Set up your `.env` file with actual database credentials
2. **Run Initial Migration** - Use `npm run db:migrate` to create your database schema
3. **Update Controllers** - Gradually migrate your existing controllers to use Prisma
4. **Test Queries** - Use Prisma Studio to test your database operations
5. **Add Seed Data** - Create a seed script to populate your database with test data

## 🚨 Important Notes

- The existing raw SQL models are still functional and can be used alongside Prisma
- Prisma client is generated in `src/generated/prisma/` directory
- All models use the `core` schema as specified in your existing setup
- The Prisma client handles connection pooling automatically
- Remember to run `npm run db:generate` after schema changes

## 🆘 Troubleshooting

### Common Issues

1. **Connection Error**: Check your `DATABASE_URL` in `.env` file
2. **Schema Mismatch**: Run `npm run db:push` to sync schema
3. **Client Not Generated**: Run `npm run db:generate`
4. **Migration Issues**: Use `npm run db:migrate:reset` to start fresh

### Getting Help

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Prisma Discord](https://pris.ly/discord)
- [Prisma GitHub](https://github.com/prisma/prisma)
