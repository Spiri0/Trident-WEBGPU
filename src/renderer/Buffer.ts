import { Renderer } from "./Renderer";
import { WEBGPUBuffer } from "./webgpu/WEBGPUBuffer";

export enum BufferType {
    STORAGE,
    UNIFORM,
    VERTEX,
    INDEX
};

export class Buffer {
    public readonly size: number;
    public static Create(size: number, type: BufferType) {
        if (Renderer.type === "webgpu") return new WEBGPUBuffer(size, type);
        else throw Error("Renderer type invalid");
    }

    public SetArray(array: ArrayBuffer, bufferOffset: number = 0, dataOffset?: number | undefined, size?: number | undefined) {}
}