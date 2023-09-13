import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import DeckGL from "@deck.gl/react/typed";
import { EditableGeoJsonLayer, SelectionLayer } from "@nebula.gl/layers";
import { ViewMode, DrawPolygonMode } from "@nebula.gl/edit-modes";
import "./App.css";
import { ScatterplotLayer } from "@deck.gl/layers/typed";
import { Toolbox } from "./Toolbox";
import { SELECTION_TYPE } from "nebula.gl";
import { data } from "./data";

const MALE_COLOR = [0, 128, 255];
const FEMALE_COLOR = [255, 0, 128];

const INITIAL_VIEW_STATE = {
    longitude: -74,
    latitude: 40.7,
    zoom: 11,
    maxZoom: 16,
    pitch: 0,
    bearing: 0,
};
function App() {
    const [features, setFeatures] = useState({
        type: "FeatureCollection",
        features: [],
    });
    const [mode, setMode] = useState(() => DrawPolygonMode);
    const [selectionTool, setSelectionTool] = useState<string>(
        SELECTION_TYPE.NONE
    );
    const [modeConfig, setModeConfig] = useState<any>({});
    const [selectedFeatureIndexes, setSelectedFeatureIndexes] = useState([]);
    const maleColor = MALE_COLOR;
    const femaleColor = FEMALE_COLOR;
    const [data, setData] = useState([]);
    const [turnOffMale, setTurnOffMale] = useState(true);
    const [addScatter, SetAddScatter] = useState(false);
    const [layers, setLayers] = useState<any>([]);
    useEffect(() => {
        fetch(
            "https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/scatterplot/manhattan.json"
        ).then(async (data) => {
            const res = await data.json();
            setData(
                res.map((item: any) => ({
                    x: item[0],
                    y: item[1],
                    z: item[2],
                }))
            );
        });
    }, []);
    useEffect(() => {
        const layer = [
            new (ScatterplotLayer as any)({
                id: "scatter-plot",
                data: !addScatter
                    ? data.filter((item: any) => item.z === 1)
                    : data.filter((item: any) => item.z === 1).slice(0, 100),
                radiusScale: 30,
                pickable: true,
                radiusMinPixels: 0.25,
                getPosition: (d: any) => [d.x, d.y],
                getFillColor: (d: any) =>
                    d[2] === 1 ? femaleColor : femaleColor,
                getRadius: 1,
                updateTriggers: {
                    getFillColor: [maleColor, femaleColor],
                },
            }),
            new (ScatterplotLayer as any)({
                id: "scatter-plot-1",
                data: data.filter((item: any) => item.z === 2),
                radiusScale: 30,
                pickable: true,
                radiusMinPixels: 0.25,
                getPosition: (d: any) => [d.x, d.y],
                getFillColor: (d: any) => (d[2] === 1 ? maleColor : maleColor),
                getRadius: 1,
                // visible: turnOffMale,
                updateTriggers: {
                    getFillColor: [maleColor, femaleColor],
                },
            }),
            // @ts-ignore
            new EditableGeoJsonLayer({
                data: features,
                mode,
                modeConfig,
                selectedFeatureIndexes,
                onEdit: ({ updatedData }: any) => {
                    setFeatures(updatedData);
                },
            }),
            // @ts-ignore
            new SelectionLayer({
                id: "selection",
                selectionType: selectionTool,
                onSelect: ({ pickingInfos }: any) => {
                    console.log(pickingInfos);
                },
                layerIds: ["scatter-plot"],

                getTentativeFillColor: () => [255, 0, 255, 100],
                getTentativeLineColor: () => [0, 0, 255, 255],
                getTentativeLineDashArray: () => [0, 0],
                lineWidthMinPixels: 3,
            }),
        ];
        setLayers(layer);
    }, [data]);
    useEffect(() => {
        const layer = layers.find(
            (layer: any) => layer.id === "scatter-plot-1"
        );
        console.log(turnOffMale);
        if (layer && layers) {
            const newProps = {
                ...layer,
                props: {
                    ...layer.props,
                    visible: turnOffMale,
                },
            };
            const newLayers = layers.filter(
                (layer: any) => layer.id !== "scatter-plot-1"
            );
            newLayers.push(newProps);
            setLayers(newLayers);
        }
    }, [turnOffMale]);
    console.log(layers);
    return (
        <>
            <DeckGL
                initialViewState={INITIAL_VIEW_STATE}
                controller={{
                    doubleClickZoom: false,
                }}
                layers={layers}
                // getCursor={layer[1].getCursor.bind(layer[1])}
            ></DeckGL>
            <div style={{ position: "absolute", bottom: "10px", left: "10px" }}>
                <button style={{ background: "rgb(255, 0, 128)" }}>
                    Female
                </button>
                <button
                    style={{ background: "rgb(0, 128, 255)" }}
                    onClick={() => {
                        setTurnOffMale(!turnOffMale);
                    }}
                >
                    Male
                </button>
                <button
                    style={{ background: "red" }}
                    onClick={() => {
                        SetAddScatter(!addScatter);
                    }}
                >
                    Add Scatter
                </button>
                <button
                    style={{ background: "red" }}
                    onClick={() => {
                        const dt = [];
                        for (let i = 0; i < 1000; i++) {
                            dt.push({
                                x:
                                    (Math.random() * (73.99999 - 73.986022) +
                                        73.986022) *
                                    -1,
                                y:
                                    Math.random() * (40.730743 - 40.72123) +
                                    40.72123,
                                z: 3,
                            });
                        }
                        const newLayer = new (ScatterplotLayer as any)({
                            id: "scatter-plot-2",
                            data: dt,
                            radiusScale: 30,
                            pickable: true,
                            radiusMinPixels: 0.25,
                            getPosition: (d: any) => [d.x, d.y],
                            getFillColor: (d: any) => [60, 179, 113],
                            getRadius: 1,
                        });
                        setLayers((prev: any) => [...prev, newLayer]);
                    }}
                >
                    Add Layers
                </button>
            </div>
            <Toolbox
                mode={mode}
                onSetMode={(m) => {
                    setModeConfig(null);
                    setMode(m);
                }}
                modeConfig={modeConfig}
                onSetModeConfig={setModeConfig}
                geoJson={features}
                onSetGeoJson={setFeatures}
                onImport={setFeatures}
                setSelectionTool={setSelectionTool}
                selectionTool={selectionTool}
            />
        </>
    );
}

export default App;
