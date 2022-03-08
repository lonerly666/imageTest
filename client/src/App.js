import { Route, Switch } from "react-router-dom";
import "./App.css";
import Home from "./Home";

export default function App(props) {
  return (
    <main>
      <Switch>
        <Route path="/" exact component={Home} />
      </Switch>
    </main>
  );
}
