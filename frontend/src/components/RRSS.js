import React from "react";
import styled from "styled-components";

const Card = () => {
  return (
    <StyledWrapper>
      <div className="card">
        {/* Instagram */}
        <a
          href="https://www.instagram.com/sportify.daw/"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link1"
          aria-label="Instagram"
        >
          <svg
            viewBox="0 0 16 16"
            className="bi bi-instagram"
            fill="currentColor"
            height={16}
            width={16}
            xmlns="http://www.w3.org/2000/svg"
            style={{ color: "white" }}
          >
            <path
              fill="white"
              d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"
            />
          </svg>
        </a>

        {/* Twitter */}
        <a
          href="https://x.com/Sportify_daw"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link2"
          aria-label="Twitter"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 512 512"
            style={{ color: "white" }}
          >
            <path
              fill="white"
              d="M459.4 151.7c.3 4.2 .3 8.5 .3 12.7 0 129.5 -98.6 278.8 -278.8 278.8 -55.3 0 -106.7 -16.2 -150.1 -44 7.7 .9 15.1 1.2 23.1 1.2 45.7 0 87.7 -15.5 121.1 -41.8 -42.5 -.9 -78.3 -28.8 -90.6 -67.3 5.9 .9 11.8 1.5 18.1 1.5 8.5 0 16.8 -1.2 24.6 -3.3 -44.8 -9.1 -78.4 -48.4 -78.4 -95.7v-1.2c13.2 7.3 28.4 11.8 44.5 12.4 -26.4 -17.6 -43.5 -47.4 -43.5 -81.1 0 -17.9 4.8 -34.6 13.2 -49.1 48.4 59.3 121 98.3 202.6 102.3 -1.5 -7.3 -2.1 -14.9 -2.1 -22.5 0 -54.8 44.5 -99.3 99.3 -99.3 28.6 0 54.4 12.1 72.5 31.4 22.5 -4.2 44.5 -12.6 63.9 -23.9 -7.3 22.9 -22.9 42.2 -43.5 54.4 20.1 -2.1 39.6 -7.7 57.6 -15.5 -13.5 20.1 -30.4 37.9 -50.3 52.1z"
            />
          </svg>
        </a>

        {/* TikTok */}
               <a
          href="https://www.tiktok.com/@sportify_daw"
          target="_blank"
          rel="noopener noreferrer"
          className="social-link3"
          aria-label="TikTok"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="16"
            width="16"
            viewBox="0 0 448 512"
            style={{ color: "white" }}
          >
            <path
              fill="white"
              d="M448,209.9c-19.2,0-37.7-3.2-55-9.1c-17.3-6-33.4-14.8-48-26.3v132.4c0,77.7-63.1,140.7-140.7,140.7S64.7,384.6,64.7,306.9c0-60.7,39.3-112.2,93.7-131.3v81.3c-17.8,9.2-30,27.8-30,49.2c0,30.5,24.8,55.3,55.3,55.3s55.3-24.8,55.3-55.3V0h89.6c3.5,19.3,11.4,37.2,22.4,52.3c17.3,23.7,41.6,42.3,69.3,53.1V209.9z"
            />
          </svg>
        </a>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card {
    display: flex;
    height: 70px;
    width: 270px;
  }

  .card svg {
    position: absolute;
    display: flex;
    width: 60%;
    height: 100%;
    font-size: 24px;
    font-weight: 700;
    opacity: 1;
    transition: opacity 0.25s;
    z-index: 2;
    cursor: pointer;
  }

  .card .social-link1,
  .card .social-link2,
  .card .social-link3,
  .card .social-link4 {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 25%;
    color: whitesmoke;
    font-size: 24px;
    text-decoration: none;
    transition: 0.25s;
    border-radius: 50px;
  }

  .card svg {
    transform: scale(1);
  }

  .card .social-link1:hover {
    background: linear-gradient(
      45deg,
      #f09433 0%,
      #e6683c 25%,
      #dc2743 50%,
      #cc2366 75%,
      #bc1888 100%
    );
    animation: bounce_613 0.4s linear;
  }

  .card .social-link2:hover {
    background-color: #00ccff;
    animation: bounce_613 0.4s linear;
  }

  .card .social-link3:hover {
    background-color: #000000; /* TikTok */
    animation: bounce_613 0.4s linear;
  }

  @keyframes bounce_613 {
    40% {
      transform: scale(1.4);
    }
    60% {
      transform: scale(0.8);
    }
    80% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }
`;

export default Card;
