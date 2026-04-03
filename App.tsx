import { Switch, Route, Router as WouterRouter } from "wouter";
import Converter from "./Converter";
import PrivacyPolicy from "./PrivacyPolicy";
import ContactUs from "./ContactUs";

export default function app() {
  return (
    <WouterRouter>
      <Switch>
        <Route path="/" component={Converter} />
        <Route path="/privacy" component={PrivacyPolicy} />
        <Route path="/contact" component={ContactUs} />
        <Route component={Converter} />
      </Switch>
    </WouterRouter>
  );
}

