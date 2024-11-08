import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios"; // Axios 임포트 필요
import "../css/MyPage.css";
import chatbotIcon from "../assets/ChatIcon.png";
import NaruIcon from "../assets/Naru.png";
import MaruIcon from "../assets/Maru.png"; // 두 가지 버튼 이미지 추가
import userprofile from "../assets/userprofile.png";
import logout from "../assets/mylogout.png";
import mydelete from "../assets/mydelete.png";
import myuseredit from "../assets/myuseredit.png";
import mydonation from "../assets/mydonation.png";
import api from "../api";

const MyPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [userNick, setUserNick] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // checkLoginStatus API를 통해 로그인 상태 확인
    api
      .get("/user/checkLoginStatus", {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.isLoggedIn) {
          setIsLoggedIn(true);
          setUserData({ userId: response.data.userId });
          console.log("로그인 상태 확인:", response.data);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch((error) => {
        console.error("로그인 상태 확인 오류:", error);
        setIsLoggedIn(false);
      });
  }, []);
  useEffect(() => {
    if (userData) {
      getNick();
    }
  }, [userData]);
  // 닉네임 가져오기
  const getNick = async () => {
    let userId = userData.userId;
    const response = await api.get("/user/send-nick-mypage", {
      userId: userId,
    });
    setUserNick(response.data.rows[0].user_nick);
    console.log(response);
  };

  const handleLogout = () => {
    Swal.fire({
      title: "로그아웃 하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "로그아웃",
      cancelButtonText: "취소",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .post("/user/logout", {}, { withCredentials: true })
          .then(() => {
            Swal.fire(
              "로그아웃 완료",
              "성공적으로 로그아웃 되었습니다.",
              "success"
            );
            navigate("/login");
          })
          .catch((error) => {
            console.error("로그아웃 중 오류:", error);
          });
      }
    });
  };

  const handleDeleteAccount = () => {
    Swal.fire({
      title: "정말로 회원 탈퇴 하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "탈퇴",
      cancelButtonText: "취소",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .post("/user/delete")
          .then(() => {
            Swal.fire("탈퇴 완료", "회원 탈퇴가 완료되었습니다.", "success");
            navigate("/");
          })
          .catch((error) => {
            console.error("회원 탈퇴 중 오류:", error);
          });
      }
    });
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions); // 옵션 버튼 표시 상태를 토글
  };

  return (
    <div className="homepage-background">
      {isLoggedIn ? (
        <>
          <div className="profile-card">
            <img
              src={userprofile}
              alt="프로필 아이콘"
              className="profile-icon"
            />
            <div className="profile-info">
              <p className="username">
                <span className="username-main">{userNick}</span>
                <span className="username-sub">님, 안녕하세요!</span>
              </p>
            </div>
          </div>

          {/* 챗봇으로 이동하는 이미지 버튼 추가 */}
          <div className="home-chatbot-button-container">
            <img
              src={chatbotIcon}
              alt="챗봇 버튼"
              className="home-chatbot-button"
              onClick={toggleOptions} // 클릭 시 옵션 버튼 표시 상태를 변경
            />

            {/* 옵션 버튼 */}
            {showOptions && (
              <div className="home-chatbot-options">
                <Link to="/chatbot" className="icon-wrapper">
                  <img
                    src={MaruIcon}
                    alt="마루 챗봇"
                    className="option-button maru-option"
                  />
                  <span className="icon-text">입양문의</span>
                </Link>
                <Link to="/chatbot2" className="icon-wrapper">
                  <img
                    src={NaruIcon}
                    alt="나루 챗봇"
                    className="option-button naru-option"
                  />
                  <span className="icon-text">케어문의</span>
                </Link>
              </div>
            )}
          </div>

          <div className="menu-list">
            <div className="menu-item" onClick={handleLogout}>
              <img src={logout} alt="로그아웃 아이콘" className="menu-icon" />
              <span>로그아웃</span>
              <span className="arrow">></span>
            </div>
            <div className="menu-item" onClick={handleDeleteAccount}>
              <img src={mydelete} alt="회원탈퇴 아이콘" className="menu-icon" />
              <span>회원탈퇴</span>
              <span className="arrow">></span>
            </div>
            <Link to="/edit-profile" className="menu-item">
              <img
                src={myuseredit}
                alt="회원정보 수정 아이콘"
                className="menu-icon"
              />
              <span>회원정보 수정</span>
              <span className="arrow">></span>
            </Link>
            <Link to="/sponsor" className="menu-item">
              {" "}
              {/* 후원 페이지로 이동 */}
              <img
                src={mydonation}
                alt="후원하기 아이콘"
                className="menu-icon"
              />
              <span>후원하기</span>
              <span className="arrow">></span>
            </Link>
          </div>
        </>
      ) : (
        <div className="mylogin-prompt">
          <p>로그인 회원만 이용 가능합니다.</p>
          <Link to="/login">
            <button className="mylogin-btn">로그인 하러 가기</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyPage;
