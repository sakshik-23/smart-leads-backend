Smart Leads CRM Portal

A secure, full-stack lead management platform designed to organize sales pipelines, trace conversion metrics, and manage user roles.

🌟 Key Features

1. Role-Based Security: User authentication via JWT and Spring Security separating Admin (full CRUD + delete) and Sales User (manage assigned leads only) profiles.

2. Lead Tracking: Complete management of lead pipelines (Name, Email, Status, Source, and Creation/Update timestamps).
3. Advanced Filters: Dynamic searching, column sorting, server-side pagination, and debounced search inputs.
4. Modern Dashboard: React-based UI with conversion metrics computation, dark/light mode toggle, and one-click CSV export.
   
🛠️ Technology Stack

Backend: Java 17, Spring Boot, Spring Security (JWT), Spring Data JPA, Hibernate, MySQL.
Frontend: React.js, Vite, Tailwind CSS, Axios, Lucide Icons.
Hosting/Deploy: Render (App), Aiven (MySQL Cloud DB), Docker.
