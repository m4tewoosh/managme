import { jwtDecode } from 'jwt-decode';

type JWTToken = {
  exp: number;
};

class Auth {
  isAuthenticated: boolean;

  public constructor() {
    this.isAuthenticated = false;
    // this.myAccount = {
    //   mainPage: '/my-account/plan-details',
    //   loginPage: '/my-account/login'
    // };
    // this.checkout = {
    //   mainPage: '/offer',
    //   loginPage: '/login'
    // };
    // this.capturePage = '/capture';
    // this.consentsPage = '/consents';
  }

  public login(token: string) {
    if (!token) {
      return;
    }

    localStorage.setItem('token', token);
    this.isAuthenticated = true;
  }

  public logout() {
    this.isAuthenticated = false;

    localStorage.removeItem('token');
    // window.location.reload();
  }

  public isLogged(): boolean {
    const token = localStorage.getItem('token');
    // const refreshToken = localStorage.getItem('refresh_token');

    if (!token) {
      // this.isAuthenticated = !!refreshToken;
      this.logout();
      return false;
    }

    const decoded: JWTToken = jwtDecode(token);

    if (!decoded) {
      return false;
    }

    const now = Date.now() / 1000;
    const isExpired = now > decoded.exp;

    if (isExpired) {
      this.logout();
      return false;
    }

    this.isAuthenticated = true;
    return true;

    // if (isExpired && !refreshToken) {
    //   this.logout();
    // } else {
    //   this.isAuthenticated = true;
    // }
    // return this.isAuthenticated;
  }
}

export default new Auth();
