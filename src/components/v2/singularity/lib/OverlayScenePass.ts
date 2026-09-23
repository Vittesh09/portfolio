import * as THREE from 'three';
import { Pass, FullScreenQuad } from 'three/addons/postprocessing/Pass.js';
import { CopyShader } from 'three/addons/shaders/CopyShader.js';

/**
 * Draws an overlay scene (text) AFTER bloom so copy is not glowed,
 * but BEFORE lensing so gravitational warp still applies.
 */
export class OverlayScenePass extends Pass {
  private readonly overlayScene: THREE.Scene;
  private readonly camera: THREE.Camera;
  private readonly copyMaterial: THREE.ShaderMaterial;
  private readonly fsQuad: FullScreenQuad;

  constructor(overlayScene: THREE.Scene, camera: THREE.Camera) {
    super();
    this.overlayScene = overlayScene;
    this.camera = camera;
    this.needsSwap = true;

    this.copyMaterial = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(CopyShader.uniforms),
      vertexShader: CopyShader.vertexShader,
      fragmentShader: CopyShader.fragmentShader,
      depthTest: false,
      depthWrite: false
    });
    this.fsQuad = new FullScreenQuad(this.copyMaterial);
  }

  render(
    renderer: THREE.WebGLRenderer,
    writeBuffer: THREE.WebGLRenderTarget,
    readBuffer: THREE.WebGLRenderTarget
  ) {
    this.copyMaterial.uniforms.tDiffuse.value = readBuffer.texture;

    renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer);
    renderer.clear();
    this.fsQuad.render(renderer);

    const prevAutoClear = renderer.autoClear;
    renderer.autoClear = false;
    renderer.render(this.overlayScene, this.camera);
    renderer.autoClear = prevAutoClear;
  }

  dispose() {
    this.copyMaterial.dispose();
    this.fsQuad.dispose();
  }
}
