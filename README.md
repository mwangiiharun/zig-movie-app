## Movie App – Implemented Solution

This repository now contains a completed implementation of the movie challenge: a .NET 8 Web API (C#) that proxies TMDb and a React 18 + TypeScript client that shows a popular‑movies homepage, search, and a movie detail page. The sections below describe how to run it, which requirements were met, and key design considerations, followed by the original challenge brief.

### How to run

- **Backend (serverside)**
  - Prerequisites: .NET SDK 8.0+, TMDb API key (v3 auth).
  - Commands:
    ```bash
    cd serverside
    dotnet restore
    export API_KEY=your_tmdb_v3_api_key_here
    dotnet run
    ```
  - Runs on `http://localhost:5000` in Development with CORS enabled for all origins.

- **Frontend (clientside/zig-movie-app)**
  - Prerequisites: Node.js (LTS) and npm.
  - Commands:
    ```bash
    cd clientside/zig-movie-app
    npm install
    npm start
    ```
  - Open `http://localhost:3000` in the browser.
  - The app calls the backend at `http://localhost:5000/api/...` for all movie data.

### Requirements coverage

- **Popular movies homepage**: `HomePage` calls `GET /api/popular` and renders the top 20 movies from TMDb.
- **Search by title**: search bar on `HomePage` calls `GET /api/search?query={term}` and shows matching movies.
- **Movie detail links**: each movie in the lists links to `/movie/{id}`, which loads details via `GET /api/movie/{id}`.
- **Detail page content**: `MovieDetailPage` shows the poster image, the title (linking to the movie’s official `homepage` when provided by TMDb), and a short description (`overview`).
- **Server-side Web API only**: the React client never calls TMDb directly; it only uses the ASP.NET Core Web API.
- **API routes**:
  - `GET /api/popular`
  - `GET /api/search?query={term}`
  - `GET /api/movie/{id}`
- **Unit tests**:
  - `serverside.Tests` includes xUnit tests for `MoviesController` and `MovieRepository` using simple fakes of dependencies.
  - `clientside/zig-movie-app/src/App.test.tsx` is a smoke test that mocks `fetch` and asserts the main UI renders.
- **Client TypeScript**: all React components are written in TypeScript with React 18 (`React.FC`, typed props, shared `Movie` type).

### Design considerations

- **Modern .NET**: Upgraded the server to **.NET 8**, using endpoint routing, dependency injection, and `AddControllers().AddNewtonsoftJson()` to keep Newtonsoft-based models.
- **Singleton HttpClient**: `MovieApiClient` uses a static `HttpClient` instance (singleton pattern) to avoid socket exhaustion and satisfy the bonus requirement.
- **Repository pattern**: `MovieRepository` abstracts the TMDb client behind `IMovieRepository`, aligning with the provided DAL/repository guidance.
- **Dependency Injection**: Controllers depend on interfaces (`IMovieRepository`, `IMovieApiClient`), registered in `Startup` as `Scoped` and `Singleton` respectively.
- **CORS & local dev**: CORS policy `AllowClient` enables any origin/headers/methods, and HTTPS redirection is disabled in Development so `http://localhost:3000` → `http://localhost:5000` works cleanly.
- **React 18 + routing**: Client uses React 18’s `createRoot` API, `react-router-dom` v5 for routing, and Bootstrap 5 for simple responsive styling.
- **Testing strategy**: Server tests use lightweight in-memory fakes instead of external mocking libraries; client test keeps to a minimal smoke test to validate the main flow without overcoupling to UI details.

# Interview Coding Challenge

Step 1 of the Interview process. Follow the instructions below to complete this portion of the interview. 
Please note, although we do not set a time limit for this challenge, we recommend completing it as soon as possible as we evaluate candidates on a first come, first serve basis...

If you have any questions, please feel free to email support@thezig.io. We will do our best to clarify any issues you come across.


## Prerequisites:

1. A Text Editor - We recommend Visual Studio Code for the ClientSide code, its lightweight, powerful and Free! (https://code.visualstudio.com/)
2. An IDE Visual Studio Community for the ServerSide code, (https://visualstudio.microsoft.com/vs/community/)
3. You will need the .NET Core SDK in order to run the console application. (microsoft.com/net/core#windowscmd)
4. Git - For source control and committing your final solution to a new private repo (https://git-scm.com/downloads) 

    a. If you're not very familiar with git commands, here's a helpful cheatsheet (https://services.github.com/on-demand/downloads/github-git-cheat-sheet.pdf)
        
## Instructions

- Clone this repo locally using git clone
- cd into ./clientside/zig-movie-app directory for client-side code
- cd into ./serverside for web api server-side code
- Install dependencies using npm install (client side)
- Use Nuget Package Manager to restore packages (server-side)
- Obtain api key from https://developers.themoviedb.org
- Export api key environment variable: export API_KEY=${your_api_key}
- Start webpack using npm start
- Navigate to app in browser

Once the challenge is complete, please push the code up to a new private repo and grant access to the following email addresses for code review 

        - chilch  
        - musukwamoshi@gmail.com    
        - fridaynyambe9@gmail.com
        - thomasmunguya@gmail.com

## Submission

***Then fill in this [form](https://forms.cloud.microsoft/r/82xEn4LuNt) with a link to your private repo and your email.***

## Requirements

1. Create a  homepage that will list popular movies from the API. 
2. Add a search bar that can search for movies by title.
3. The list should contain links for each movie title to navigate to an individual detail page with more info for each movie. 
4. On the detail page,display the poster image,the title should link to the movie's official site and a add a short description of the movie.
5. All the data should be retrieved from endpoints exposed via the server-side web api
6. Your API routes should be as follows:
    1. api/popular - Filters top 20 most popular movies (for homepage list of popular movies)
    2. api/search?query=birdbox - Returns movies where the title matches parts of the query string (for the search field)
    3. /api/movie/1145 - Returns a single movie by Movie Id (for use by the detail page)
7. Add Unit tests for the Controllers and Repos
8. Client side code should be written in TypeScript

## Hints

- HINT 1: Enable/Allow CORS (Cross-Origin Resource Sharing) on the server-side (https://docs.microsoft.com/en-us/aspnet/core/security/cors?view=aspnetcore-2.2)
- HINT 2: Use the DAL Project (Data Access Layer) on the server side to implement the repository pattern (https://docs.microsoft.com/en-us/previous-versions/msp-n-p/ff649690(v=pandp.10))


## Tech

The technologies used to build this app are: 
Client-Side - ReactJS, Vite, TypeScript
Server-Side - .NET Core Web Api (.NET 8 or greater)

## Bonus Points
    
1. Using Singleton Pattern for the Http Client that access the Movie API (Server-Side)
2. Using Inversion of Control (aka Dependency Injection) throughout on the (Server-Side)
3. Using React Hooks, Zustand  or Redux to manage state (Client-Side)
4. Using React Router DOM for routing (Client-Side)
5. Use bootstrap for styling the website (Client-Side)
6. Add Swagger UI to document your API create a new API key and it will be listed under the heading "API Key (v3 auth)" 
 (Server-Side)

## Obtaining an API Token from www.themoviedb.org
1.	Create a profile on www.themoviedb.org
2.	Once you’re logged into your profile, click on your username/profile menu in the top right corner and select “Settings” 
3.	Under “Settings”, click on “API” in the left hand navigation
4.	Under the API Settings, you can


***If you have any questions, difficulties or would simply like to discuss the requirements, please do not hesitate to contact us at support@thezig.io. Asking questions for clarification or requesting help of any kind, is NOT AT ALL disqualifying, in fact we encourage it, it's called teamwork :-)*** 

We look forward to receiving your submission.

Good Luck

