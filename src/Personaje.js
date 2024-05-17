import React, { useRef, useState, useMemo, useEffect } from 'react';
import { RigidBody } from '@react-three/rapier';
import { Box, Line } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3, Raycaster } from 'three';

const useSideRaycasts = (obj) => {
    const raycasters = useMemo(() => [
        new Raycaster(), // Derecha
        new Raycaster(), // Izquierda
        new Raycaster(), // Arriba
        new Raycaster()  // Abajo
    ], []);
    const directions = useMemo(() => [
        new Vector3(1, 0, 0),
        new Vector3(-1, 0, 0),
        new Vector3(0, 0, 1),
        new Vector3(0, 0, -1)
    ], []);
    const distances = [Infinity, Infinity, Infinity, Infinity]; // Distancias iniciales
    const { camera, scene } = useThree(); // Obtener la cámara y la escena del contexto Three.js

    return () => {
        if (!obj.current) return distances;

        const objPosition = new Vector3();
        obj.current.getWorldPosition(objPosition); // Obtener la posición mundial del objeto

        for (let i = 0; i < raycasters.length; i++) {
            const raycaster = raycasters[i];
            const direction = directions[i];
            raycaster.set(objPosition, direction); // Usar la posición mundial del objeto como origen del rayo
            raycaster.camera = camera; // Configurar la cámara
            const intersection = raycaster.intersectObjects(scene.children);
            if (intersection.length > 0) {
                distances[i] = intersection[0].distance;
            } else {
                distances[i] = Infinity;
            }
        }

        return distances;
    }
}


const Personaje = ({ data }) => {
    const ref = useRef();
    const [distances, setDistances] = useState([Infinity, Infinity, Infinity, Infinity]);
    const sideRaycasts = useSideRaycasts(ref);
    const [counter, setCounter] = useState(0);
    const movimientos = ["derecha", "izquierda", "arriba", "abajo"];
    const [qTable, setQTable] = useState({});
    const [validPositions, setValidPositions] = useState([]);
    const [timeSinceLastMove, setTimeSinceLastMove] = useState(0);
    const [currentPos, setCurrentPos] = useState(data.inicio);
    const learningRate = 0.1;
    const discountFactor = 0.9;
    const [iterations, setIterations] = useState(0);
    const [totalIterations, setTotalIterations] = useState(0);
    const [isSimulationActive, setIsSimulationActive] = useState(true);

    useEffect(() => {
        const laberinto = data.laberinto;
        const estadosValidados = [];
        const validPositions = [];

        for (let i = 0; i < laberinto.length; i++) {
            for (let j = 0; j < laberinto[i].length; j++) {
                if (laberinto[i][j] === 0) {
                    validPositions.push([i, j]);
                }
                estadosValidados.push([i, j]);
            }
        }

        setValidPositions(validPositions);

        const qTable = {};
        estadosValidados.forEach((estado) => {
            const key = estado.toString();
            qTable[key] = {};
            movimientos.forEach(accion => {
                qTable[key][accion] = 0.0;
            });
        });

        setQTable(qTable);

        // console.log(qTable);
        // console.log(validPositions);

    },[]);

    useFrame((state, delta, xrFrame) => {

        if (!isSimulationActive) return;

        // Velocidad de movimiento
        const speed = 10000;
        const moveInterval = 1;

        setTimeSinceLastMove(timeSinceLastMove +  speed * delta);
        if (timeSinceLastMove >= moveInterval) {
            // Mover personaje
            let random = Math.floor(Math.random() * 4);
            let movimiento = movimientos[random];
            let newPosition = move(movimiento);

            // Recompensa
            let reward = 0;
            if (data.fin.toString() === newPosition.toString()) {
                reward = 1;
            }
            if (data.laberinto[newPosition[0]][newPosition[1]] === 1) {
                reward = -1;
            }

            // Actualizar Q-Table
            const key = currentPos.toString();
            const nextKey = newPosition.toString();
            
            const currentQValue = qTable[key][movimiento];
            const nextQValues = Object.values(qTable[nextKey]);
            const maxNextQValue = Math.max(...nextQValues);

            const newQValue = currentQValue + learningRate * (reward + discountFactor * maxNextQValue - currentQValue);
            setQTable({
                ...qTable,
                [key]: {
                    ...qTable[key],
                    [movimiento]: newQValue
                }
            });

            if (validPositions.some(position => position.length === newPosition.length && position.every((value, index) => value === newPosition[index]))) {
                setCurrentPos(newPosition);
                ref.current.position.set(newPosition[1] * 3, 1.5, newPosition[0] * 3);
            }
            
            // Reiniciar tiempo
            setTimeSinceLastMove(0);

            // Actualizar raycasts
            setDistances(sideRaycasts());

            // Actualizar contador
            setCounter(counter + 1);

            // Evaluaciones
            if (data.fin.toString() === newPosition.toString()) {
                console.log("Meta alcanzada");
                console.log("Contador: ", counter);
                console.log("Q-Table: ", qTable);
                console.log("Iteraciones realizadas: ", iterations);
                console.log("Iteraciones totales: ", totalIterations);
                setIsSimulationActive(false);
            }

            setTotalIterations(totalIterations + 1);
            

            if (counter === 1000) {
                console.log("Fin de la simulación");
                console.log("Q-Table: ", qTable);

                setCurrentPos(data.inicio);
                ref.current.position.set(data.inicio[1] * 3, 1.5, data.inicio[0] * 3);
                setCounter(0);
                setIterations(iterations + 1);
            }
        }
    });

    const move = (action) => {
        
        const [x, y] = currentPos;
        let newPosition = [x, y];

        switch (action) {
            case "derecha":
                newPosition = [x, y + 1];
                break;
            case "izquierda":
                newPosition = [x, y - 1];
                break;
            case "arriba":
                newPosition = [x - 1, y];
                break;
            case "abajo":
                newPosition = [x + 1, y];
                break;
            default:
                break;
        }

        if (validPositions.includes(newPosition)) {
            setCurrentPos(newPosition);
        }

        return newPosition;
    }

    const setPosition = ([a, b]) => {
        return [ a * 3, 1.5, b * 3 ];
    }

    if (data.inicio) {
        return (
            <>
                <RigidBody>
                    {/* <Box position={[data.inicio[0] * 3, 1.5, data.inicio[1] * 3]} scale={[1, 1, 1]} ref={ref}> */}
                    <Box position={setPosition(currentPos)} scale={[1, 1, 1]} ref={ref}>
                        <meshStandardMaterial color={"white"} />
                    </Box>
                </RigidBody>
                {distances.map((distance, index) => (
                    distance !== Infinity && (
                        <Line
                            key={index}
                            points={[
                                [ref.current.position.x, ref.current.position.y, ref.current.position.z],
                                [
                                    ref.current.position.x + distance * (index === 0 ? 1 : index === 1 ? -1 : 0),
                                    ref.current.position.y,
                                    ref.current.position.z + distance * (index === 2 ? 1 : index === 3 ? -1 : 0)
                                ]
                            ]}
                            color="yellow"
                            lineWidth={1}
                        />
                    )
                ))}
            </>
        )
    }

    return null;
}

export default Personaje;