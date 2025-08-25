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


### **Step 1: Clone the Repository**

git clone https://github.com/psycopathic/S2S_MVP.git<br/>
cd S2S_MVP

### **Step 2: Create a database table**

1. use services like neondb and create a postgres database<br/>
*go to editor and write the sql queries from S2S_MVP > backend > models > schema.sql<br/>
2. use docker<br/>
   ==> pull and run postgresql<br/>
        =>docker pull postgres<br/>
        =>docker run --name s2s-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e     POSTGRES_DB=s2sdb -p 5432:5432 -d postgres<br/>
   ==> Connect to the database:<br/>
        => psql -h localhost -U postgres -d s2sdb<br/>
   ==> run schema <br/>
        =>  backend/models/schema.sql<br/>

### **Step 3: start the application**
1. cd backend<br/>
    1. npm i (to install the the dependency)<br/>
    2. npm run dev (to start the backend)<br/>

2. cd frontend
    1. npm i (to install dependency)<br/>
    2. npm run dev (to start the frontend)<br/>


### **My understanding and how the system works**
1. I understand this project as a someonwe who is making entry of an affiliate along with a campaign,<br/>
   I tried to make relation of affiliate and campaign using clicks so that i can keep the track of campaign associated with the affiliates.
   basically creating the relationship was bit overwelming for me


### **Example of routes**
1. Affilate Routes

GET /affiliate/get ==> to find all the affiliates <br/>
GET /affiliate/:id ==> to find affiliate by its id <br/>
POST /affiliate/ ==> to create new affiliate <br/>

2. Campaign Routes 

GET /campaign / ==> to get all the campaigns present <br/>
POST /campaign / ==> to create a campaign <br/>

3. Click routes

GET /clicks/ ==> to track the click for affiliate for any campign <br/>

4. postback routes
 
GET /postback/ ==> to handle postback 


 
