import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';

const App: React.FC = () => (
  <Router>
    <div className="app-root">
      <Switch>
        <Route exact={true} path="/" component={HomePage} />
        <Route path="/movie/:id" component={MovieDetailPage} />
      </Switch>
    </div>
  </Router>
);

export default App;
