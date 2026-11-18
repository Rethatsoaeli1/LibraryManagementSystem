\# Library Management System



\## Project Overview



The Library Management System is a web-based application developed to help manage library operations efficiently. It allows administrators to manage books and users, monitor book availability, record borrowing and returning transactions, and view library activities through a dashboard.



The system uses React for the frontend, Express.js for the backend, and MySQL for database management.



\## Technologies Used



\### Frontend

\- React.js

\- JavaScript (JSX)

\- CSS

\- React Hooks (useState and useEffect)

\- React Router

\- Fetch API



\### Backend

\- Node.js

\- Express.js

\- RESTful API

\- CORS

\- Express JSON middleware

\- JWT authentication

\- bcryptjs for password hashing



\### Database

\- MySQL



\## Main Features



\### 1. Dashboard

\- Displays library statistics.

\- Shows total books and available quantities.

\- Displays borrowing information.

\- Highlights books with low stock (fewer than 2 copies).



\### 2. Book Management

\- Add new books.

\- View available books.

\- Update book information.

\- Delete books.

\- Manage book quantities.



\### 3. Transaction Management

\- Borrow books.

\- Return books.

\- Add new stock.

\- Deduct stock.

\- View transaction history.

\- Automatically update book quantities.



\### 4. User Management

\- Register new users.

\- Update user information.

\- Delete users.

\- Manage Admin and Member roles.

\- Authenticate users through login.



\### 5. Security

\- Password hashing using bcryptjs.

\- JWT-based authentication.

\- Role-based authorization.

\- Protected backend routes.



\## Project Structure



```text

LibraryManagementSystem/

│

├── frontend/

│   ├── src/

│   │   ├── components/

│   │   ├── pages/

│   │   ├── App.jsx

│   │   └── ...

│   ├── package.json

│   └── vite.config.js

│

├── backend/

│   ├── config/

│   │   └── db.js

│   ├── middleware/

│   ├── routes/

│   ├── server.js

│   ├── createAdmin.js

│   ├── package.json

│   └── .env.example

│

└── README.md

```



\## Database



The system uses MySQL with a database named `library\_management`.



The database contains three main tables:



\- \*\*users:\*\* Stores user information and authentication details.

\- \*\*books:\*\* Stores book details and available quantities.

\- \*\*transactions:\*\* Records borrowing, returning, and stock management activities.



\## Installation and Setup



\### Prerequisites



Install the following:

\- Node.js

\- MySQL Server

\- Git



\### 1. Clone the Repository



```bash

git clone https://github.com/Rethatsoaeli1/LibraryManagementSystem.git

```



Navigate into the project:



```bash

cd LibraryManagementSystem

```



\### 2. Set Up the Backend



```bash

cd backend

npm install

```



Create a `.env` file in the backend folder using `.env.example` as a guide.



Configure your MySQL connection details and JWT secret in the `.env` file.



Create the MySQL database:



```sql

CREATE DATABASE library\_management;

```



Create the required database tables using the project's database schema.



Start the backend:



```bash

node server.js

```



The backend runs on port 5000 by default.



\### 3. Set Up the Frontend



Open another terminal:



```bash

cd frontend

npm install

npm run dev

```



Open the local development URL displayed in the terminal, usually:



`http://localhost:5173`



\## API Routes



| Method | Endpoint | Description |

|---|---|---|

| GET | /api/books | Retrieve books |

| POST | /api/books | Add a book |

| PUT | /api/books/:id | Update a book |

| DELETE | /api/books/:id | Delete a book |

| GET | /api/users | Retrieve users |

| POST | /api/users | Add a user |

| PUT | /api/users/:id | Update a user |

| DELETE | /api/users/:id | Delete a user |

| POST | /api/auth/login | Authenticate users |

| GET | /api/transactions | Retrieve transactions |

| POST | /api/transactions | Record a transaction |



\## Project Objective



The main objective of this project is to demonstrate the development of a full-stack web application using React, Express.js, and MySQL. It applies CRUD operations, database integration, API communication, authentication, authorization, and responsive user interface design.



\## Author



Library Management System





