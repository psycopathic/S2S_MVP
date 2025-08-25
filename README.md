# S2S_MVP

## \*\*1. System Overview

### **What is a Postback?**

A **postback** is a server to server notification mechanism commonly used in affiliate marketing.When a conversion (like a sale or sign-up) happens, the advertiser’s server sends a request (postback) to the affiliate’s server, ensuring **accurate, cookie-less conversion tracking**.

### **Key Features**

- **Affiliate & Campaign Management** (Create, fetch affiliates & campaigns)
- **Click Tracking** (Logs unique clicks per affiliate & campaign)
- **Conversion Tracking via Postback URL** (Triggered when a conversion is confirmed)
- **Data Retrieval APIs** (Retrieve clicks & conversions for affiliates)

---

## **2. Running the Project Locally**

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [PostgreSQL](https://www.postgresql.org/) (v14+ recommended)
- [npm](https://www.npmjs.com/)

### **Step 1: Clone the Repository**

git clone https://github.com/psycopathic/S2S_MVP.git
cd S2S_MVP

### **Step 2: Create a database table**

1. use services like neondb and create a postgres database
*go to editor and write the sql queries from S2S_MVP > backend > models > schema.sql
2. use docker
   ==> pull and run postgresql
        =>docker pull postgres
        =>docker run --name s2s-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e     POSTGRES_DB=s2sdb -p 5432:5432 -d postgres
   ==> Connect to the database:
        => psql -h localhost -U postgres -d s2sdb
   ==> run schema 
        =>  backend/models/schema.sql

### **Step 3: start the application**
1. cd backend
    ==> npm i (to install the the dependency)
    ==> npm run dev (to start the backend)

2. cd frontend
    ==> npm i (to install dependency)
    ==> npm run dev (to start the frontend)



