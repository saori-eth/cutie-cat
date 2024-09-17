// Bullets.js
import { useStore } from "@/hooks/useStore";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody, useRapier } from "@react-three/rapier";
import { useEffect, useMemo, useRef } from "react";
import { Vector3, Mesh } from "three";

export const Bullets = () => {
  const { actions, selectors } = useStore();
  const bullets = selectors.getBullets();
  const myId = selectors.getLocalEntity()?.id;

  // Load the model once
  const watermelonModel = useGLTF("/watermelon.glb");

  useFrame(() => {
    const now = Date.now();
    bullets.forEach((bullet) => {
      const bulletTimestamp = bullet.id.split("~")[1];
      const timeSinceShot = now - Number(bulletTimestamp);
      if (timeSinceShot > 10000) {
        actions.removeBullet(bullet.id);
      }
    });
  });

  return (
    <group>
      {bullets.map((bullet) => (
        <Bullet
          key={bullet.id}
          myId={myId ? myId : ""}
          model={watermelonModel}
          {...bullet}
        />
      ))}
    </group>
  );
};
const BULLET_SPEED = 20;

const Bullet = ({ myId, id, position, direction, model }) => {
  const { actions } = useStore();
  const physicsRef = useRef<RapierRigidBody>(null);
  const meshRef = useRef<Mesh>(null);
  const bulletEntityId = id.split("~")[0];
  const clonedModel = useMemo(() => model.scene.clone(), [model]);

  useEffect(() => {
    if (!physicsRef.current) return;
    physicsRef.current.userData = {
      type: "bullet",
      playerId: id.split("-")[0],
      damage: 10,
    };
    const dir = new Vector3(...direction);
    physicsRef.current.setLinvel(dir.multiplyScalar(BULLET_SPEED), true);
  }, []);

  return (
    <group position={[position[0], position[1] + 0.5, position[2]]}>
      <RigidBody
        ref={physicsRef}
        gravityScale={0}
        sensor
        ccd
        onIntersectionEnter={(e) => {
          // if bullet came from entity, and the type of collider it hit is "self", don't remove bullet
          if (myId === bulletEntityId) {
            //@ts-expect-error
            if (e.other.rigidBody?.userData.type === "self") return;
            //@ts-expect-error
            if (e.other.rigidBody?.userData.type === "bullet") return;
          }

          // if bullet came from remote player, and the type of collider it hit is "remotePlayer", don't remove bullet
          if (myId !== bulletEntityId) {
            //@ts-expect-error
            if (e.other.rigidBody?.userData.type === "remotePlayer") return;
            //@ts-expect-error
            if (e.other.rigidBody?.userData.type === "bullet") return;
          }
          // @ts-expect-error
          meshRef.current?.material.color.set("white");
          actions.removeBullet(id);
        }}
      >
        <primitive object={clonedModel} position={[0.4, 0, 0]} />
      </RigidBody>
    </group>
  );
};
