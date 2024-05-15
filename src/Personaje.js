import React, { useEffect, useRef, useState, useMemo } from 'react'
import { RigidBody } from '@react-three/rapier';
import { Box } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3, Raycaster } from 'three';


const useForwardRaycast = (obj) => {
    const raycaster = useMemo(() => new Raycaster(), [])
    const pos = useMemo(() => new Vector3(), [])
    const dir = useMemo(() => new Vector3(), [])
    const scene = useThree((state) => state.scene)

    return () => {
        if (!obj.current) return []
        raycaster.set(obj.current.getWorldPosition(pos), obj.current.getWorldDirection(dir))
        return raycaster.intersectObjects(scene.children)
    }
}

const Personaje = ({ data }) => {

    const ref = useRef();
    const { scene } = useThree();
    const raycast = useForwardRaycast(ref);

    useFrame((state, delta)=>{
        ref.current.rotation.y += 1 * delta;
        const intersections = raycast();
        if (intersections.length) {
            // change color for the intersected object
            for (let i = 0; i < intersections.length; i++) {
                intersections[i].object.material.color.set("red");
            }
        }
    })


    if (data.inicio) {

        return (
            <>
                <RigidBody>
                    <Box position={[data.inicio[0] * 3, 1.5, data.inicio[1] * 3]} scale={[1, 1, 1]} ref={ref}>
                        <meshStandardMaterial color={"white"} />
                    </Box>
                </RigidBody>
            </>
        )
    }

    return <></>
}

export default Personaje;