import { Geometry, VertexAttribute } from "../../Geometry";
import { DepthTarget, RenderTarget, RendererContext } from "../RendererContext";
import { Topology } from "../Shader";
import { WEBGPUBuffer, WEBGPUDynamicBuffer } from "./WEBGPUBuffer";
import { WEBGPURenderer } from "./WEBGPURenderer";
import { WEBGPUShader } from "./shader/WEBGPUShader";
import { WEBGPUTexture } from "./WEBGPUTexture";
import { WEBGPUTimestampQuery } from "./WEBGPUTimestampQuery";

export class WEBGPURendererContext implements RendererContext {
    private static activeRenderPass: GPURenderPassEncoder | null = null;

    public static BeginRenderPass(name: string, renderTargets: RenderTarget[], depthTarget?: DepthTarget, timestamp?: boolean) {
        const activeCommandEncoder = WEBGPURenderer.GetActiveCommandEncoder();
        if (!activeCommandEncoder) throw Error("No active command encoder!!");
        if (this.activeRenderPass) throw Error("There is already an active render pass");

        const renderPassDescriptor: GPURenderPassDescriptor = { colorAttachments: [], label: "RenderPassDescriptor: " + name};

        if (timestamp === true) renderPassDescriptor.timestampWrites = WEBGPUTimestampQuery.BeginRenderTimestamp(name);

        const attachments: GPURenderPassColorAttachment[] = [];
        for (const renderTarget of renderTargets) {
            attachments.push({
                view: renderTarget.target ? (renderTarget.target as WEBGPUTexture).GetView() : WEBGPURenderer.context.getCurrentTexture().createView(),
                clearValue: renderTarget.color,
                loadOp: renderTarget.clear ? "clear" : "load",
                storeOp: 'store',                
            })
        }
        renderPassDescriptor.colorAttachments = attachments;
        
        if (depthTarget?.target) {
            renderPassDescriptor.depthStencilAttachment = {
                view: (depthTarget.target as WEBGPUTexture).GetView(),
                depthClearValue: 1.0,
                depthLoadOp: depthTarget.clear ? "clear" : "load",
                depthStoreOp: 'store',
            };
        }

        this.activeRenderPass = activeCommandEncoder.beginRenderPass(renderPassDescriptor);
        this.activeRenderPass.label = "RenderPass: " + name;
    }

    public static EndRenderPass() {
        if (!this.activeRenderPass) throw Error("No active render pass");
        this.activeRenderPass.end();

        this.activeRenderPass = null;
        
        WEBGPUTimestampQuery.EndRenderTimestamp();
    }

    public static DrawGeometry(geometry: Geometry, shader: WEBGPUShader, instanceCount = 1) {
        if (!this.activeRenderPass) throw Error("No active render pass");

        shader.OnPreRender();

        if (!shader.pipeline) throw Error("Shader doesnt have a pipeline");

        this.activeRenderPass.setPipeline(shader.pipeline);
        for (let i = 0; i < shader.bindGroups.length; i++) {
            let dynamicOffsetsV2: number[] = [];
            for (const buffer of shader.bindGroupsInfo[i].buffers) {
                if (buffer instanceof WEBGPUDynamicBuffer)  {
                    dynamicOffsetsV2.push(buffer.dynamicOffset);
                }
            }
            this.activeRenderPass.setBindGroup(i, shader.bindGroups[i], dynamicOffsetsV2);
        }
        
        for (const [name, attribute] of geometry.attributes) {
            const attributeSlot = shader.GetAttributeSlot(name);
            if (attributeSlot === undefined) continue;
            const attributeBuffer = attribute.buffer as WEBGPUBuffer;
            this.activeRenderPass.setVertexBuffer(attributeSlot, attributeBuffer.GetBuffer());
        }

        if (!shader.params.topology || shader.params.topology === Topology.Triangles) {
            if (!geometry.index) {
                const positions = geometry.attributes.get("position") as VertexAttribute;
                positions.GetBuffer().size;
                this.activeRenderPass.draw(positions.GetBuffer().size / 3 / 4, instanceCount);
            }
            else {
                const indexBuffer = geometry.index.buffer as WEBGPUBuffer;
                this.activeRenderPass.setIndexBuffer(indexBuffer.GetBuffer(), "uint32");
                this.activeRenderPass.drawIndexed(indexBuffer.size / 4, instanceCount);
            }
        }
        else if (shader.params.topology === Topology.Lines) {
            if (!geometry.index) throw Error("Cannot draw lines without index buffer");
            const numTriangles = geometry.index.array.length / 3;
            this.activeRenderPass.draw(6 * numTriangles, instanceCount);
        }
    }

    public static DrawIndirect(geometry: Geometry, shader: WEBGPUShader, indirectBuffer: WEBGPUBuffer, indirectOffset: number) {
        if (!this.activeRenderPass) throw Error("No active render pass");

        shader.OnPreRender();

        if (!shader.pipeline) throw Error("Shader doesnt have a pipeline");

        this.activeRenderPass.setPipeline(shader.pipeline);
        for (let i = 0; i < shader.bindGroups.length; i++) {
            let dynamicOffsetsV2: number[] = [];
            for (const buffer of shader.bindGroupsInfo[i].buffers) {
                if (buffer instanceof WEBGPUDynamicBuffer)  {
                    dynamicOffsetsV2.push(buffer.dynamicOffset);
                }
            }
            this.activeRenderPass.setBindGroup(i, shader.bindGroups[i], dynamicOffsetsV2);
        }
        
        for (const [name, attribute] of geometry.attributes) {
            const attributeSlot = shader.GetAttributeSlot(name);
            if (attributeSlot === undefined) continue;
            const attributeBuffer = attribute.buffer as WEBGPUBuffer;
            this.activeRenderPass.setVertexBuffer(attributeSlot, attributeBuffer.GetBuffer());
        }

        if (!geometry.index) {
            this.activeRenderPass.drawIndirect(indirectBuffer.GetBuffer(), indirectOffset);
        }
        else {
            const indexBuffer = geometry.index.buffer as WEBGPUBuffer;
            this.activeRenderPass.setIndexBuffer(indexBuffer.GetBuffer(), "uint32");
            this.activeRenderPass.drawIndexedIndirect(indirectBuffer.GetBuffer(), indirectOffset);
        }
    }

    public static SetViewport(x: number, y: number, width: number, height: number, minDepth: number, maxDepth: number) {
        if (!this.activeRenderPass) throw Error("No active render pass");
        this.activeRenderPass.setViewport(x, y, width, height, minDepth, maxDepth);
    }

    public static SetScissor(x: number, y: number, width: number, height: number) {
        if (!this.activeRenderPass) throw Error("No active render pass");
        this.activeRenderPass.setScissorRect(x, y, width, height);
    }

    public static CopyBufferToBuffer(source: WEBGPUBuffer, destination: WEBGPUBuffer, sourceOffset: number, destinationOffset: number, size: number) {
        const activeCommandEncoder = WEBGPURenderer.GetActiveCommandEncoder();
        if (!activeCommandEncoder) throw Error("No active command encoder!!");

        activeCommandEncoder.copyBufferToBuffer(source.GetBuffer(), sourceOffset, destination.GetBuffer(), destinationOffset, size);
    }

    public static CopyTextureToTexture(source: WEBGPUTexture, destination: WEBGPUTexture) {
        const activeCommandEncoder = WEBGPURenderer.GetActiveCommandEncoder();
        if (!activeCommandEncoder) throw Error("No active command encoder!!");

        activeCommandEncoder.copyTextureToTexture({texture: source.GetBuffer()}, {texture: destination.GetBuffer()}, [source.width, source.height, source.depth]);
    }

    public static ClearBuffer(buffer: WEBGPUBuffer, offset: number, size: number) {
        const activeCommandEncoder = WEBGPURenderer.GetActiveCommandEncoder();
        if (!activeCommandEncoder) throw Error("No active command encoder!!");

        activeCommandEncoder.clearBuffer(buffer.GetBuffer(), offset, size);
    }
}