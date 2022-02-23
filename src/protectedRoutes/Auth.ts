import { useSelector } from "react-redux";
import { store } from "../store";

class Auth {
  authenticated: any = false;
  roleName: any = "";
  constructor() {
    this.authenticated = false;
  }

  login(cb) {
    this.authenticated = true;
    cb();
  }

  logout(cb) {
    this.authenticated = false;
    this.roleName=""
    cb();
  }

  getToken() {
    let state = store.getState();
    return { token: state.login.user.token };
  }

  isAuthenticated() {
    let user = store.getState();
    if (
      user.login.user.email === "" ||
      user.login.user.email === undefined ||
      user.login.user.email === null ||
      user.login.user.email_verified_at === null
    ) {
      this.authenticated = false;
    } else {
      this.authenticated = true;
      this.roleName =
        user.login.user &&
        user.login.user.roles &&
        user.login.user.roles[0] &&
        user.login.user.roles[0].name;
    }
    return { authenticated: this.authenticated, role: this.roleName };
  }
}

export default new Auth();
