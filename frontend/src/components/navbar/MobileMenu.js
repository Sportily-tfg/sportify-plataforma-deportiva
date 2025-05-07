import styled from "styled-components";

export const MobileMenu = styled.div`
    position: fixed;
    top: 80px;
    left: 0;
    width: 100%;
    background-color: #212121;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    transform: ${({ $isOpen }) => ($isOpen ? 'translateX(0)' : 'translateX(-100%)')};
    transition: transform 0.3s ease;
    z-index: 1000;

    @media (min-width: 769px) {
        display: none;
    }
`;