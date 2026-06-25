# Smart Leads Dashboard

A full-stack enterprise lead management dashboard designed to manage sales pipelines. Built using **Java Spring Boot**, **MySQL**, and **ReactJS** (with Tailwind CSS v4). It features JWT authentication, advanced dynamic filtering with JPA Specifications, role-based access control, CSV export capabilities, and dark/light modes.

---

## 🌟 Key Features

### 🔒 1. Authentication System
* **Secure Registration & Login:** Password encoding via BCrypt and verification.
* **JWT Token Security:** Stateless JWT-based authentication filter validating headers on protected endpoints.
* **Role-Based Profiles:** Support for two roles:
  * **Admin:** Complete CRUD operations, system-wide metrics, and lead deletion capabilities.
  * **Sales User:** Ability to create/update leads and view/manage only their assigned leads.

### 💼 2. Leads Management & CRUD
* **Database Modeling:** Standardized Lead fields (`Name`, `Email`, `Status`, `Source`, `CreatedAt`, `UpdatedAt`) linked to a user owner.
* **Leads Board:** View list details and access a modal to quickly add or edit leads.

### 🔍 3. Advanced Filtering, Search & Sorting
* **Dynamic Specifications:** Spring Data JPA Specifications combining multiple filter selections (Status, Source, Search queries).
* **Debounced Search:** Frontend input field only fires API requests 500ms after the user stops typing, reducing server load.
* **Sorting & Pagination:** Modern pagination returning metadata response (page, size, total elements, total pages) and column sorting.

### 📊 4. Interactive Dashboard UI
* **High-fidelity Aesthetics:** Modern grid cards computing key conversion metrics (Total Leads, New, Contacted, Qualified, Lost, and Conversion Rate).
* **CSV Export:** Downloads the filtered lead list in CSV format.
* **Dark Mode Theme:** Instant client-side dark/light toggle persisting state.

---

## 🛠️ Technology Stack

* **Backend:** Java 17, Spring Boot, Spring Security (JWT), Spring Data JPA, Hibernate, MySQL.
* **Frontend:** React.js (JavaScript), Vite, Tailwind CSS v4, Axios, Lucide Icons.
* **Containerization:** Docker, Docker Compose.

---

## 🚀 Setup & Installation (Local Development)

### Prerequisites
* **JDK 17** or higher installed.
* **Node.js (v18+)** and **npm** installed.
* **MySQL server** running locally.

---

### Step 1: Database Setup
1. Open your MySQL client (e.g. MySQL Workbench or Terminal).
2. Create the database:
   ```sql
   CREATE DATABASE smart_leads_db;
   ```

---

### Step 2: Backend Configuration
1. Open `src/main/resources/application.properties` and verify your credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/smart_leads_db
   spring.datasource.username=root
   spring.datasource.password=Admin@123
   ```
2. Start the Spring Boot backend service:
   * **Using Maven Wrapper:**
     ```bash
     ./mvnw spring-boot:run
     ```
   * **Via IDE:** Run `SmartLeadsBackendApplication.java` as a Spring Boot App.

The backend server runs on `http://localhost:8080`.

---

### Step 3: Frontend Configuration
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```

The frontend application runs on `http://localhost:5173`. Open it in your browser.

---

## 🐳 Docker Deployment

To spin up the entire application stack (MySQL Database, Backend, Frontend) with a single command:

1. Build and run containers in the root directory:
   ```bash
   docker-compose up --build
   ```
2. Access the services:
   * **Frontend Client:** `http://localhost:3000`
   * **Backend API:** `http://localhost:8080`
   * **MySQL DB Port:** `localhost:3306`

---

## 📝 API Endpoints Summary

### Authentication Routes (`/api/auth`)
* `POST /api/auth/register` - Registers a new user (`ADMIN` or `SALES`).
* `POST /api/auth/login` - Authenticates user and returns a signed JWT.

### Leads Routes (`/api/leads`) (Protected - Requires JWT)
* `POST /api/leads` - Creates a new lead record.
* `GET /api/leads` - Retrieves paginated, sorted, and filtered leads.
* `GET /api/leads/{id}` - Fetches a single lead record.
* `PUT /api/leads/{id}` - Updates a lead record.
* `DELETE /api/leads/{id}` - Deletes a lead record (Restricted to **Admin**).
* `GET /api/leads/export` - Exports the filtered lead list as a CSV file.
