import React from "react";
import { Router, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import About from "./pages/About";
import Shop from "./shop/Shop";
import Header from "./Header";
import Chatbot from "./chatbot/Chatbot";
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

const App = () => {
  return (
    <Router history={history}>
      <div className="container">
        <Header />
        <Route exact path="/" component={Landing} />
        <Route exact path="/about" component={About} />
        <Route exact path="/shop" component={Shop} />
        <Chatbot />
      </div>
    </Router>
  );
};

export default App;
