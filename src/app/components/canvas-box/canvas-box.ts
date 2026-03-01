import { Component, Input, ViewChild, ElementRef, OnInit, OnDestroy, effect, input } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-canvas-box',
  standalone: true,
  template: `<canvas #canvas></canvas>`,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    canvas {
      width: 100%;
      height: 100%;
      display: block;
    }
  `]
})
export class CanvasBox implements OnInit, OnDestroy {

  @ViewChild('canvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

 colour = input<string>();

  private material!: THREE.MeshToonMaterial;
  private box!: THREE.Mesh;
  private torus!: THREE.Mesh;
  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private scene!: THREE.Scene;

  private resizeObserver!: ResizeObserver;
  private animationId!: number;

  private readonly colourMap: Record<string, number> = {
    red: 0xff0000,
    green: 0x00ff00,
    blue: 0x0000ff,
  };

  constructor() {
  effect(() => {
    if (!this.material) return;

    const col = this.colour(); // <-- call it like a function

    if (col && col in this.colourMap) {
      this.material.color.setHex(this.colourMap[col]);
    } else {
      this.material.color.setHex(0xffffff);
    }
  });
  }

  ngOnInit() {
    this.initThree();
    this.observeResize();
    this.animate();
  }

  ngOnDestroy() {
    this.resizeObserver.disconnect();
    cancelAnimationFrame(this.animationId);
  }

  private initThree() {
    const canvas = this.canvasRef.nativeElement;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x2a2d3a);

    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    this.camera.position.set(0, 8, 20);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 20, 10);
    this.scene.add(ambientLight, directionalLight);

    // Grid (floor)
    const grid = new THREE.GridHelper(30, 30, 0x888888, 0x444444);
    grid.position.y = 0;
    this.scene.add(grid);

    // Material
    this.material = new THREE.MeshToonMaterial({ color: 0xffffff });

    // Objects (centered)
    this.box = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 1.5, 1.5),
      this.material
    );
    this.box.position.set(0, 7.5, 0);

    this.torus = new THREE.Mesh(
      new THREE.TorusGeometry(5, 1.5, 16, 100),
      this.material
    );
    this.torus.position.set(0, 7.5, 0);

    this.scene.add(this.box, this.torus);
  }

  private observeResize() {
    const canvas = this.canvasRef.nativeElement;
    const host = canvas.parentElement!;

    this.resizeObserver = new ResizeObserver(() => {
      const width = host.clientWidth;
      const height = host.clientHeight;

      this.renderer.setSize(width, height, false);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    });

    this.resizeObserver.observe(host);
  }

  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate);

    const t = performance.now() * 0.001;

    this.box.rotation.x = t;
    this.box.rotation.y = t;
    this.torus.rotation.x = t;
    this.torus.rotation.y = t;

    this.renderer.render(this.scene, this.camera);
  };
}