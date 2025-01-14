import { Quaternion } from "three";


export type Shot = {
    rotation: Quaternion;
    blur: number;
    src: string;
}
