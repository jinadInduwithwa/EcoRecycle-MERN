# Project Documentation

## Prerequisites
Ensure the following are installed on your system:
- Node.js (v16.0.0 or higher)
- MongoDB (local instance or cloud service like Atlas)
- npm or yarn (package manager)

## Installation Steps
1. Clone the Repository: `https://github.com/jinadInduwithwa/EcoRecycle-MERN.git` then `cd EcoRecycle-MERN`.
2. Install Dependencies: `npm install`.
3. Set Up Environment Variables: Create a `.env` file in the root directory and add the following variables:
   ```env
   PORT=5100
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUD_NAME=your_cloudinary_cloud_name
   CLOUD_API_KEY=your_cloudinary_api_key
   CLOUD_API_SECRET=your_cloudinary_api_secret
   NODE_ENV=development
   ```
4. Start the Application: `npm run dev`.

## API Endpoints

**Base URL:** `http://localhost:<port>/api/v1/`

### Authentication
| Method | Endpoint                      | Description                     |
|--------|-------------------------------|---------------------------------|
| POST   | `/signup`                     | User registration               |
| POST   | `/signin`                     | User login                      |
| POST   | `/signout`                    | User logout                     |
| PATCH  | `/send-verification-code`     | Send email verification code    |
| PATCH  | `/verify-verification-code`   | Verify user code                |
| PATCH  | `/send-forgot-password-code`  | Send password reset code        |
| PATCH  | `/verify-forgot-password-code`| Verify password reset code      |
| PATCH  | `/change-password`            | Update user password            |
| GET    | `/admin`                      | Admin authentication check      |

### User Management (Admin Only)
| Method | Endpoint          | Description               |
|--------|-------------------|---------------------------|
| GET    | `/users`          | List all users            |
| GET    | `/users/:id`      | Get user by ID            |
| PATCH  | `/user/:id`       | Update user details       |
| DELETE | `/user/:id`       | Delete user               |

### Waste Collection
| Method | Endpoint                              | Description                        |
|--------|--------------------------------------|------------------------------------|
| POST   | `/waste/addCollectedWaste`          | Add collected waste               |
| GET    | `/waste/retriveCollectedWaste`      | Retrieve all collected waste      |
| GET    | `/waste/retriveSpecificCollectedWaste/:id` | Retrieve specific waste |
| PUT    | `/waste/updateCollectedWaste/:id`   | Update waste entry                |
| DELETE | `/waste/deleteWaste/:id`            | Delete waste entry                |

### Route Management
| Method | Endpoint                              | Description                        |
|--------|--------------------------------------|------------------------------------|
| POST   | `/routePath/addRoutePath`           | Add a new route                   |
| GET    | `/routePath/retriveRoutePath`       | Retrieve all routes               |
| GET    | `/routePath/retriveSpecificRoutePath/:id` | Retrieve a specific route |
| PUT    | `/routePath/updateRoutePath/:id`    | Update a route                    |
| DELETE | `/routePath/deleteRoutePath/:id`    | Delete a route                    |

### Request Management
| Method | Endpoint                              | Description                        |
|--------|--------------------------------------|------------------------------------|
| GET    | `/request/retriveRequest`           | Retrieve all requests             |
| PUT    | `/request/updateRequestStatus/:id`  | Update request status             |
| GET    | `/request/retrieveSpecificRequest/:id` | Retrieve a specific request |

### Vehicle Management
| Method | Endpoint                              | Description                        |
|--------|--------------------------------------|------------------------------------|
| POST   | `/vehicle/addVehicle`               | Add a new vehicle                 |
| GET    | `/vehicle/retrivevehicles`          | Retrieve all vehicles             |
| GET    | `/vehicle/retriveSpecificVehicle/:id` | Retrieve a specific vehicle   |
| PUT    | `/vehicle/updatevehicle/:id`        | Update vehicle details            |
| DELETE | `/vehicle/deleteVehicle/:id`        | Delete a vehicle                  |

### Payments
| Method | Endpoint        | Description                  |
|--------|----------------|------------------------------|
| POST   | `/payments/`   | Create a new payment        |
| GET    | `/payments/`   | Retrieve all payments       |

### Timetable Management
| Method | Endpoint                 | Description                      |
|--------|--------------------------|----------------------------------|
| GET    | `/timetable/`            | Retrieve all timetable entries  |
| POST   | `/timetable/`            | Create a new timetable entry    |
| GET    | `/timetable/:id`         | Retrieve a single timetable entry |
| PATCH  | `/timetable/:id`         | Update a timetable entry        |
| DELETE | `/timetable/:id`         | Delete a timetable entry        |


## Contributing
Feel free to fork this repository, create new features, fix bugs, and submit pull requests.

## License
This project is licensed under the MIT License.

