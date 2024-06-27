import { Geometry } from "../Geometry";
import { Matrix4 } from "../math/Matrix4";
import { Vector3 } from "../math/Vector3";
import { Buffer, DynamicBuffer } from "./Buffer";
import { Renderer } from "./Renderer";
import { DepthTexture, RenderTexture, Texture, TextureFormat } from "./Texture";
import { TextureSampler } from "./TextureSampler";
import { WEBGPUComputeShader } from "./webgpu/shader/WEBGPUComputeShader";
import { WEBGPUShader } from "./webgpu/shader/WEBGPUShader";

export interface ShaderColorOutput {
    format: TextureFormat;
};

export interface ShaderAttribute {
    location: number;
    size: number;
    type: "vec2" | "vec3" | "vec4" | "mat4"
};

export interface ShaderUniform {
    group: number;
    binding: number;
    type: "uniform" | "storage" | "storage-write" | "texture" | "sampler" | "sampler-compare" | "depthTexture";
};

export enum Topology {
    Triangles = "triangle-list",
    Points = "point-list",
    Lines = "line-list"
}

export interface ShaderParams {
    code: string;
    defines?: {[key: string]: boolean};
    attributes?: {[key: string]: ShaderAttribute};
    uniforms?: {[key: string]: ShaderUniform};
    vertexEntrypoint?: string;
    fragmentEntrypoint?: string;
    colorOutputs: ShaderColorOutput[];
    depthOutput?: TextureFormat;
    topology?: Topology;
    frontFace?: "ccw" | "cw",
    cullMode?: "back" | "front" | "none"
};

export interface ComputeShaderParams {
    code: string;
    defines?: {[key: string]: boolean};
    uniforms?: {[key: string]: ShaderUniform};
    computeEntrypoint?: string;
};

export class BaseShader {
    public readonly id: string;
    public readonly params: ShaderParams | ComputeShaderParams;

    public SetValue(name: string, value: number) {}
    public SetMatrix4(name: string, matrix: Matrix4) {}
    public SetVector3(name: string, vector: Vector3) {}
    public SetArray(name: string, array: ArrayBuffer, bufferOffset?: number, dataOffset?: number | undefined, size?: number | undefined) {}
    public SetTexture(name: string, texture: Texture | DepthTexture | RenderTexture) {}
    public SetSampler(name: string, texture: TextureSampler) {}
    public SetBuffer(name: string, buffer: Buffer | DynamicBuffer) {}
    public HasBuffer(name: string): boolean { return false }

    public OnPreRender(geometry: Geometry) {};
}

export class Shader extends BaseShader {
    public readonly id: string;
    public readonly params: ShaderParams;

    public static Create(params: ShaderParams): Shader {
        if (Renderer.type === "webgpu") return new WEBGPUShader(params);
        throw Error("Unknown api");
    }
}

export class Compute extends BaseShader {
    public readonly params: ComputeShaderParams;

    public static Create(params: ComputeShaderParams): Compute {
        if (Renderer.type === "webgpu") return new WEBGPUComputeShader(params);
        throw Error("Unknown api");
    }
}