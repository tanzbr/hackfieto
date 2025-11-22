"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import { type Block, getBlockColor } from "@/lib/mock-data"

interface BlockGrid3DProps {
  blocks: Block[]
  onBlockSelect: (block: Block | null) => void
  selectedBlock: Block | null
}

export function BlockGrid3D({ blocks, onBlockSelect, selectedBlock }: BlockGrid3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const blockMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map())
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster())
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2())

  useEffect(() => {
    if (!containerRef.current) return

    // Setup Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf5f5f5)
    sceneRef.current = scene

    // Setup Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    )
    camera.position.set(15, 20, 15)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    // Setup Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Setup Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(10, 20, 10)
    scene.add(directionalLight)

    // Setup Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controlsRef.current = controls

    // Create Blocks
    const blockSize = 0.9
    const blockGeometry = new THREE.BoxGeometry(blockSize, 0.3, blockSize)

    blocks.forEach((block) => {
      const color = new THREE.Color(getBlockColor(block.integrity))
      const material = new THREE.MeshStandardMaterial({ color })
      const mesh = new THREE.Mesh(blockGeometry, material)

      // Centralizar o grid
      mesh.position.set(block.x - 10, 0, block.y - 10)

      mesh.userData = { block }
      scene.add(mesh)
      blockMeshesRef.current.set(`${block.x}-${block.y}`, mesh)
    })

    // Handle Click
    const handleClick = (event: MouseEvent) => {
      if (!containerRef.current || !cameraRef.current || !sceneRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current)
      const intersects = raycasterRef.current.intersectObjects(sceneRef.current.children)

      if (intersects.length > 0) {
        const intersected = intersects[0].object as THREE.Mesh
        if (intersected.userData.block) {
          onBlockSelect(intersected.userData.block)
        }
      } else {
        onBlockSelect(null)
      }
    }

    renderer.domElement.addEventListener("click", handleClick)

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // Handle Resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return

      cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      renderer.domElement.removeEventListener("click", handleClick)
      renderer.dispose()
      containerRef.current?.removeChild(renderer.domElement)
    }
  }, [blocks, onBlockSelect])

  // Update selected block highlight
  useEffect(() => {
    blockMeshesRef.current.forEach((mesh, key) => {
      const block = mesh.userData.block as Block
      const isSelected = selectedBlock && block.x === selectedBlock.x && block.y === selectedBlock.y

      if (isSelected) {
        mesh.scale.set(1, 1.5, 1)
        ;(mesh.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(0x4444ff)
      } else {
        mesh.scale.set(1, 1, 1)
        ;(mesh.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(0x000000)
      }
    })
  }, [selectedBlock])

  return <div ref={containerRef} className="w-full h-full" />
}
