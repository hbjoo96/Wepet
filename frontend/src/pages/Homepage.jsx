import React from "react";
import { Link } from "react-router-dom";
import "../css/Homepage.css";
import logo from "../assets/WePetLogo.png";
import jelly from "../assets/jelly.png";
import slidedog1 from "../assets/slidedog1.jpg";
import slidedog2 from "../assets/slidedog2.jpg";
import slidedog3 from "../assets/slidedog3.jpg";
import slidecat1 from "../assets/slidecat1.jpg";
import slidecat2 from "../assets/slidecat2.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cards";
import { EffectCards } from "swiper/modules";

const Homepage = () => {
  return (
    <div className="homepage-background">
      <img src={logo} alt="We Pet Logo" className="logo" />

      <Swiper
        effect={"cards"}
        grabCursor={true}
        modules={[EffectCards]}
        className="mySwiper"
      >
        <SwiperSlide>
          <img
            src={slidedog1}
            alt="Dog 1"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "18px",
            }}
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src={slidedog2}
            alt="Dog 1"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "18px",
            }}
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src={slidedog3}
            alt="Dog 1"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "18px",
            }}
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src={slidecat1}
            alt="Dog 1"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "18px",
            }}
          />
        </SwiperSlide>
        <SwiperSlide>
          <Link to="/findpet">
            <div
              style={{ position: "relative", width: "100%", height: "100%" }}
            >
              <img
                src={slidecat2}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "18px",
                  filter: "blur(4px) brightness(40%)",
                }}
                alt=""
              />
              <p
                style={{
                  position: "absolute",
                  top: "45%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  color: "#b8ce86",
                  fontSize: "22px",
                  textShadow: "2px 2px 8px rgba(0, 0, 0, 0.7)", // 텍스트 가독성을 높이기 위한 그림자
                }}
              >
                둘러보기
                <br />
                <br />
                <img
                  style={{ width: "30px" }}
                  src="./static/Arrow-right-circle.png"
                  alt=""
                />
              </p>
            </div>
          </Link>
        </SwiperSlide>
      </Swiper>

      {/* 로그인 및 찜 목록 버튼 */}
      <div className="bottom-buttons">
        <Link to="/findpet" style={{ textDecoration: "none" }}>
          <button className="bottom-btn">
            둘러보기
            <img src={jelly} alt="paw" className="icon" />
          </button>
        </Link>
        <Link to="/login" style={{ textDecoration: "none" }}>
          <button className="bottom-btn">
            로그인
            <img src={jelly} alt="paw" className="icon" />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Homepage;