import { Canvas} from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useState} from "react";
import { Suspense } from "react";
import {Physics} from "@react-three/rapier"
import Game from "./Container";

function App() {
  const [data, setData] = useState({});

  useEffect(() => {
    async function loadData() {

      const laberinto = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
        [1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      ]

      let x = 0;
      let y = 0;

      for (let i = 0; i < laberinto.length; i++) {
        if (Array.isArray(laberinto[i])) {
          x++;
        }
        y = laberinto[i].length;
      }

      setData({
        laberinto: laberinto,
        size: [x, y],
        inicio: [1, 1],
        fin: [6, 3],
        recompensas: [[1, 8], [8, 8], [8, 1], [3, 1], [3, 6], [5, 6], [5, 3]],
        camera_position: [x * 1 / 2, 40, y * 6 / 2],
      });

    }
    loadData();
  }, []);
    
  return (
    // <Canvas shadows camera={{ fov: 64, position: [40, 40, 30], rotateX: 5}}>
    <Canvas shadows camera={{ fov: 64, position: data.camera_position, rotateX: 5}}>
      <Suspense>
        <Physics debug>
          <ambientLight intensity={0.5} />
          <OrbitControls />
          <Game data={data} />
        </Physics>
      </Suspense>
    </Canvas>
  );
}

export default App;