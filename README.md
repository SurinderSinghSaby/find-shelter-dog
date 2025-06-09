# Dog Search App

A React application to help users find their perfect dog based on breed and location. The app leverages modern UI components from Material-UI (MUI) and communicates with dog and location APIs to provide search, filtering, sorting, and pagination functionality.

---

## Features

- Search dogs by breed and location (ZIP code).
- Browse through dogs with pagination (12 dogs per page).
- Sort results by dog name or breed (ascending/descending).
- Responsive grid layout with MUI for a polished user experience.
- Loading indicators during API calls.
- Fetches breeds and locations dynamically from APIs.
- Clean, user-friendly UI for easy navigation and search refinement.

---

## Tech Stack

- React (Functional Components + Hooks)
- Material-UI (MUI) for UI components and layout
- TypeScript for type safety
- Axios for API requests (assumed in your service files)
- Custom API services for dog and location data (`dogsApi.ts` and `locationApi.ts`)

---

## Run Locally

git clone https://github.com/
cd find-shelter-dog
npm install
npm run dev