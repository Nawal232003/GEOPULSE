import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

const GLOBE_RADIUS = 2;

// Convert Lat/Lng to 3D Cartesian coordinates
const latLngToVector3 = (lat, lng, radius) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);

    return new THREE.Vector3(x, y, z);
};

// Component to render country borders parsing standard GeoJSON coordinates
const Borders = ({ data }) => {
    const lines = useMemo(() => {
        if (!data) return null;
        let points = [];

        data.forEach(feature => {
            const { geometry } = feature;
            if (!geometry || !geometry.coordinates) return;

            const createLinePoints = (coords) => {
                coords.forEach((coordPair) => {
                    // GeoJSON features [lng, lat]
                    let v = latLngToVector3(coordPair[1], coordPair[0], GLOBE_RADIUS + 0.005);
                    points.push(v);
                });
            };

            if (geometry.type === 'Polygon') {
                geometry.coordinates.forEach(coords => createLinePoints(coords));
            } else if (geometry.type === 'MultiPolygon') {
                geometry.coordinates.forEach(polygon => {
                    polygon.forEach(coords => createLinePoints(coords));
                });
            }
        });

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        return geometry;
    }, [data]);

    if (!lines) return null;

    return (
        <lineSegments geometry={lines}>
            <lineBasicMaterial color="#333333" transparent opacity={0.5} />
        </lineSegments>
    );
};

// Represents a single glowing dot on the map
const Marker = ({ article, onSelect }) => {
    const [hovered, setHovered] = useState(false);
    const { lat, lng } = article.location;

    const position = useMemo(() => latLngToVector3(lat, lng, GLOBE_RADIUS + 0.1), [lat, lng]);

    return (
        <group position={position}>
            <mesh
                onPointerOver={(e) => {
                    e.stopPropagation();
                    setHovered(true);
                }}
                onPointerOut={() => setHovered(false)}
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect(article);
                }}
            >
                <sphereGeometry args={[hovered ? 0.08 : 0.04, 16, 16]} />
                <meshBasicMaterial color={hovered ? '#ffffff' : '#FFD700'} />
            </mesh>

            {/* Floating UI on hover */}
            {hovered && (
                <Html distanceFactor={10} position={[0, 0.2, 0]} center>
                    <div className="glass-panel text-xs p-2 rounded w-48 pointer-events-none text-white font-bold whitespace-normal">
                        {article.title}
                    </div>
                </Html>
            )}
        </group>
    );
};

export default function Globe({ articles, onSelectArticle, setHovering }) {
    const groupRef = useRef();
    const [geoData, setGeoData] = useState(null);

    useEffect(() => {
        // Fetch geojson boundaries
        fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
            .then(res => res.json())
            .then(data => setGeoData(data.features))
            .catch(err => console.error("Could not load countries", err));
    }, []);

    return (
        <group
            ref={groupRef}
            onPointerEnter={() => setHovering && setHovering(true)}
            onPointerLeave={() => setHovering && setHovering(false)}
        >
            <mesh>
                <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
                <meshStandardMaterial color="#050505" opacity={0.9} transparent />
            </mesh>

            {/* Renders line borders instead of polygons to stay lightweight */}
            <Borders data={geoData} />

            {articles.filter(a => a.location?.lat && a.location?.lng).map((article, index) => (
                <Marker key={article._id || `marker-${index}-${article.location.lat}-${article.location.lng}`} article={article} onSelect={onSelectArticle} />
            ))}
        </group>
    );
}
