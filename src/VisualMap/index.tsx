import React from "react";
import { Container, Label, StyledVisualMap } from "./styled";
import { Catelogy } from "../App";

interface Props {
    listDisable: string[];
    catelogy: Catelogy[];
    onClick: (name: string) => void;
}
const VisualMap = ({ catelogy, onClick, listDisable }: Props) => {
    return (
        <StyledVisualMap>
            {catelogy.map((item) => (
                <Container
                    key={item.name}
                    onClick={() => {
                        onClick(item.name);
                    }}
                >
                    <Label
                        style={{
                            background: listDisable.includes(item.name)
                                ? "transparent"
                                : item.color,
                        }}
                    ></Label>
                    <span
                        style={{
                            pointerEvents: "none",
                            opacity: listDisable.includes(item.name) ? 0.5 : 1,
                        }}
                    >
                        Cluster {item.name}
                    </span>
                </Container>
            ))}
        </StyledVisualMap>
    );
};

export default VisualMap;
