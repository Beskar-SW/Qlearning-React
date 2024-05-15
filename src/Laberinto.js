import React, { Fragment, memo } from 'react';
import { RigidBody } from '@react-three/rapier';
import { Box } from '@react-three/drei';

const LaberintoMuro = memo(({ position, scale, color }) => {

    return (
      <RigidBody type="fixed">
        <Box position={position} scale={scale}>
          <meshStandardMaterial color={color} />
        </Box>
      </RigidBody>
    )
  });

const Laberinto = ({data}) => {
    if (Array.isArray(data.laberinto) && data.laberinto.length > 0){
        return data.laberinto.map((row, i) => (
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
  
      return 
}

export default Laberinto;