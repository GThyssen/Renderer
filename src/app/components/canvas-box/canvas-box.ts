import { Component, ViewChild, ElementRef, OnInit, OnDestroy, effect, input } from '@angular/core';
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

  // -----------------------
  // Orbit state
  // -----------------------
  private isRightMouseDown = false;
  private previousMousePosition = { x: 0, y: 0 };

  private yaw = 0;
  private pitch = 0;
  private radius = 20;
  private invertY = true; // toggle vertical inversion

  private readonly minRadius = 5;   // min zoom distance
  private readonly maxRadius = 50;  // max zoom distance

  private readonly target = new THREE.Vector3(0, 7.5, 0);

  private onMouseDown!: (e: MouseEvent) => void;
  private onMouseUp!: (e: MouseEvent) => void;
  private onMouseMove!: (e: MouseEvent) => void;
  private onContextMenu!: (e: MouseEvent) => void;
  private onWheel!: (e: WheelEvent) => void;

  private readonly colourMap: Record<string, number> = {
    red: 0xff0000,
    green: 0x00ff00,
    blue: 0x0000ff,
  };

  constructor() {
    effect(() => {
      if (!this.material) return;

      const col = this.colour();

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

    const canvas = this.canvasRef.nativeElement;

    canvas.removeEventListener('contextmenu', this.onContextMenu);
    canvas.removeEventListener('mousedown', this.onMouseDown);
    canvas.removeEventListener('wheel', this.onWheel);
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('mousemove', this.onMouseMove);
  }

  private initThree() {
    const canvas = this.canvasRef.nativeElement;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x2a2d3a);

    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

    // Initialize orbit camera
    this.yaw = 0;
    this.pitch = 0;
    this.radius = 20;
    this.updateCameraPosition();

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 20, 10);
    this.scene.add(ambientLight, directionalLight);

    // Grid
    const grid = new THREE.GridHelper(30, 30, 0x888888, 0x444444);
    grid.position.y = 0;
    this.scene.add(grid);

    // Material
    this.material = new THREE.MeshToonMaterial({ color: 0xffffff });

    // Objects
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

    // Enable mouse orbit + zoom
    this.initMouseControls();
  }

  private initMouseControls() {
    const canvas = this.canvasRef.nativeElement;

    this.onContextMenu = (e: MouseEvent) => e.preventDefault();

    this.onMouseDown = (event: MouseEvent) => {
      if (event.button === 2) {
        this.isRightMouseDown = true;
        this.previousMousePosition = {
          x: event.clientX,
          y: event.clientY
        };
      }
    };

    this.onMouseUp = () => {
      this.isRightMouseDown = false;
    };

    this.onMouseMove = (event: MouseEvent) => {
      if (!this.isRightMouseDown) return;

      const deltaX = event.clientX - this.previousMousePosition.x;
      const deltaY = event.clientY - this.previousMousePosition.y;

      this.previousMousePosition = {
        x: event.clientX,
        y: event.clientY
      };

      const rotationSpeed = 0.005;

      this.yaw -= deltaX * rotationSpeed;

      // Invert up/down based on toggle
      const direction = this.invertY ? 1 : -1;
      this.pitch += deltaY * rotationSpeed * direction;

      const maxPitch = Math.PI / 2 - 0.1;
      this.pitch = Math.max(-maxPitch, Math.min(maxPitch, this.pitch));

      this.updateCameraPosition();
    };

    // Scroll wheel zoom
    this.onWheel = (event: WheelEvent) => {
      event.preventDefault();

      const zoomSpeed = 0.05;
      this.radius += event.deltaY * zoomSpeed;

      // Clamp zoom distance
      this.radius = Math.max(this.minRadius, Math.min(this.maxRadius, this.radius));

      this.updateCameraPosition();
    };

    canvas.addEventListener('contextmenu', this.onContextMenu);
    canvas.addEventListener('mousedown', this.onMouseDown);
    canvas.addEventListener('wheel', this.onWheel, { passive: false });
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('mousemove', this.onMouseMove);
  }

  private updateCameraPosition() {
    const x = this.radius * Math.cos(this.pitch) * Math.sin(this.yaw);
    const y = this.radius * Math.sin(this.pitch);
    const z = this.radius * Math.cos(this.pitch) * Math.cos(this.yaw);

    this.camera.position.set(
      this.target.x + x,
      this.target.y + y,
      this.target.z + z
    );

    this.camera.lookAt(this.target);
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