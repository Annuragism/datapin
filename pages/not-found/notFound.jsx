import React from "react";
import "./style.css";
import logo from "../../assets/logo.svg";
import PrimaryButton from "../../common/primary-button";

function notFound(props) {
  const { history, translate } = props;
  return (
    <div className="bg-purple">
      <div className="stars">
        <div className="custom-navbar d-flex-center">
          <div className="brand-logo">
            <img src={logo} width="80px" height={"50px"} alt="brand-logo"/>
          </div>
          <div>DATAKEEN</div>
        </div>
        <div className="central-body">
          {/* <img
            className="image-404"
            src="http://salehriaz.com/404Page/img/404.svg"
            width="300px"
          /> */}
          <div className="">
            <div className="oopss_404">{translate?.t("oops")}</div>
            <div className="err_404">404</div>
            <div className="err_404_text">{translate?.t("404_text")}</div>
          </div>
          <PrimaryButton
            style={{ marginTop: 10, width: "150px", height: 10 }}
            text="HOME"
            onClick={() => {
              let user = JSON.parse(localStorage.getItem("user")|{});
              if (user.role==='admin') {
                history?.navigate("admin-dashboard");
              }
              else if (user.role === "user") {
                history?.navigate("user-dashboard");
              } else {
                history?.navigate("login");
              }
            }}
          />
        </div>
        <div className="objects">
          <img
            className="object_rocket"
            src="http://salehriaz.com/404Page/img/rocket.svg"
            width="40px"
            alt="icon"
          />
          <div className="earth-moon">
            <img
              className="object_earth"
              src="http://salehriaz.com/404Page/img/earth.svg"
              width="100px"
              alt="icon"
            />
            <img
              className="object_moon"
              src="http://salehriaz.com/404Page/img/moon.svg"
              width="80px"
              alt="icon"
            />
          </div>
          <div className="box_astronaut">
            <img
              className="object_astronaut"
              src="http://salehriaz.com/404Page/img/astronaut.svg"
              width="140px"
              alt="icon"
            />
          </div>
        </div>
        <div className="glowing_stars">
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
        </div>
      </div>
    </div>
  );
}

export default notFound;
