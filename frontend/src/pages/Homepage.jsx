import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/Homepage.css";
import logo from "../assets/movelogo.png";
import jelly from "../assets/jelly.png";
import chatbotIcon from "../assets/chatbot.png";
import slidecat2 from "../assets/slidecat2.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cards";
import { EffectCards } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Homepage = () => {
  const [pets, setPets] = useState([]);
  const nav = useNavigate();
  // 메인 동물 이미지 불러오기
  useEffect(() => {
    fetchPets();
  }, []);
  const fetchPets = async (type = "") => {
    try {
      const response = await api.get("/main");
      // console.log("넘어오는지 확인", response.data);
      const petsData = response.data.images.map((image, index) => ({
        image: image,
        num: response.data.nums[index],
      }));
      setPets(petsData);

      // console.log("사진정보", images);
      // console.log("등록정보", petNum);
    } catch (error) {
      console.error("유기동물 정보 가져오기 실패:", error);
    }
  };
  // 상세정보창 이동 함수
  const moveDetail = (pet) => {
    // console.log("선택", pet);
    nav(`/findpet/petdetail/${pet.num}`);
  };
  return (
    <div className="homepage-background">
      <img src={logo} alt="We Pet Logo" className="logo" />

      <Swiper
        effect={"cards"}
        grabCursor={true}
        modules={[EffectCards]}
        className="mySwiper"
      >
        {pets.map((data, index) => (
          <SwiperSlide key={data.num}>
            <img
              key={pets.num || index}
              src={data.image}
              alt="동물사진"
              className="swiperImages"
              onClick={() => moveDetail(data)}
            />
          </SwiperSlide>
        ))}
        <SwiperSlide>
          <Link to="/findpet">
            <div className="swiperImagesLink">
              <img
                src={slidecat2}
                className="swiperImagesLinkImg"
                alt="둘러보기"
              />
              <p className="swiperImagesLinkTxt">
                둘러보기
                <br />
                <br />
                <img
                  className="swiperImagesLinkIcon"
                  src="./static/Arrow-right-circle.png"
                  alt=""
                />
              </p>
            </div>
          </Link>
        </SwiperSlide>
      </Swiper>

      {/* 챗봇으로 이동하는 이미지 버튼 추가 */}
      <div className="chatbot-button-container">
        <Link to="/chatbot">
          <img src={chatbotIcon} alt="챗봇 버튼" className="chatbot-button" />
        </Link>
      </div>

      {/* 로그인 및 찜 목록 버튼 */}
      <div className="bottom-buttons">
        <Link to="/findpet">
          <button className="bottom-btn">
            둘러보기
            <img src={jelly} alt="paw" className="jelleyicon" />
          </button>
        </Link>
        <Link to="/login">
          <button className="bottom-btn">
            로그인
            <img src={jelly} alt="paw" className="jelleyicon" />
          </button>
        </Link>
      </div>

      {/* 회원가입 버튼 */}
      <Link to="/signup">
        <button className="signup-small-btn">회원가입 하기</button>
      </Link>
    </div>
  );
};

export default Homepage;
