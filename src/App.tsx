import { ScatterplotLayer } from "@deck.gl/layers/typed";
import DeckGL from "@deck.gl/react/typed";
import { DrawPolygonMode } from "@nebula.gl/edit-modes";
import { EditableGeoJsonLayer, SelectionLayer } from "@nebula.gl/layers";
import { SELECTION_TYPE } from "nebula.gl";
import { useEffect, useState } from "react";
import "./App.css";
import { Toolbox } from "./Toolbox";
import VisualMap from "./VisualMap";
import { hexToRgb } from "./utils";

const INITIAL_VIEW_STATE = {
    longitude: -19.577,
    latitude: -13.624,
    zoom: 3,
    maxZoom: 16,
    pitch: 0,
    bearing: 0,
};

export interface Data {
    name: string;
    mode: string;
    text: string[];
    x: number[];
    y: number[];
    marker: Marker;
}

export interface Marker {
    color: string[];
}
export interface Catelogy {
    name: string;
    color: string;
}
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
    const [selectedFeatureIndexes] = useState([]);
    const [data, setData] = useState<Data[] | null>(null);
    const [layers, setLayers] = useState<any>([]);
    const [catelogy, setCatelogy] = useState<Catelogy[]>([]);
    const [layersDisable, setLayersDisable] = useState<string[]>([]);

    useEffect(() => {
        // fetch(
        //     "https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/scatterplot/manhattan.json"

        fetch(
            "https://gist.githubusercontent.com/helrick/98afd97b03162fa3871e72e097b5170b/raw/e179f8b46969c0f8501bab8eb565561b6fb24d04/tsne-categorical.json"
        ).then(async (data) => {
            const res: Data[] = await data.json();
            const catelogyList: Catelogy[] = [];
            res.forEach((item) => {
                const name = item.name;
                const color = item.marker.color[0];
                catelogyList.push({
                    name,
                    color,
                });
            });
            console.log(res);
            setCatelogy(catelogyList);
            setData(res);
        });
    }, []);
    useEffect(() => {
        if (data) {
            const layerPlot: any = [];
            // @ts-ignore
            const editLayer = new EditableGeoJsonLayer({
                data: features,
                mode,
                modeConfig,
                selectedFeatureIndexes,
                onEdit: ({ updatedData }: any) => {
                    setFeatures(updatedData);
                },
            });
            // @ts-ignore
            const selectionLayer = new SelectionLayer({
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
            });
            layerPlot.push(editLayer);
            layerPlot.push(selectionLayer);
            data.forEach((item) => {
                const formatData = item.text.map((_, i) => ({
                    x: item.x[i],
                    y: item.y[i],
                    color: item.marker.color[i],
                    text: item.text[i],
                    cluster: item.name,
                }));
                const scatterPlot = new (ScatterplotLayer as any)({
                    id: `scatter-plot-${item.name}`,
                    data: formatData,
                    pickable: true,
                    stroked: true,
                    radiusUnits: "common",
                    radiusScale: 0.5,
                    lineWidthMinPixels: 0.5,
                    visible: !layersDisable.includes(item.name),
                    getPosition: (d: any) => [d.x, d.y],
                    getFillColor: (d: any) => hexToRgb(d.color),
                });
                layerPlot.push(scatterPlot);
            });

            setLayers(layerPlot);
        }
    }, [data, selectionTool, mode, features, layersDisable]);

    const onClusterClick = (name: string) => {
        let newLayersDisable = [];
        if (layersDisable.includes(name)) {
            newLayersDisable = layersDisable.filter((layer) => layer !== name);
        } else {
            newLayersDisable = [...layersDisable, name];
        }
        setLayersDisable(newLayersDisable);
    };
    return (
        <>
            {layers.length && (
                <DeckGL
                    initialViewState={INITIAL_VIEW_STATE}
                    controller={{
                        doubleClickZoom: false,
                    }}
                    layers={layers}
                    getTooltip={({ object }) =>
                        object &&
                        object.text &&
                        object.cluster &&
                        `${object.text}\nCluster ${object.cluster}`
                    }
                    getCursor={layers[0].getCursor.bind(layers[0])}
                ></DeckGL>
            )}

            <VisualMap
                listDisable={layersDisable}
                catelogy={catelogy}
                onClick={onClusterClick}
            />
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
