# Database Schema Diagram

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         USER (Core User Entity)                          │
├─────────────────────────────────────────────────────────────────────────┤
│ • id (BigInt, PK)                                                       │
│ • username (String)                                                     │
│ • email (String, UNIQUE)                                                │
│ • password (String)                                                     │
│ • role (String, default: "USER")                                        │
│ • createdAt (DateTime, auto)                                            │
└─────────────────────────────────────────────────────────────────────────┘
             │                                    │
             │ (1:1)                              │ (1:N)
             ▼                                    ▼
    ┌─────────────────┐                 ┌──────────────────┐
    │      CART       │                 │      ORDER       │
    ├─────────────────┤                 ├──────────────────┤
    │ • id (BigInt)   │                 │ • id (BigInt)    │
    │ • userId (FK)   │────────┐        │ • userId (FK)    │
    └─────────────────┘        │        │ • total (Decimal)│
             │                 │        │ • status (String)│
             │ (1:N)           │        │ • createdAt (DT) │
             ▼                 │        └──────────────────┘
    ┌─────────────────┐        │                 │
    │   CART_ITEM     │        │                 │ (1:N)
    ├─────────────────┤        │                 ▼
    │ • cartId (FK)   ├────────┤        ┌──────────────────┐
    │ • productId(FK) │        │        │   ORDER_ITEM     │
    │ • quantity (Int)│        │        ├──────────────────┤
    └─────────────────┘        │        │ • orderId (FK)   │
             │                 │        │ • productId (FK) │
             │ (M:1)           │        │ • quantity (Int) │
             ▼                 │        │ • priceAtPurchase│
    ┌─────────────────┐        │        └──────────────────┘
    │    PRODUCT      │◄───────┤                 │
    ├─────────────────┤        │                 │ (M:1)
    │ • id (BigInt)   │        │                 │
    │ • productName   │        └─────────────────┘
    │ • stock (Int)   │
    │ • price (Decimal)
    └─────────────────┘
```

## Table Relationships

### User
- **Primary Key**: `id`
- **Relationships**:
  - `1:1` with Cart (one user has one cart)
  - `1:N` with Order (one user can have multiple orders)

### Cart
- **Primary Key**: `id`
- **Foreign Keys**: `userId` (references User)
- **Relationships**:
  - `1:N` with CartItem (one cart has many items)

### CartItem
- **Composite Primary Key**: `[cartId, productId]`
- **Foreign Keys**: 
  - `cartId` (references Cart, cascades on delete)
  - `productId` (references Product, cascades on delete)

### Product
- **Primary Key**: `id`
- **Relationships**:
  - `1:N` with CartItem
  - `1:N` with OrderItem

### Order
- **Primary Key**: `id`
- **Foreign Keys**: `userId` (references User, cascades on delete)
- **Relationships**:
  - `1:N` with OrderItem

### OrderItem
- **Composite Primary Key**: `[orderId, productId]`
- **Foreign Keys**:
  - `orderId` (references Order, cascades on delete)
  - `productId` (references Product)

## Key Features

✅ **Cascade Deletes**: When a User is deleted, their Cart and Orders are automatically deleted  
✅ **Unique Constraints**: Email is unique per user  
✅ **Decimal Precision**: Prices stored with 10 digits, 2 decimal places  
✅ **Automatic Timestamps**: `createdAt` fields auto-populated  
✅ **Auto-increment IDs**: All primary keys use BigInt with auto-increment  

## Database Initialization

Run these commands to initialize the database:

```bash
# 1. Start PostgreSQL container
docker-compose up -d

# 2. Apply migrations
npx prisma migrate dev --name init

# 3. View data in Prisma Studio
npx prisma studio
```
