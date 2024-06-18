import { Geometry } from "../../Geometry";
import { Utils } from "../../Utils";
import { Matrix4 } from "../../math/Matrix4";
import { Vector3 } from "../../math/Vector3";
import { Shader, ShaderAttribute, ShaderParams, ShaderUniform } from "../Shader";
import { WEBGPUBuffer } from "./WEBGPUBuffer";
import { WEBGPURenderer } from "./WEBGPURenderer";
import { WEBGPUTexture } from "./WEBGPUTexture";
import { WEBGPUTextureSampler } from "./WEBGPUTextureSampler";
import { WEBGPUShaderUtils } from "./shaders/WEBGPUShaderUtils";

// TODO: Make this error!!
const WGSLShaderAttributeFormat = {
    vec2: "float32x2",
    vec3: "float32x3",
    vec4: "float32x4",
};

const UniformTypeToWGSL = {
    "uniform": "uniform",
    "storage": "read-only-storage"
}

interface WEBGPUShaderUniform extends ShaderUniform {
    ref?: WEBGPUBuffer | WEBGPUTexture | WEBGPUTextureSampler;
    buffer?: GPUBuffer | GPUTexture | GPUSampler;
}

export class WEBGPUShader implements Shader {
    public readonly id: string = Utils.UUID();
    public needsUpdate = false;
    
    private readonly vertexEntrypoint: string | undefined;
    private readonly fragmentEntrypoint: string | undefined;
    private readonly module: GPUShaderModule;
    
    public readonly params: ShaderParams;
    private attributeMap: Map<string, ShaderAttribute> = new Map();
    private uniformMap: Map<string, WEBGPUShaderUniform> = new Map();

    private valueArray = new Float32Array(1);
    
    private _pipeline: GPURenderPipeline | null = null;
    private _bindGroup: GPUBindGroup | null = null;
    public get pipeline() { return this._pipeline };
    public get bindGroup() { return this._bindGroup };

    constructor(params: ShaderParams) {
        const code = params.defines ? WEBGPUShaderUtils.WGSLPreprocess(params.code, params.defines) : params.code;
        this.params = params;
        this.module = WEBGPURenderer.device.createShaderModule({code: code});
        this.vertexEntrypoint = this.params.vertexEntrypoint;
        this.fragmentEntrypoint = this.params.fragmentEntrypoint;

        if (this.params.attributes) this.attributeMap = new Map(Object.entries(this.params.attributes));
        if (this.params.uniforms) this.uniformMap = new Map(Object.entries(this.params.uniforms));
    }
    
    public RebuildDescriptors() {
        console.warn("building")

        // Bind group layout
        const bindGroupLayoutEntries: GPUBindGroupLayoutEntry[] = [];
        for (const [name, uniform] of this.uniformMap) {
            if (!uniform.buffer) continue;
            if (uniform.buffer instanceof GPUBuffer) bindGroupLayoutEntries.push({ binding: uniform.location, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: { type: UniformTypeToWGSL[uniform.type]}})
            else if (uniform.buffer instanceof GPUTexture) {
                const sampleType: GPUTextureSampleType = uniform.type === "depthTexture" ? "depth" : "float";
                const viewDimension: GPUTextureViewDimension = uniform.buffer.depthOrArrayLayers > 1 ? "2d-array" : "2d";
                bindGroupLayoutEntries.push({ binding: uniform.location, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, texture: {sampleType: sampleType, viewDimension: viewDimension}})
            }
            else if (uniform.buffer instanceof GPUSampler) {
                const type: GPUSamplerBindingType = uniform.type === "sampler" ? "filtering" : "comparison";
                bindGroupLayoutEntries.push({ binding: uniform.location, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, sampler: {type: type}})
            }
        }
        const bindGroupLayout = WEBGPURenderer.device.createBindGroupLayout({entries: bindGroupLayoutEntries});
        const pipelineLayout = WEBGPURenderer.device.createPipelineLayout({
            bindGroupLayouts: [bindGroupLayout]  // Array of all bind group layouts used
        });

        // Bind group entries
        const bindGroupEntries: GPUBindGroupEntry[] = [];
        for (const [name, uniform] of this.uniformMap) {
            if (!uniform.buffer) continue;
            if (!uniform.buffer) throw Error(`Shader has binding (${name}) but no buffer was set`);
            if (uniform.buffer instanceof GPUBuffer) bindGroupEntries.push({binding: uniform.location, resource: {buffer: uniform.buffer}});
            else if (uniform.buffer instanceof GPUTexture) {
                const viewDimension: GPUTextureViewDimension = uniform.buffer.depthOrArrayLayers > 1 ? "2d-array" : "2d";
                const view: GPUTextureViewDescriptor = {
                    dimension: viewDimension,
                    arrayLayerCount: uniform.buffer.depthOrArrayLayers,
                    baseArrayLayer: 0
                };
                bindGroupEntries.push({binding: uniform.location, resource: uniform.buffer.createView(view)});
            }
            else if (uniform.buffer instanceof GPUSampler) bindGroupEntries.push({binding: uniform.location, resource: uniform.buffer});
        }

        // Bind group
        this._bindGroup = WEBGPURenderer.device.createBindGroup({ layout: bindGroupLayout, entries: bindGroupEntries });
        
        // Pipeline descriptor
        let targets: GPUColorTargetState[] = [];
        for (const output of this.params.colorOutputs) targets.push({format: output.format});
        const pipelineDescriptor: GPURenderPipelineDescriptor = {
            layout: pipelineLayout,
            vertex: { module: this.module, entryPoint: this.vertexEntrypoint, buffers: [] },
            fragment: { module: this.module, entryPoint: this.fragmentEntrypoint, targets: targets },
            primitive: {
                topology: this.params.topology ? this.params.topology : "triangle-list",
                frontFace: this.params.frontFace ? this.params.frontFace : "ccw",
                cullMode: this.params.cullMode ? this.params.cullMode : "back"
            }
        }

        // Pipeline descriptor - Depth target
        if (this.params.depthOutput) pipelineDescriptor.depthStencil = { depthWriteEnabled: true, depthCompare: 'less', format: this.params.depthOutput };
    
        // Pipeline descriptor - Vertex buffers (Attributes)
        const buffers: GPUVertexBufferLayout[] = [];
        for (const [_, attribute] of this.attributeMap) {
            buffers.push({arrayStride: attribute.size * 4, attributes: [{ shaderLocation: attribute.location, offset: 0, format: WGSLShaderAttributeFormat[attribute.type] }] })
        }
        pipelineDescriptor.vertex.buffers = buffers;

        // Pipeline
        this._pipeline = WEBGPURenderer.device.createRenderPipeline(pipelineDescriptor);

        this.needsUpdate = false;
    }

    public GetAttributeSlot(name: string): number | undefined {
        return this.attributeMap.get(name)?.location;
    }

    private GetValidUniform(name: string): WEBGPUShaderUniform {
        const uniform = this.uniformMap.get(name);
        if (!uniform) throw Error(`Shader does not have a parameter named ${name}`);
        return uniform;
    }

    private SetUniformDataFromArray(name: string, data: ArrayBuffer, dataOffset?: number | undefined, bufferOffset: number = 0, size?: number | undefined) {
        const uniform = this.GetValidUniform(name);
        if (!uniform.buffer) {
            let usage = GPUBufferUsage.COPY_DST;
            if (uniform.type === "uniform") usage |= GPUBufferUsage.UNIFORM;
            else if (uniform.type === "storage") usage |= GPUBufferUsage.STORAGE;
            uniform.buffer = WEBGPURenderer.device.createBuffer({ size: data.byteLength, usage: usage });
            this.needsUpdate = true;
        }

        WEBGPURenderer.device.queue.writeBuffer(uniform.buffer as GPUBuffer, bufferOffset, data, dataOffset, size);
    }
    private SetUniformDataFromBuffer(name: string, data: WEBGPUTexture | WEBGPUTextureSampler | WEBGPUBuffer) {
        const binding = this.GetValidUniform(name);
        if (!binding.buffer || binding.buffer !== data.GetBuffer()) {
            binding.buffer = data.GetBuffer();
            binding.ref = data;
            this.needsUpdate = true;

        }
    }

    public SetArray(name: string, array: ArrayBuffer, bufferOffset: number = 0, dataOffset?: number, size?: number) { this.SetUniformDataFromArray(name, array, bufferOffset, dataOffset, size) }
    public SetValue(name: string, value: number) {this.valueArray[0] = value; this.SetUniformDataFromArray(name, this.valueArray)}
    public SetMatrix4(name: string, matrix: Matrix4) { this.SetUniformDataFromArray(name, matrix.elements) }
    public SetVector3(name: string, vector: Vector3) { this.SetUniformDataFromArray(name, vector.elements) }
    
    public SetTexture(name: string, texture: WEBGPUTexture) { this.SetUniformDataFromBuffer(name, texture) }
    public SetSampler(name: string, sampler: WEBGPUTextureSampler) { this.SetUniformDataFromBuffer(name, sampler) }
    public SetBuffer(name: string, buffer: WEBGPUBuffer) { this.SetUniformDataFromBuffer(name, buffer) }

    public HasBuffer(name: string): boolean { return this.uniformMap.get(name)?.buffer ? true : false }

    public OnPreRender(geometry: Geometry): void {
        if (this.needsUpdate || !this.pipeline || !this.bindGroup) this.RebuildDescriptors();
    }
}