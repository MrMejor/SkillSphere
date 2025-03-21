# SkillSphere (Online Learning Platform)

Welcome to the **Online Learning Platform**! This project is designed to facilitate interactions between **Teachers**, **Students**, and **Admins** in an educational environment. Teachers can create and share content, Students can subscribe and interact with the content, and Admins can manage the platform.

---

## Table of Contents
1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Class Diagram](#class-diagram)
4. [Flow Diagram](#flow-diagram)
5. [Setup Instructions](#setup-instructions)
6. [Usage](#usage)
7. [License](#license)

---

## Features
- **User Roles**:
  - **Teachers**: Can create posts, upload videos, and receive payments from students.
  - **Students**: Can subscribe to teachers, like and comment on posts, and make payments.
  - **Admins**: Can manage users, approve posts, and handle payments.

- **Content Management**:
  - Teachers can create **Posts** and upload **Videos**.
  - Students can view, like, and comment on posts and videos (if subscribed).

- **Payment System**:
  - Students can subscribe to teachers by making payments.
  - Admins can handle and manage payment records.

- **User Management**:
  - Admins can manage user accounts (Teachers, Students, and Admins).

---

## Technologies Used
- **Backend**: Java (Spring Boot)
- **Frontend**: Angular (optional, if applicable)
- **Database**: MySQL/PostgreSQL
- **API Documentation**: Swagger/OpenAPI
- **Version Control**: Git/GitHub
- **Diagram Tools**: Draw.io (for class and flow diagrams)

---

## Class Diagram
The class diagram represents the structure of the system, including the relationships between classes like `User`, `Teacher`, `Student`, `Admin`, `Post`, `Video`, `Payment`, and `Comment`.

![Class Diagram](Final_Class_Diagram.drawio.png)

---

## Flow Diagram
The flow diagram illustrates the sequence of actions and interactions between users and the system, including user registration, content creation, subscription, and admin actions.

![Flow Diagram](Flow_Diagram.drawio.png)

---

## Setup Instructions
Follow these steps to set up the project locally:

### Prerequisites
- Java Development Kit (JDK) 17 or higher
- MySQL/PostgreSQL database
- Maven (for dependency management)
- Git (for version control)

---

## Usage
- **Teachers**:
  - Log in and create posts or upload videos.
  - View payments received from students.

- **Students**:
  - Log in and subscribe to teachers.
  - Like and comment on posts.
  - View videos (if subscribed).

- **Admins**:
  - Log in and manage users, approve posts, and handle payments.

---

## License
This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---
