# Final Team Project

## [Evergreen] <img width="91" height="78" alt="Screenshot 2026-04-26 at 7 38 09 PM" src="https://github.com/user-attachments/assets/94ebade2-dd1d-43eb-a7e1-f8a0721d0ee3" />

## Progress Report

### Completed Features
* Users see a branded welcome screen when launching the app
* Registered users can securely log into their account
* New users can create an account to access the application (existing user checks available)
* Users see an overview of their plant collection
* Explore Plants - Users can browse the complete plant database
* Add/Upload a Plant - Users can add plants from the database to their personal collection
* Schedule - Users can create, view, update, and delete plant care tasks (they can create tasks only for existing plants on their list)
* User Profile - Users can view their profile page with avatar and bio
* Image upload feature for plants - Users can upload photos when adding plants to their collection
* Users receive notifications when clicking "Remind Me" on tasks
* All user data, plants, and schedules are stored in a MySQL database
*  Users can delete plants from their collection
*  Selecting avatar - Users can choose from avatar images for their profile
*  Writing bio/updating bio - Users can write and edit their profile biography
*  Change password - Users can update their account password
*  Filter plants by difficulty, sun level, size - Users can filter plant search using multiple filter criteria
*  Search plants by typing - Users can type to search for specific plants by name
*  Users can add custom plants not found in the main database
*  Users can schedule care tasks for any plant in their collection
*  Users can use Evergreen offline
*  Users can install Evergreen


### Known Issues & Limitations
* Push notifications are only sent manually when users click the 'Remind Me' button.
* Problem B
* ...


## Authentication & Authorization
Evergreen uses token-based authentication with JSON Web Tokens (JWT). When a user logs in, the server generates a signed token containing the user's ID. This is then stored in HTTP-only cookie. All otherAPI requests that requires authentication are protected by a TokenMiddleware. 

Each user has a unique cryptographic salt and their password is hashed using bcrypt before storage in the MySQL database. 

Users can only access their own profile data, plant collections, and schedule entries. 

## PWA Capabilities
### Offline Functionality
- When offline, users can view their personal plant collection and previously loaded plant database content
- Add new schedule tasks (these are automatically saved to IndexedDB and synced when connection is restored)
- When offline, users can view cached static files (css stylesheets, js files, plant images)
- When offline, users can access their avatar and profile information from cache
- All offline changes (schedule entries, task additions) are automatically synchronized to the server when the connection is restored
- When offlien, users receive fallback offline page when requesting uncached content

### Caching strategy
- Evergreen uses service workers.
- service worker caches static files, plant images, avatar images, and icons into `evergreen-static-v0`.
- Failed requests fall back to the `/offline` page
- Schedule data is cached in IndexedDB `[bonus]`

### Installability
- Evergreen is installable (manifest.webmanifest file)
- Users can install Evergreen on their device
- Evergreen displays app logo as the home screen icon

### Theming
- Evergreen supports both light and dark themes
- Welcome page
- Evergreen uses theme related icons that we chose specifically for our Evergreen application (as below):
- <img width="1440" height="453" alt="Screenshot 2026-04-26 at 7 34 55 PM" src="https://github.com/user-attachments/assets/3458fa42-b33b-4216-86b6-619c68b4727c" />


## API Documentation
### Authentication
Method | Route                 | Description
------ | --------------------- | ---------
`POST` | `/api/auth/login`              | User login (No auth required)
`POST` | `/api/auth/logout`             | Log out the current user (auth required)
`POST` | `/api/auth/register`           | User registration (No auth required)

### Plant Database (Explore)
Method | Route                 | Description
------ | --------------------- | ---------
`GET` | `/api/plants`              | Get all plants in database (Authentication: TokenMiddleware)
`GET` | `/api/plants/:id`              | Get specific plant by ID (Authentication: TokenMiddleware)
`POST` | `/api/plants`              | Create a new plant in database (Authentication: TokenMiddleware)
`POST` | `/api/plants/:plantId/photo`    | Upload photo for a plant (Authentication: TokenMiddleware)

### User's Plant Collection
Method | Route                 | Description
------ | --------------------- | ---------
`GET` | `/api/users/plants`              | Get user's personal plant list (Authentication: TokenMiddleware)
`GET` | `/api/users/plants/:plantId` | Get specific plant from user's collection (Auth: TokenMiddleware)
`POST` | `/api/users/plants`              | Add plant to collection (Authentication: TokenMiddleware)
`PUT` | `/api/users/plants/:userPlantId`  | Update notes/photos (Authentication: TokenMiddleware)
`DELETE` | `/api/users/plants/:plantId`  | Delete plant from collection (Authentication: TokenMiddleware)
`POST` | `/api/users/custom-plants`  | Add custom plant (not in database) (Authentication: TokenMiddleware)

### Schedule management
Method | Route                 | Description
------ | --------------------- | ---------
`GET` | `/api/schedule`              | Get all schedule entries (Auth: TokenMiddleware)
`GET` | `/api/schedule/:id`           | Get user's schedule (Auth: TokenMiddleware)
`POST` | `/api/schedule`              | Create a new schedule entry (Auth: TokenMiddleware)
`PUT` | `/api/schedule/:id`              | Update a schedule entry (Auth: TokenMiddleware)
`DELETE` | `/api/schedule/:id`              | Delete a schedule entry (Auth: TokenMiddleware)

### Users
Method | Route                 | Description
------ | --------------------- | ---------
`GET` | `/api/users/profile`              | Get user profile (Auth: TokenMiddleware)
`PUT` | `	/api/users/profile`     | Update profile (username, bio) (Auth: TokenMiddleware)
`PUT` | `/api/users/change-password`    | Update user's password (Auth: TokenMiddleware)
`PUT` | `/api/users/avatar`           | Update user's avatar  (Auth: TokenMiddleware)

### Push Notifications
Method | Route                 | Description
------ | --------------------- | ---------
`POST` | `/api/push/subscribe`  | Save user's push notification subscription  (Auth: TokenMiddleware)

## Database ER Diagram

```markdown

Use this syntax to embed an image in your markdown file:

![](images/erd.png)
```



## Team Member Contributions

#### [Deniz Ozturk]

* Contribution 1
* Contribution 2
* ...

#### [Morgan Rivera]

* Contribution 1
* Contribution 2
* ...

#### [Quang Le]

* Contribution 1
* Contribution 2
* ...

#### Milestone Effort Contribution

<!-- Must add to 100% -->

Team Member 1 | Team Member 2 | Team Member 3
------------- | ------------- | --------------
X%            | Y%            | Z%
