import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../css/ChatBot.css";
import AiMaru from "../assets/AiMaru.png";
import sendBtn from "../assets/sendbtn.png";
import imgSend from "../assets/imgsend.png";
import background from "../assets/background.png";
import axios from "axios";

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "반갑습니다! 멍!",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [similarPets, setSimilarPets] = useState([]);
  const messagesRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/user/checkLoginStatus", {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.isLoggedIn) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch((error) => {
        console.error("로그인 상태 확인 오류:", error);
        setIsLoggedIn(false);
      });
  }, []);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const cancelImagePreview = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const newMessages = [
      ...messages,
      { sender: "user", text: input, time: currentTime },
    ];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await axios.post(
        "http://localhost:8000/search_by_text",
        {
          text: input,
        }
      );

      const botReply = response.data.message;
      const similarPetsText = response.data.similar_pets
        .map(
          (pet, index) =>
            `<div style="margin-bottom: 10px;">
             <img src="${pet.pet_img}" alt="동물 이미지" class="pet-img"  />
             <div>동물 번호: ${pet.pet_num}</div>
             <div>유사도: ${pet.cosine_similarity.toFixed(2)}</div>
           </div>`
        )
        .join("");

      // 봇 메시지로 추가
      setMessages([
        ...newMessages,
        {
          sender: "bot",
          text: `유사한 동물 목록:\n${similarPetsText}`,
          time: currentTime,
          isHtml: true,
        },
      ]);
      console.log(response);
    } catch (error) {
      console.error("메시지 전송 중 오류:", error);
    }
  };

  const sendImage = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: "이미지 전송 중...", time: currentTime },
    ]);

    try {
      const response = await axios.post(
        "https://<your-lambda-url>.lambda.amazonaws.com/api/search_by_image",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const botReply = response.data.similar_pets
        ? `유사한 동물: ${response.data.similar_pets.join(", ")}`
        : "이미지 분석 결과가 없습니다.";
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          sender: "bot",
          text: botReply,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error("이미지 전송 중 오류:", error);
    }
  };

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      className="chat-container"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {isLoggedIn ? (
        <div className="chat-window">
          <div className="chat-header">
            <img src={AiMaru} alt="뒤로" className="chat-icon" />
            <h1 className="chat-title">AI 마루</h1>
          </div>

          <div className="chat-messages" ref={messagesRef}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message-wrapper ${
                  message.sender === "bot" ? "bot-wrapper" : "user-wrapper"
                }`}
              >
                <div
                  className={`message ${
                    message.sender === "bot" ? "bot" : "user"
                  }`}
                >
                  {message.isHtml ? (
                    // HTML 메시지를 렌더링할 때
                    <div dangerouslySetInnerHTML={{ __html: message.text }} />
                  ) : (
                    // 일반 텍스트 메시지를 렌더링할 때
                    <div>{message.text}</div>
                  )}
                </div>

                <div className="message-time">{message.time}</div>
              </div>
            ))}
          </div>

          {previewUrl && (
            <div className="image-preview">
              <img src={previewUrl} alt="미리보기" className="preview-image" />
              <button className="cancel-preview" onClick={cancelImagePreview}>
                X
              </button>{" "}
              {/* 취소 버튼 */}
            </div>
          )}

          <div className="chat-input">
            <label htmlFor="file-input" style={{ display: "none" }}>
              파일 선택
            </label>
            <input
              type="file"
              id="file-input"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <button
              onClick={() => document.getElementById("file-input").click()}
            >
              <img src={imgSend} alt="이미지 전송" className="send-icon" />
            </button>
            <textarea
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="텍스트를 입력하세요."
            />
            <button onClick={sendMessage}>
              <img src={sendBtn} alt="보내기" className="send-icon" />
            </button>
          </div>
        </div>
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

export default ChatBot;
