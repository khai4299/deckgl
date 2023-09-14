import styled from "styled-components";

export const StyledVisualMap = styled.div`
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export const Label = styled.div`
    width: 20px;
    height: 10px;
    border-radius: 5px;
`;

export const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: left;
    gap: 5px;
    cursor: pointer;
`;
