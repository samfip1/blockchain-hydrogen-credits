Producers Backend API
This is the backend API for a platform designed to connect producers with a system for managing plants, claims, and subsidies. The API currently handles user authentication (signup/signin) and initial resource management (adding a new plant).

Technologies Used
Node.js: The server-side runtime environment.

Express.js: The web framework for building the API.

TypeScript: The language used for development, providing static typing.

Prisma ORM: A modern database toolkit for interacting with the database.

PostgreSQL: The database used to store application data.

bcryptjs: For securely hashing and comparing user passwords.

jsonwebtoken: For creating and verifying JWTs for authentication.

cors: Middleware to enable Cross-Origin Resource Sharing.

cookie-parser: Middleware to parse cookies attached to the client request.

Project Structure
The project follows a modular structure to keep the code organized:

src/controller/: Contains the core authentication logic (Signup & Signin).

src/middleware/: Houses reusable middleware functions, such as for authentication.

src/services/: Contains the logic for specific business services, like managing plants.

prisma/: The directory for the Prisma schema and migrations.

dist/: The output directory for compiled TypeScript files.

API Endpoints
All API endpoints are prefixed with /p.

User Authentication
POST /p/signup

Description: Creates a new company account, a default plant, and a fake bank account.

Request Body:

Field

Type

Description

name

string

The unique name of the company.

email

string

The unique email address for the company.

password

string

The password for the company's account.

stateName

string

The name of the Indian state where the company is located. Must be one of the 28 predefined states.

city

string

The city where the company is located.

bank

string

The name of the bank for the company's account. Must be one of the pre-approved banks from the list.

POST /p/signin

Description: Authenticates a company and returns a JWT in an HTTP-only cookie.

Request Body:

{
  "email": "string",
  "password": "string"
}

POST /p/logout

Description: Clears the authentication token cookie to log the user out.

GET /p/profile

Description: Fetches the profile details of the authenticated company.

Authentication: Requires a valid JWT in the request cookie.

Plant Management
POST /p/plants/

Description: Creates a new plant associated with the authenticated company.

Authentication: Requires a valid JWT in the request cookie.

Request Body:

{
  "name": "string",
  "stateName": "string",
  "city": "string"
}

Setup Instructions
Clone the repository:

git clone <repository_url>
cd <repository_name>

Install dependencies:

npm install

Set up environment variables:
Create a .env file in the root directory with the following variables:

DATABASE_URL="your_postgresql_connection_string"
SECRET_KEY="your_secret_key"

The DATABASE_URL should connect to a PostgreSQL database (e.g., from Neon.tech).

Run database migrations:

npx prisma migrate dev --name init

Start the server:

npm run dev

The server will run on http://localhost:3012.