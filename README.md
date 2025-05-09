# Movie Explorer

A modern web application for discovering and exploring movies, built with React and Material-UI. Users can search for movies, view details, watch trailers, and maintain a list of favorites.

## Deployment
Using Vercel -> Link-----https://movie-sand-eight.vercel.app/

## Features

- **User Authentication**: Simple login system with username/password
- **Movie Discovery**: 
  - Browse trending movies
  - Search for specific movies
  - Filter movies by genre, year, and rating
- **Movie Details**:
  - View comprehensive movie information
  - Watch movie trailers (YouTube integration)
  - See cast and crew information
- **User Features**:
  - Save favorite movies
  - Toggle between light/dark mode
  - Responsive design for all devices
- **Search History**: Last search is preserved between sessions

## Technologies Used

- React 18
- Material-UI (MUI)
- TMDb API
- React Router
- React YouTube
- Axios
- Vite

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
git clone <repository-url>
cd movie-explorer


2. Install dependencies:
npm install


3. Start the development server:
npm run dev


The application will be available at `http://localhost:5173`

## API Configuration

The application uses The Movie Database (TMDb) API. The API key is already configured in the project.

### API Endpoints Used

- `/trending/movie/day` - Get trending movies
- `/search/movie` - Search for movies
- `/movie/{id}` - Get detailed movie information
- `/genre/movie/list` - Get movie genres
- `/discover/movie` - Get movies by genre/year

## Project Structure

```
src/
├── api/
│   └── movieApi.js       # API configuration and calls
├── components/           # Reusable UI components
├── contexts/            # React Context providers
├── pages/              # Main application pages
├── theme.js           # MUI theme configuration
└── App.jsx            # Main application component
```

## Features Implementation

### Authentication
- Simple mock authentication system
- Persistent login state using localStorage
- Protected routes for authenticated users

### Movie Browsing
- Grid layout for movie display
- Movie cards with hover effects
- Infinite scroll for search results
- Filter system for genres, years, and ratings

### Movie Details
- Comprehensive movie information display
- YouTube trailer integration
- Cast and crew information
- Backdrop images with gradient overlay

### Favorites System
- Add/remove movies from favorites
- Persistent favorites storage
- Dedicated favorites page

### UI/UX Features
- Responsive design
- Light/dark mode toggle
- Loading states and error handling
- Smooth animations and transitions

