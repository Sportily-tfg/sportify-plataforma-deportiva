import styled from 'styled-components';

export const HamburgerButton = styled.button`
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: 10px;
    z-index: 1001;
    
    @media (max-widtd: 768px) {
        display: block;
    }

    .icon {
        color: #FAFAFA;
        font-size: 1.5rem;
    }
`;
