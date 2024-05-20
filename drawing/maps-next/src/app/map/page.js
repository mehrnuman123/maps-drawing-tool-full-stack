'use client';
import { AuthenticatedUser, saveDrawingShapes } from '@/utils/ApiService';
import { useRouter } from 'next/navigation';
import Map from 'ol/Map';
import View from 'ol/View';
import { click } from 'ol/events/condition';
import { GeoJSON } from 'ol/format';
import { Polygon } from 'ol/geom';
import { Draw, Select } from 'ol/interaction';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import 'ol/ol.css';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import { Fill, Stroke, Style } from 'ol/style';
import { useEffect, useRef, useState } from 'react';
import Toolbar from '../../components/Toolbar';

const MapComponent = () => {
    const router = useRouter();
    const [user, setUser] = useState(null)
    const mapContainer = useRef(null);
    const [map, setMap] = useState(null);
    const [drawInteraction, setDrawInteraction] = useState(null);
    const [selectInteraction, setSelectInteraction] = useState(null);
    const [selectedFeature, setSelectedFeature] = useState(null);
    const [isSave, setIsSave] = useState(null);

    const vectorSource = useRef(new VectorSource({ wrapX: false }));
    const vectorLayer = useRef(
        new VectorLayer({
            source: vectorSource.current,
            style: new Style({
                fill: new Fill({
                    color: 'rgba(0, 0, 255, 0.3)', // Blue fill color with opacity
                }),
                stroke: new Stroke({
                    color: '#ff0000',
                    width: 2,
                }),
            }),
        })
    );

    useEffect(() => {
        const logedInUser = async () => {
            try {
                const result = await AuthenticatedUser();
                if (result) setUser(result);
            }
            catch (e) {
                router.push('/')
            }
        }
        logedInUser()
    }, [])


    useEffect(() => {
        const initialMap = new Map({
            target: mapContainer.current,
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
                vectorLayer.current,
            ],
            view: new View({
                center: fromLonLat([24.7536, 59.4370]),
                zoom: 12,
            }),
        });

        setMap(initialMap);

        return () => {
            initialMap.setTarget(null);
        };
    }, []);

    const addDrawInteraction = (type) => {
        if (drawInteraction) {
            map.removeInteraction(drawInteraction);
        }
        if (selectInteraction) {
            map.removeInteraction(selectInteraction);
            setSelectInteraction(null);
        }

        let geometryFunction = null;
        let drawType = type;

        if (type === 'Rectangle') {
            drawType = 'Circle';
            geometryFunction = (coordinates, geometry) => {
                if (!geometry) {
                    geometry = new Polygon([]);
                }
                const [start, end] = coordinates;
                geometry.setCoordinates([
                    [
                        start,
                        [end[0], start[1]],
                        end,
                        [start[0], end[1]],
                        start,
                    ],
                ]);
                return geometry;
            };
        }

        const newDrawInteraction = new Draw({
            source: vectorSource.current,
            type: drawType,
            geometryFunction: geometryFunction,
            style: new Style({
                fill: new Fill({
                    color: 'rgba(0, 255, 0, 0.3)', // Green color while drawing
                }),
                stroke: new Stroke({
                    color: '#00ff00',
                    width: 2,
                }),
            }),
        });

        map.getViewport().style.cursor = 'pointer';

        vectorSource.current.on('addfeature', (e) => {
            const drawnFeature = e.feature;
            vectorSource.current.getFeatures().forEach((feature) => {
                if (feature !== drawnFeature) {
                    if (drawnFeature.getGeometry().intersectsExtent(feature.getGeometry().getExtent())) {
                        vectorSource.current.removeFeature(drawnFeature);
                    }
                }
            });
        });

        map.addInteraction(newDrawInteraction);
        setDrawInteraction(newDrawInteraction);
    };

    const handleEraseShape = () => {
        if (selectedFeature) {
            vectorSource.current.removeFeature(selectedFeature);
            setSelectedFeature(null);
            map.getViewport().style.cursor = 'default';
        }
    };

    const handleSelect = () => {
        if (drawInteraction) {
            map.removeInteraction(drawInteraction);
            setDrawInteraction(null);
        }
        if (selectInteraction) {
            map.removeInteraction(selectInteraction);
        }

        const newSelectInteraction = new Select({
            condition: click,
        });

        newSelectInteraction.on('select', (e) => {
            const selectedFeatures = e.selected;
            if (selectedFeatures.length > 0) {
                setSelectedFeature(selectedFeatures[0]);
                selectedFeatures.forEach((feature) => {
                    feature.setStyle(
                        new Style({
                            fill: new Fill({
                                color: 'rgba(0, 0, 255, 0.3)', // Blue color when selected
                            }),
                            stroke: new Stroke({
                                color: '#0000ff',
                                width: 3,
                            }),
                        })
                    );
                });
            } else {
                setSelectedFeature(null);
            }
            e.deselected.forEach((feature) => {
                feature.setStyle(null); // Reset to default style
            });
        });

        map.addInteraction(newSelectInteraction);
        setSelectInteraction(newSelectInteraction);
        map.getViewport().style.cursor = 'default';
    };


    const saveAllFeatures = async () => {
        setIsSave(null)
        const features = vectorSource.current.getFeatures();
        const geoJsonFormat = new GeoJSON();
        const geoJsonFeatures = features.map(feature => geoJsonFormat.writeFeatureObject(feature));
        try {
            const response = await saveDrawingShapes(JSON.stringify(geoJsonFeatures))
            if (response) {
                setIsSave('Data saved successfully !!')
            }

        } catch (error) {
            console.error('Error saving all drawings:', error);
        }
    };
    return (
        <div style={{ padding: '2rem' }}>
            <div className='map-topbar'>
                <div className='map-topbar-cont1'>
                    <p >Welcome: <b>{user?.username}</b></p>
                </div>
                <div className='map-topbar-cont2'>
                    {isSave != null && <span>{isSave}</span>}
                </div>
            </div>
            <div ref={mapContainer} style={{ width: '100%', height: '90vh', display: 'flex', justifyContent: 'end' }}>
                <Toolbar onDrawShape={addDrawInteraction} onSelect={handleSelect} onEraseShape={handleEraseShape} onSave={saveAllFeatures} />
            </div>
        </div>
    );
};

export default MapComponent;
