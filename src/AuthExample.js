// AuthExample.js
import "./login.css"
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from "react-router-dom";

////////////////////////////////////////////////////////////
// 1. Click the public page
// 2. Click the protected page
// 3. Log in
// 4. Click the back button, note the URL each time

function AuthExample() {
  return (
    <Router>
      <div>
        <AuthButton />
        <ul>
          <li>
            <Link to="/public">Public Page</Link>
          </li>
          <li>
            <Link to="/protected">Protected Page</Link>
          </li>
        </ul>
        <Route path="/public" component={Public} />
        <Route path="/login" component={Login} />
        <PrivateRoute path="/protected" component={Protected} />
      </div>
    </Router>
  );
}

const fakeAuth = {
  isAuthenticated: false,
  authenticate(email, password, cb) {
    fetch('/auth/login', {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
          "Content-Type": "application/json; charset=utf-8",
          // "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    }).then(response => {
      if(response.status === 200) {
        this.isAuthenticated = true;
        return response.json();
      }
    }).then(body => {
      console.log(body);
      cb();
    });
  },
  signout(cb) {
    this.isAuthenticated = false;
    setTimeout(cb, 100);
  }
};

const AuthButton = withRouter(
  ({ history }) =>
    fakeAuth.isAuthenticated ? (
      <p>
        Welcome!{" "}
        <button
          onClick={() => {
            fakeAuth.signout(() => history.push("/"));
          }}
        >
          Sign out
        </button>
      </p>
    ) : (
      <p>You are not logged in.</p>
    )
);

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        fakeAuth.isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}

function Public() {
  return <h3>Public</h3>;
}

function Protected() {
  return <h3>Protected</h3>;
}

class Login extends React.Component {
  state = {
    redirectToReferrer: false,
    email: "",
    password: "",
  };

  login = () => {
    fakeAuth.authenticate(this.state.email, this.state.password, () => {
      this.setState({ redirectToReferrer: true });
    });
  };

  emailChanged = (event) => {
    this.setState({ email: event.target.value });
  }

  passwordChanged = (event) => {
    this.setState({ password: event.target.value });
  }

  render() {
    let { from } = this.props.location.state || { from: { pathname: "/" } };
    let { redirectToReferrer } = this.state;

    if (redirectToReferrer) return <Redirect to={from} />;

       return (
     <div className="limiter">
        <div className="container-login100">
          <div className="wrap-login100 p-t-85 p-b-20">
            <form className="login100-form validate-form">
              <span className="login100-form-title p-b-70">
                BareButes
              </span>
              <span className="login100-form-title p-b-70">
                Just the 'butes
              </span>

             <div className="wrap-input100 validate-input m-t-85 m-b-35" >
                <input type="text" className="input100"  value={this.state.email} onChange={this.emailChanged} />

                <span className="focus-input100" ></span>
              </div>

             <div className="wrap-input100 validate-input m-b-50" >
                <input type = "text" className="input100"   value={this.state.password} onChange={this.passwordChanged}/>
                <span className="focus-input100" ></span>
              </div>

              <div className="container-login100-form-btn">
                <button className="login100-form-btn" onClick={this.login} >Login</button>
              </div>
              <div className="container-login100-form-btn">
                <button className="login100-form-btn">
                 Sign Up
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default AuthExample;