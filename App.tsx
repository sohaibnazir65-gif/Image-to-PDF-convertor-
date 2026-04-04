import { Switch, Route, Router as WouterRouter } from "wouter";
import Converter from "./Converter";
import PrivacyPolicy from "./PrivacyPolicy";
import ContactUs from "./ContactUs";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Converter} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/contact" component={ContactUs} />
      <Route component={Converter} />
    </Switch>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Router />
    </WouterRouter>
  );
}

export default App;
