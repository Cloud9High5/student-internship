// import classes from "./App.module.scss";
import { Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import NotFound from "./components/404Page/NotFound";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Resources from "./components/educational/Resources";
import Forum from "./components/forum/Forum";
import Home from "./components/home/Home";
import Calendar from './components/home/Calendar';
import JobList from "./components/jobs/JobList";
import NavBar from "./components/appBar/NavBar";
import StudentSignup from "./components/auth/StudentSignup";
import CompanySignup from "./components/auth/CompanySignup";
import { Container } from "@mui/material";
import classes from "./App.module.scss";

function App() {
  return (
    <Fragment>
      <NavBar />
      <Container maxWidth={false} className={classes.rootContainer}>
        <Switch>
          <Route path="/" exact component={Home}></Route>
          <Route path="/calendar" exact component={Calendar} />
          <Route path="/search" exact component={JobList} />
          <Route path="/job" exact component={JobList} />
          <Route path="/login" exact component={Login} />
          <Route path="/signup" exact component={Signup} />
          <Route path="/signup/student" exact component={StudentSignup} />
          <Route path="/signup/company" exact component={CompanySignup} />
          <Route path="/forum" exact component={Forum} />
          <Route path="/resources" exact component={Resources} />
          <Route path="*" component={NotFound} />
        </Switch>
      </Container>
    </Fragment>
  );
}

export default App;
