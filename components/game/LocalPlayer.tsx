import { useRef, useEffect } from "react";
import { Mesh } from "three";
import { useStore } from "@/hooks/useStore";
import { PlayerController } from "./PlayerController";
import type { PlayerState } from "playroomkit";
import { NamePlate } from "./NamePlate";
import { useGLTF } from "@react-three/drei";

interface LocalPlayerProps {
  player: PlayerState;
  user: {
    name: string;
    color: string;
  };
}

export const LocalPlayer = (props: LocalPlayerProps) => {
  const player = props.player;
  const { name, color } = props.user;
  const { scene: moodeng } = useGLTF("/moodeng.glb?id=" + player.id);
  const { actions } = useStore();

  useEffect(() => {
    if (!moodeng) return;
    moodeng.traverse((child) => {
      if (child.type === "Mesh") {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    actions.addLocalEntity({
      id: player.id,
      name,
      color,
      type: "localPlayer",
      mesh: moodeng,
    });
  }, [moodeng]);

  return (
    <>
      <PlayerController player={player}>
        <NamePlate name={name} />
        <primitive object={moodeng} scale={0.125} />
      </PlayerController>
    </>
  );
};
