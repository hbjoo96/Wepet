import React, { useState, useEffect, useRef } from "react";
import "../css/EditProfileForm.css";
import jelly from "../assets/jelly.png";
import api from "../api";
import { useNavigate } from "react-router-dom";

const EditProfileForm = () => {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [checkPwdstate, setCheckPwdstate] = useState(false);
  const [checkPwdError, setCheckPwdError] = useState(false);
  const [nicknameError, setNicknameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userType, setUserType] = useState("unknown"); // 초기값 명확히 설정

  const pwdSpecial = /[~`!@#$%^&*(),.?":{}|<>_\-/]/;
  const nav = useNavigate();
  const pwdRef = useRef();

  useEffect(() => {
    api
      .get("/user/checkLoginStatus", {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.isLoggedIn) {
          setUserData({ userId: response.data.userId });
          console.log("로그인 상태 확인:", response.data);
        }
      })
      .catch((error) => {
        console.error("로그인 상태 확인 오류:", error);
      });
  }, []);

  const handleNicknameChange = (e) => {
    setNickname(e.target.value || "");
    setNicknameError(false);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value || "");
    setPasswordError(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let valid = true;

    if (nickname.length === 0 || nickname.length > 8) {
      setNicknameError(true);
      valid = false;
    }

    if (password.length < 10 || !pwdSpecial.test(password)) {
      setPasswordError(true);
      valid = false;
    }

    if (valid) {
      console.log("Profile updated successfully!");
      editProfie();
    }
  };

  useEffect(() => {
    if (userData) {
      compareType();
    }
  }, [userData]);

  const compareType = async () => {
    let userId = userData.userId;
    const response = await api.get("/user/send-nick-mypage", {
      userId: userId,
    });
    console.log("타입 확인", response.data.rows[0].user_type);
    setUserType(response.data.rows[0].user_type);
  };

  const editProfie = async () => {
    const response = await api.post("/user/update", {
      nick: nickname,
      pw: password,
    });
    console.log(response);
    nav("/mypage");
  };

  const checkPwd = async (e) => {
    e.preventDefault();
    let id = userData.userId;
    let pw = pwdRef.current.value;
    try {
      const response = await api.post("/user/login", {
        id: id,
        pw: pw,
      });
      if (response.data.result === "로그인 성공") {
        setCheckPwdstate(true);
        setCheckPwdError(false);
      } else {
        setCheckPwdstate(false);
        setCheckPwdError(true);
      }
    } catch (error) {
      console.error("비밀번호 확인 중 오류", error);
      setCheckPwdError(true);
    }
  };

  return (
    <div className="homepage-background">
      <h1 className="edit-title">회원 조회 / 수정</h1>

      {userType === "unknown" ? (
        <p>로딩 중...</p>
      ) : userType === "normal" && !checkPwdstate ? (
        <form>
          <label className="edit-label">비밀번호 확인</label>
          <div className="input-container">
            <input type="password" placeholder="비밀번호 입력" ref={pwdRef} />
          </div>
          {checkPwdError && (
            <p className="validation-error">
              비밀번호가 올바르지 않습니다. 다시 시도해주세요.
            </p>
          )}
          <button type="submit" className="edit-btn" onClick={checkPwd}>
            제출하기{" "}
            <img src={jelly} alt="수정하기 아이콘" className="jelly-icon" />
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit}>
          <label htmlFor="nickname" className="edit-label">
            닉네임
          </label>
          <div className="input-container">
            <input
              type="text"
              id="nickname"
              name="nickname"
              value={nickname || ""}
              onChange={handleNicknameChange}
              placeholder="최대 8글자까지만 입력 가능합니다."
              required
            />
          </div>
          {nicknameError && (
            <p className="validation-error">닉네임을 입력해주세요.</p>
          )}

          {userType === "normal" && (
            <div className="changePwd">
              <label htmlFor="password" className="edit-label">
                비밀번호 변경
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="changePwdinput"
                value={password || ""}
                onChange={handlePasswordChange}
                placeholder="비밀번호 입력(숫자,특수문자 포함 10글자 이상)"
                required
              />
            </div>
          )}

          {passwordError && (
            <p className="validation-error">비밀번호를 다시 확인해주세요.</p>
          )}

          <button type="submit" className="edit-btn">
            수정하기{" "}
            <img src={jelly} alt="수정하기 아이콘" className="jelly-icon" />
          </button>
        </form>
      )}
    </div>
  );
};

export default EditProfileForm;
