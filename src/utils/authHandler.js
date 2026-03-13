import Cookies from "js-cookie";

export const AuthHandler = {
  login: (token) => {
    sessionStorage.setItem("token", token);

    Cookies.set("token", token, {
      expires: 1,  
      path: "/",
      secure: true,
      sameSite: "Strict",
    });

    window.location.replace("/home");
  },

  logout: () => {
    sessionStorage.removeItem("token");

    Cookies.remove("token");

    window.location.replace("/login");
  },

  getToken: () => {
    return Cookies.get("token");
  },
};