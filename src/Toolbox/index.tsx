import * as React from "react";
import { Dispatch, SetStateAction } from "react";

import {
    ViewMode,
    DrawPointMode,
    DrawLineStringMode,
    DrawPolygonMode,
    DrawCircleFromCenterMode,
    DrawRectangleMode,
    MeasureDistanceMode,
    MeasureAngleMode,
    MeasureAreaMode,
    GeoJsonEditMode,
} from "@nebula.gl/edit-modes";
import styled from "styled-components";
import { LuMousePointer2, LuArrowDownToDot } from "react-icons/lu";
import {
    BiShapePolygon,
    BiRectangle,
    BiCircle,
    BiRuler,
    BiShapeTriangle,
    BiShapeSquare,
    BiExport,
    BiImport,
    BiTrashAlt,
    BiPolygon,
} from "react-icons/bi";
import { AiOutlineRise } from "react-icons/ai";
import { FiSettings } from "react-icons/fi";
import { SELECTION_TYPE } from "nebula.gl";

const Tools = styled.div`
    position: absolute;
    display: flex;
    flex-direction: column;
    top: 10px;
    right: 10px;
`;

const Button = styled.button<{ active?: boolean; kind?: string }>`
    color: #fff;
    background: ${({ kind, active }) =>
        kind === "danger"
            ? "rgb(180, 40, 40)"
            : active
            ? "rgb(0, 105, 217)"
            : "rgb(90, 98, 94)"};
    font-size: 1em;
    font-weight: 400;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
        "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji",
        "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    border: 1px solid transparent;
    border-radius: 0.25em;
    margin: 0.05em;
    padding: 0.1em 0.2em;
    &:hover {
        background: red;
    }
`;

const SubToolsContainer = styled.div`
    position: relative;
`;

const SubTools = styled.div`
    display: flex;
    flex-direction: row-reverse;
    position: absolute;
    top: 0;
    right: 0;
`;

export type Props = {
    mode: typeof GeoJsonEditMode;
    modeConfig: any;
    geoJson: any;
    selectionTool?: string;
    setSelectionTool: Dispatch<SetStateAction<string>>;
    onSetMode: (mode: typeof GeoJsonEditMode) => unknown;
    onSetModeConfig: (modeConfig: any) => unknown;
    onSetGeoJson: (geojson: any) => unknown;
    onImport: (imported: any) => unknown;
};

const MODE_GROUPS = [
    {
        modes: [
            {
                mode: ViewMode,
                content: <LuMousePointer2 />,
                selectionTool: SELECTION_TYPE.NONE,
            },
        ],
    },
    {
        modes: [
            {
                mode: DrawPointMode,
                content: <LuArrowDownToDot />,
                selectionTool: SELECTION_TYPE.NONE,
            },
        ],
    },
    {
        modes: [
            {
                mode: DrawLineStringMode,
                content: <AiOutlineRise />,
                selectionTool: SELECTION_TYPE.NONE,
            },
        ],
    },
    {
        modes: [
            {
                mode: ViewMode,
                selectionTool: SELECTION_TYPE.POLYGON,
                content: <BiPolygon />,
            },
        ],
    },
    {
        modes: [
            {
                mode: DrawPolygonMode,
                content: <BiShapePolygon />,
                selectionTool: SELECTION_TYPE.NONE,
            },
            {
                mode: DrawRectangleMode,
                content: <BiRectangle />,
                selectionTool: SELECTION_TYPE.NONE,
            },
            {
                mode: DrawCircleFromCenterMode,
                content: <BiCircle />,
                selectionTool: SELECTION_TYPE.NONE,
            },
        ],
    },
    {
        modes: [
            {
                mode: MeasureDistanceMode,
                content: <BiRuler />,
                selectionTool: SELECTION_TYPE.NONE,
            },
            {
                mode: MeasureAngleMode,
                content: <BiShapeTriangle />,
                selectionTool: SELECTION_TYPE.NONE,
            },
            {
                mode: MeasureAreaMode,
                content: <BiShapeSquare />,
                selectionTool: SELECTION_TYPE.NONE,
            },
        ],
    },
];

function ModeButton({ buttonConfig, mode, onClick, selectionTool }: any) {
    return (
        <Button
            active={
                buttonConfig.mode === mode &&
                buttonConfig.selectionTool === selectionTool
            }
            onClick={onClick}
        >
            {buttonConfig.content}
        </Button>
    );
}
function ModeGroupButtons({
    modeGroup,
    mode,
    onSetMode,
    selectionTool,
    setSelectionTool,
}: any) {
    const [expanded, setExpanded] = React.useState(false);

    const { modes } = modeGroup;

    let subTools = null;

    if (expanded) {
        subTools = (
            <SubTools>
                {modes.map((buttonConfig: any, i: any) => (
                    <ModeButton
                        key={i}
                        buttonConfig={buttonConfig}
                        mode={mode}
                        selectionTool={selectionTool}
                        onClick={() => {
                            onSetMode(() => buttonConfig.mode);
                            setSelectionTool(() => buttonConfig.selectionTool);
                            setExpanded(false);
                        }}
                    />
                ))}
            </SubTools>
        );
    }

    // Get the button config if it is active otherwise, choose the first
    const buttonConfig = modes.find((m: any) => m.mode === mode) || modes[0];

    return (
        <SubToolsContainer>
            {subTools}
            <ModeButton
                buttonConfig={buttonConfig}
                mode={mode}
                onClick={() => {
                    onSetMode(() => buttonConfig.mode);
                    setSelectionTool(() => buttonConfig.selectionTool);
                    setExpanded(true);
                }}
            />
        </SubToolsContainer>
    );
}

export function Toolbox({
    mode,
    modeConfig,
    geoJson,
    onSetMode,
    onSetModeConfig,
    onSetGeoJson,
    onImport,
    selectionTool,
    setSelectionTool,
}: Props) {
    const [showConfig, setShowConfig] = React.useState(false);
    const [showImport, setShowImport] = React.useState(false);
    const [showExport, setShowExport] = React.useState(false);
    const [showClearConfirmation, setShowClearConfirmation] =
        React.useState(false);
    return (
        <>
            <Tools>
                {MODE_GROUPS.map((modeGroup, i) => (
                    <ModeGroupButtons
                        key={i}
                        selectionTool={selectionTool}
                        setSelectionTool={setSelectionTool}
                        modeGroup={modeGroup}
                        mode={mode}
                        onSetMode={onSetMode}
                    />
                ))}
                <Button
                    onClick={() => {
                        onSetGeoJson({
                            type: "FeatureCollection",
                            features: [],
                        });
                    }}
                    title="Clear"
                >
                    <BiTrashAlt />
                </Button>
                {/* <Button onClick={() => setShowExport(true)} title="Export">
                    <BiExport />
                </Button>
                <Button onClick={() => setShowImport(true)} title="Import">
                    <BiImport />
                </Button>

                <SubToolsContainer>
                    {showConfig && (
                        <SubTools>
                            <Button onClick={() => setShowConfig(false)}>
                            </Button>
                            <Button
                                onClick={() =>
                                    onSetModeConfig({
                                        booleanOperation: "difference",
                                    })
                                }
                                active={
                                    modeConfig &&
                                    modeConfig.booleanOperation === "difference"
                                }
                            >
                            </Button>
                            <Button
                                onClick={() =>
                                    onSetModeConfig({
                                        booleanOperation: "union",
                                    })
                                }
                                active={
                                    modeConfig &&
                                    modeConfig.booleanOperation === "union"
                                }
                            >
                            </Button>
                            <Button
                                onClick={() =>
                                    onSetModeConfig({
                                        booleanOperation: "intersection",
                                    })
                                }
                                active={
                                    modeConfig &&
                                    modeConfig.booleanOperation ===
                                        "intersection"
                                }
                            >
                            </Button>
                        </SubTools>
                    )}
                    <Button onClick={() => setShowConfig(true)}>
                        <FiSettings />
                    </Button>
                </SubToolsContainer>

                <SubToolsContainer>
                    {showClearConfirmation && (
                        <SubTools>
                            <Button
                                onClick={() => {
                                    onSetGeoJson({
                                        type: "FeatureCollection",
                                        features: [],
                                    });
                                    setShowClearConfirmation(false);
                                }}
                                kind="danger"
                                title="Clear all features"
                            >
                            </Button>
                            <Button
                                onClick={() => setShowClearConfirmation(false)}
                            >
                                Cancel
                            </Button>
                        </SubTools>
                    )}
                    <Button
                        onClick={() => {
                            onSetGeoJson({
                                type: "FeatureCollection",
                                features: [],
                            });
                        }}
                        title="Clear"
                    >
                        <BiTrashAlt />
                    </Button>
                </SubToolsContainer> */}

                {/* zoom in and out */}
            </Tools>

            {/* {showImport && (
                <ImportModal
                    onImport={(imported) => {
                        onImport(imported);
                        setShowImport(false);
                    }}
                    onClose={() => setShowImport(false)}
                />
            )}

            {showExport && (
                <ExportModal
                    geoJson={geoJson}
                    onClose={() => setShowExport(false)}
                />
            )} */}
        </>
    );
}
