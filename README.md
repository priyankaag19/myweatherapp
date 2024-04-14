**Project: City Weather App With React and Typescript**

**Description:**
This project is a web application that allows users to view weather information for different cities. Users can search for cities, view weather details for a specific city, and mark their favorite cities.

**Features:**
1. **City Table:** Displays a table of cities with their names, countries, and timezones. Users can search for cities and sort the table by name, country, or timezone.
2. **Weather Page:** Shows weather information for a specific city, including temperature, weather description, humidity, wind speed, and pressure.
3. **Favorites:** Users can mark cities as favorites, which are stored locally and can be viewed in a modal window.
4. **Visited Cities:** The application keeps track of visited cities and stores them locally.

**Technologies Used:**
- **React:** Frontend library for building user interfaces.
- **React Router:** Routing library for React applications.
- **Axios:** HTTP client for making requests to API endpoints.
- **Tailwind CSS:** Utility-first CSS framework for styling the UI.
- **localStorage:** Browser storage for storing favorites and visited cities.

**Project Structure:**
- **App.tsx:** Main component responsible for routing between different pages.
- **CitiesTable.tsx:** Component for displaying the table of cities and managing favorites.
- **WeatherPage.tsx:** Component for showing weather details for a specific city.
- **README.md:** Documentation file explaining the project, its features, and how to set it up.

**Setup:**
1. Clone the repository.
2. Install dependencies using `npm install` or `yarn install`.
3. Start the development server using `npm start` or `yarn start`.

**Usage:**
1. Open the application in a web browser.
2. Use the search bar to find cities.
3. Click on a city name to view its weather details.
4. Mark cities as favorites by clicking the "Add" button.
5. View favorite cities by clicking the "View Favorites" button.
6. Visited cities are automatically tracked and stored locally.


.