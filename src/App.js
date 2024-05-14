import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useState, memo, Fragment, useRef, useCallback} from "react";
import { Suspense } from "react";
import {Physics, RigidBody} from "@react-three/rapier"
import { Box } from "@react-three/drei";

const LaberintoMuro = memo(({ position, scale, color }) => (
  <RigidBody type="fixed">
    <Box position={position} scale={scale}>
      <meshStandardMaterial color={color} />
    </Box>
  </RigidBody>
));

function App() {
  const [data, setData] = useState({});
  const personaje = useRef();
  


  // const moverPersonaje = useCallback((event) => {
  //   if (event.key === "ArrowUp") {
  //     personaje.current.applyImpulse({x: 0, y: 0, z: -4});
  //   }
  //   if (event.key === "ArrowDown") {
  //     personaje.current.applyImpulse({x: 0, y: 0,
  //       z: 4});
  //   }
  //   if (event.key === "ArrowLeft") {
  //     personaje.current.applyImpulse({x: -4, y: 0
  //       , z: 0});
  //   }
  //   if (event.key === "ArrowRight") {
  //     personaje.current.applyImpulse({x: 4, y: 0, z: 0});
  //   }
  // }, []);

  const handleClick = () => {
    personaje.current.applyImpulse({x: 0, y: 4, z: 0});
  }

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
        camera_position: [x * 1 / 2, 40, y * 6 / 2],
      });

    }
    loadData();
  }, []);


  // useEffect(() => {
  //   document.addEventListener("keydown", moverPersonaje);

  //   return () => {
  //     document.removeEventListener("keydown", moverPersonaje);
  //   }
  // }, [moverPersonaje]);


  return (
    // <Canvas shadows camera={{ fov: 64, position: [40, 40, 30], rotateX: 5}}>
    <Canvas shadows camera={{ fov: 64, position: data.camera_position, rotateX: 5}}>
      <Suspense>
        <Physics debug>
          <ambientLight intensity={0.5} />
          <OrbitControls />
          {
            data.laberinto && data.laberinto.map((row, i) => (
              <Fragment key={i}>
                {
                  row.map((cell, j) => (
                    <Fragment key={ `${i}-${j}` }>
                      
                      {cell === 1 ? <LaberintoMuro  position={[i*3, 0, j*3]} scale={[3, 3, 3]} color={"purple"} /> : <LaberintoMuro  position={[i*3, -2, j*3]} scale={[3, 2, 3]} color={"red"} /> }
                      {
                        cell === 1 && (
                          <LaberintoMuro
                            position={[i * 3, 1.5, j * 3]}
                            scale={[3, 3, 3]}
                            color={"purple"}
                          />
                        )
                      }
                      
                    </Fragment>
                  ))
                }
              </Fragment>
            ))
          }

          {
            data.inicio && (
              <RigidBody ref={personaje}>
                <Box position={[data.inicio[0] * 3, 1.5, data.inicio[1] * 3]} scale={[1, 1, 1]} onClick={handleClick}>
                  <meshStandardMaterial color={"white"} />
                </Box>
              </RigidBody>
            )
          }

        </Physics>
      </Suspense>
    </Canvas>
  );
}

export default App;
