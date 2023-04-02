import react, {useState, useRef, useEffect} from 'react'
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { token, data } from '../../data';
import colormap from 'colormap'; // eslint-disable-line import/no-webpack-loader-syntax
import './styles.css';
import { getMapStats } from '../../client';

mapboxgl.accessToken = token;


function makeid(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

interface IMap{
    okvedId: number; 
}

export const Map: react.FC<IMap> = (props) => {
    const mapContainer = useRef(null as any);
    const map = useRef(null as any);
    const [lng, setLng] = useState(37);
    const [lat, setLat] = useState(55);
    const [zoom, setZoom] = useState(5);
    const [statData, setStatData] = useState({} as any);
    var unique_values = [0];
    var colors = colormap({
        colormap: 'jet',
        nshades: 20,
        format: 'hex',
        alpha: 1
    });
    if (statData == null) {
        setStatData({});
        getMapStats(props.okvedId).then((e) => {
            setStatData(e);
        })
    } else {
        for (const item in data) {
            if (!unique_values.includes(statData[item])) {
                unique_values.push(statData[item]);
            }
        }
        colors = colormap({
            colormap: 'greys',
            nshades: Math.max(unique_values.length, 9),
            format: 'hex',
            alpha: 1
        });
        unique_values.sort();
    }
    console.log(lng, lat, zoom)
    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [lng, lat],
            zoom: zoom
        });
        var arr = [10, 20, 30];
        map.current.on('load', () => {
            for (const prop in data) {
                var id = makeid(5);
                map.current.addSource(id, {
                    type: 'geojson',
                    data: (data as any)[prop as any] as any
                });
                var color = 'white';
                if (data) {
                    var index = unique_values.indexOf(statData[prop])
                    if (index != -1) color = colors[index];
                }
                map.current.addLayer({
                    'id': id,
                    'type': 'fill-extrusion',
                    'source': id,
                    'paint': {
                        'fill-extrusion-color': colors[Math.floor(Math.random()*colors.length)], // blue color fill
                        //'fill-opacity': 0.5,
                        'fill-extrusion-base': 0,
                        "fill-extrusion-opacity": 0.7,
                        'fill-extrusion-height': 0
                    }
                })
            }
        });
    });

    return (
        <div>
            <div ref={mapContainer} className="map-container" />
        </div>
    )
}