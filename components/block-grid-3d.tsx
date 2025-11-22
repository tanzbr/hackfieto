"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import { type Block } from "@/lib/mock-data"

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
  const blocksGroupRef = useRef<THREE.Group | null>(null)
  const blockMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map())
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster())
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2())
  const onBlockSelectRef = useRef(onBlockSelect)

  // Atualizar ref quando onBlockSelect mudar
  useEffect(() => {
    onBlockSelectRef.current = onBlockSelect
  }, [onBlockSelect])

  useEffect(() => {
    if (!containerRef.current) return

    // Limpar qualquer canvas anterior do container
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild)
    }

    // Setup Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xffffff)
    sceneRef.current = scene

    // Setup Camera - Vista isométrica do ambiente industrial
    const camera = new THREE.PerspectiveCamera(
      50,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      4000,
    )
    camera.position.set(150, 120, 150)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    // Setup Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Setup Lights - Iluminação industrial
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    // Luz principal (simulando luz natural do teto)
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2)
    mainLight.position.set(50, 80, 50)
    mainLight.castShadow = true
    mainLight.shadow.camera.left = -150
    mainLight.shadow.camera.right = 150
    mainLight.shadow.camera.top = 150
    mainLight.shadow.camera.bottom = -150
    mainLight.shadow.camera.near = 0.5
    mainLight.shadow.camera.far = 300
    mainLight.shadow.mapSize.width = 2048
    mainLight.shadow.mapSize.height = 2048
    scene.add(mainLight)

    // Luzes secundárias (simulando lâmpadas industriais)
    const spotLight1 = new THREE.SpotLight(0xffffff, 0.5)
    spotLight1.position.set(-40, 30, -40)
    spotLight1.angle = Math.PI / 4
    spotLight1.penumbra = 0.3
    spotLight1.castShadow = true
    scene.add(spotLight1)

    const spotLight2 = new THREE.SpotLight(0xffffff, 0.5)
    spotLight2.position.set(40, 30, 40)
    spotLight2.angle = Math.PI / 4
    spotLight2.penumbra = 0.3
    spotLight2.castShadow = true
    scene.add(spotLight2)

    // Luz de preenchimento
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3)
    fillLight.position.set(-50, 20, -50)
    scene.add(fillLight)

    // Setup Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controlsRef.current = controls

    // Create Blocks Group
    const blocksGroup = new THREE.Group()
    scene.add(blocksGroup)
    blocksGroupRef.current = blocksGroup

    // Criar paredes e divisórias industriais
    const wallHeight = 25
    const wallThickness = 0.4
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0xe5e7eb,
      roughness: 0.8,
      metalness: 0.2,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
    })

    // Função auxiliar para criar paredes
    const createWall = (width: number, height: number, x: number, y: number, z: number, rotateY = 0) => {
      const geometry = new THREE.BoxGeometry(width, height, wallThickness)
      const wall = new THREE.Mesh(geometry, wallMaterial)
      wall.position.set(x, y + height / 2, z)
      wall.rotation.y = rotateY
      wall.castShadow = true
      wall.receiveShadow = true
      return wall
    }

    // Paredes externas (perímetro)
    // Grid 10x10 com blocos de 16x16 = 160 unidades total
    const buildingSize = 160 // 10 blocos * 16
    const wallOffset = 80 // metade de 160
    
    // Parede Norte (fundo)
    const northWall = createWall(buildingSize, wallHeight, 0, 0, -wallOffset)
    scene.add(northWall)
    
    // Parede Sul (frente) - com abertura para entrada
    const southWallLeft = createWall(60, wallHeight, -50, 0, wallOffset)
    scene.add(southWallLeft)
    const southWallRight = createWall(60, wallHeight, 50, 0, wallOffset)
    scene.add(southWallRight)
    
    // Parede Leste (direita)
    const eastWall = createWall(buildingSize, wallHeight, wallOffset, 0, 0, Math.PI / 2)
    scene.add(eastWall)
    
    // Parede Oeste (esquerda)
    const westWall = createWall(buildingSize, wallHeight, -wallOffset, 0, 0, Math.PI / 2)
    scene.add(westWall)

    // Divisórias internas - Criando setores industriais
    const dividerMaterial = new THREE.MeshStandardMaterial({
      color: 0xd1d5db,
      roughness: 0.7,
      metalness: 0.3,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
    })

    // Divisória 1: Separando área de produção (esquerda) de área de estoque (direita)
    const divider1Geometry = new THREE.BoxGeometry(wallThickness, wallHeight * 0.8, 100)
    const divider1 = new THREE.Mesh(divider1Geometry, dividerMaterial)
    divider1.position.set(0, wallHeight * 0.4, -30)
    scene.add(divider1)

    // Divisória 2: Área de escritório/controle (canto superior esquerdo)
    const divider2Geometry = new THREE.BoxGeometry(80, wallHeight * 0.8, wallThickness)
    const divider2 = new THREE.Mesh(divider2Geometry, dividerMaterial)
    divider2.position.set(-40, wallHeight * 0.4, 20)
    scene.add(divider2)

    // Divisória 3: Separação vertical na área de estoque
    const divider3Geometry = new THREE.BoxGeometry(wallThickness, wallHeight * 0.8, 80)
    const divider3 = new THREE.Mesh(divider3Geometry, dividerMaterial)
    divider3.position.set(40, wallHeight * 0.4, -30)
    scene.add(divider3)

    // Criar janelas ocas (apenas molduras)
    const windowFrameMaterial = new THREE.LineBasicMaterial({
      color: 0x1f2937,
      linewidth: 2,
    })

    const createWindowFrame = (width: number, height: number, x: number, y: number, z: number, rotateY = 0) => {
      // Criar retângulo para moldura da janela
      const points = []
      const hw = width / 2
      const hh = height / 2
      
      points.push(new THREE.Vector3(-hw, -hh, 0))
      points.push(new THREE.Vector3(hw, -hh, 0))
      points.push(new THREE.Vector3(hw, hh, 0))
      points.push(new THREE.Vector3(-hw, hh, 0))
      points.push(new THREE.Vector3(-hw, -hh, 0))
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const frame = new THREE.Line(geometry, windowFrameMaterial)
      frame.position.set(x, y, z)
      frame.rotation.y = rotateY
      
      // Adicionar divisões internas (cruz)
      const divPoints = []
      divPoints.push(new THREE.Vector3(-hw, 0, 0))
      divPoints.push(new THREE.Vector3(hw, 0, 0))
      const divGeometry1 = new THREE.BufferGeometry().setFromPoints(divPoints)
      const divLine1 = new THREE.Line(divGeometry1, windowFrameMaterial)
      divLine1.position.copy(frame.position)
      divLine1.rotation.copy(frame.rotation)
      
      const divPoints2 = []
      divPoints2.push(new THREE.Vector3(0, -hh, 0))
      divPoints2.push(new THREE.Vector3(0, hh, 0))
      const divGeometry2 = new THREE.BufferGeometry().setFromPoints(divPoints2)
      const divLine2 = new THREE.Line(divGeometry2, windowFrameMaterial)
      divLine2.position.copy(frame.position)
      divLine2.rotation.copy(frame.rotation)
      
      return [frame, divLine1, divLine2]
    }

    // Janelas na parede norte
    for (let i = -3; i <= 3; i++) {
      const windows = createWindowFrame(8, 12, i * 20, 15, -80.5)
      windows.forEach(w => scene.add(w))
    }

    // Janelas na parede leste
    for (let i = -3; i <= 3; i++) {
      const windows = createWindowFrame(8, 12, 80.5, 15, i * 20, Math.PI / 2)
      windows.forEach(w => scene.add(w))
    }

    // Base/chão com textura industrial (160x160 para corresponder ao grid de blocos)
    const floorGeometry = new THREE.PlaneGeometry(buildingSize, buildingSize)
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0xf3f4f6,
      roughness: 0.9,
      metalness: 0.1,
    })
    const floor = new THREE.Mesh(floorGeometry, floorMaterial)
    floor.rotation.x = -Math.PI / 2
    floor.position.y = -0.2
    floor.receiveShadow = true
    scene.add(floor)

    // Adicionar equipamentos simulados (estantes/máquinas)
    const equipmentMaterial = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.6,
      metalness: 0.3,
    })

    // Estantes na área de estoque (direita)
    for (let i = 0; i < 3; i++) {
      const shelfGeometry = new THREE.BoxGeometry(15, 12, 4)
      const shelf = new THREE.Mesh(shelfGeometry, equipmentMaterial)
      shelf.position.set(60, 6, -60 + i * 25)
      shelf.castShadow = true
      shelf.receiveShadow = true
      scene.add(shelf)
    }

    // Máquinas na área de produção (esquerda)
    for (let i = 0; i < 2; i++) {
      const machineGeometry = new THREE.BoxGeometry(10, 8, 10)
      const machine = new THREE.Mesh(machineGeometry, equipmentMaterial)
      machine.position.set(-50, 4, -50 + i * 40)
      machine.castShadow = true
      machine.receiveShadow = true
      scene.add(machine)
    }

    // Mesa de controle no escritório
    const deskGeometry = new THREE.BoxGeometry(20, 8, 10)
    const deskMaterial = new THREE.MeshStandardMaterial({
      color: 0x78716c,
      roughness: 0.7,
      metalness: 0.2,
    })
    const desk = new THREE.Mesh(deskGeometry, deskMaterial)
    desk.position.set(-50, 4, 40)
    desk.castShadow = true
    desk.receiveShadow = true
    scene.add(desk)

    // Criar portas ocas (apenas molduras)
    const doorFrameMaterial = new THREE.LineBasicMaterial({
      color: 0x374151,
      linewidth: 3,
    })

    const createDoorFrame = (width: number, height: number, x: number, y: number, z: number, rotateY = 0) => {
      const points = []
      const hw = width / 2
      const hh = height / 2
      
      // Moldura da porta (formato de arco ou retângulo)
      points.push(new THREE.Vector3(-hw, 0, 0))
      points.push(new THREE.Vector3(-hw, hh, 0))
      points.push(new THREE.Vector3(hw, hh, 0))
      points.push(new THREE.Vector3(hw, 0, 0))
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const frame = new THREE.Line(geometry, doorFrameMaterial)
      frame.position.set(x, y - height / 2, z)
      frame.rotation.y = rotateY
      
      // Linha do meio (simula divisão da porta dupla)
      const divPoints = []
      divPoints.push(new THREE.Vector3(0, 0, 0))
      divPoints.push(new THREE.Vector3(0, hh, 0))
      const divGeometry = new THREE.BufferGeometry().setFromPoints(divPoints)
      const divLine = new THREE.Line(divGeometry, doorFrameMaterial)
      divLine.position.copy(frame.position)
      divLine.rotation.copy(frame.rotation)
      
      // Maçaneta (pequeno detalhe)
      const handleGeometry = new THREE.SphereGeometry(0.3, 8, 8)
      const handleMaterial = new THREE.MeshStandardMaterial({
        color: 0x9ca3af,
        roughness: 0.3,
        metalness: 0.8,
      })
      const handle = new THREE.Mesh(handleGeometry, handleMaterial)
      handle.position.set(x + (rotateY === 0 ? hw * 0.7 : 0), y - height * 0.2, z + (rotateY !== 0 ? hw * 0.7 : 0))
      
      return [frame, divLine, handle]
    }

    // Porta principal na parede sul (entrada)
    const mainDoorElements = createDoorFrame(20, 18, 0, 9, 80)
    mainDoorElements.forEach(el => scene.add(el))

    // Porta na divisória 1 (entre produção e estoque)
    const door1Elements = createDoorFrame(8, 12, 0, 6, 10, Math.PI / 2)
    door1Elements.forEach(el => scene.add(el))

    // Porta na divisória 2 (entrada do escritório)
    const door2Elements = createDoorFrame(8, 12, -10, 6, 20)
    door2Elements.forEach(el => scene.add(el))

    // Create Blocks com sistema de integridade visual
    const blockSize = 16.0 // Dobrado de 8.0 para 16.0
    const blockGeometry = new THREE.BoxGeometry(blockSize, 0.3, blockSize)

    // Função para criar rachaduras procedurais no bloco
    const createCracks = (block: Block, position: THREE.Vector3) => {
      const integrity = block.integrity
      if (integrity >= 70) return // Blocos bons não têm rachaduras

      const crackMaterial = new THREE.LineBasicMaterial({
        color: 0x1f2937,
        linewidth: integrity < 40 ? 3 : 2,
        transparent: true,
        opacity: integrity < 40 ? 0.8 : 0.6,
      })

      // Número de rachaduras baseado na integridade
      const numCracks = integrity < 40 ? 6 : 3
      const crackGroup = new THREE.Group()

      for (let i = 0; i < numCracks; i++) {
        const angle = (Math.PI * 2 * i) / numCracks + (Math.random() - 0.5) * 0.5
        const length = (blockSize / 2) * (0.6 + Math.random() * 0.4)
        
        const points = []
        // Ponto inicial (centro ou próximo)
        const startRadius = Math.random() * 2
        points.push(new THREE.Vector3(
          Math.cos(angle) * startRadius,
          0.16,
          Math.sin(angle) * startRadius
        ))
        
        // Ponto final (borda)
        points.push(new THREE.Vector3(
          Math.cos(angle) * length,
          0.16,
          Math.sin(angle) * length
        ))
        
        // Adicionar segmentos quebrados para parecer mais realista
        if (integrity < 50) {
          const midAngle = angle + (Math.random() - 0.5) * 0.3
          const midLength = length * 0.5
          points.splice(1, 0, new THREE.Vector3(
            Math.cos(midAngle) * midLength,
            0.16,
            Math.sin(midAngle) * midLength
          ))
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(points)
        const crack = new THREE.Line(geometry, crackMaterial)
        crackGroup.add(crack)
      }

      crackGroup.position.copy(position)
      return crackGroup
    }

    // Função para criar bordas iluminadas (LED) - apenas para blocos com problemas
    const createEdgeLights = (block: Block, position: THREE.Vector3) => {
      const integrity = block.integrity
      
      // Não criar bordas para blocos em bom estado (≥70%)
      if (integrity >= 70) {
        return null
      }
      
      let edgeColor: number
      
      if (integrity >= 40) {
        edgeColor = 0xf59e0b // Amarelo/Laranja
      } else {
        edgeColor = 0xef4444 // Vermelho
      }

      const edgeMaterial = new THREE.MeshStandardMaterial({
        color: edgeColor,
        emissive: edgeColor,
        emissiveIntensity: integrity < 40 ? 1.2 : 0.8,
        metalness: 0.8,
        roughness: 0.2,
      })

      const edgeGroup = new THREE.Group()
      const edgeThickness = 0.4
      const edgeHeight = 0.5

      // 4 bordas LED
      const edges = [
        // Norte
        { w: blockSize, h: edgeHeight, d: edgeThickness, x: 0, y: 0.25, z: -blockSize/2 },
        // Sul
        { w: blockSize, h: edgeHeight, d: edgeThickness, x: 0, y: 0.25, z: blockSize/2 },
        // Leste
        { w: edgeThickness, h: edgeHeight, d: blockSize, x: blockSize/2, y: 0.25, z: 0 },
        // Oeste
        { w: edgeThickness, h: edgeHeight, d: blockSize, x: -blockSize/2, y: 0.25, z: 0 },
      ]

      edges.forEach(edge => {
        const geometry = new THREE.BoxGeometry(edge.w, edge.h, edge.d)
        const mesh = new THREE.Mesh(geometry, edgeMaterial)
        mesh.position.set(edge.x, edge.y, edge.z)
        edgeGroup.add(mesh)
      })

      edgeGroup.position.copy(position)
      edgeGroup.userData = { integrity, isCritical: integrity < 40 }
      return edgeGroup
    }

    // Criar blocos brancos base
    blocks.forEach((block) => {
      const color = new THREE.Color("#ffffff") // Blocos brancos
      const material = new THREE.MeshStandardMaterial({ 
        color,
        roughness: 0.7,
        metalness: 0.1,
      })
      const mesh = new THREE.Mesh(blockGeometry, material)

      // Centralizar o grid
      const posX = (block.x - 4.5) * 16
      const posZ = (block.y - 4.5) * 16
      mesh.position.set(posX, 0, posZ)

      // Habilitar sombras
      mesh.castShadow = true
      mesh.receiveShadow = true

      mesh.userData = { block }
      blocksGroup.add(mesh)
      blockMeshesRef.current.set(`${block.x}-${block.y}`, mesh)

      // Adicionar rachaduras se o bloco estiver desgastado
      const cracks = createCracks(block, new THREE.Vector3(posX, 0, posZ))
      if (cracks) {
        blocksGroup.add(cracks)
      }

      // Adicionar bordas iluminadas (apenas para blocos com problemas)
      const edgeLights = createEdgeLights(block, new THREE.Vector3(posX, 0, posZ))
      if (edgeLights) {
        blocksGroup.add(edgeLights)
      }
    })

    // Adicionar linhas tracejadas finas entre blocos
    const gridSize = 10 // Reduzido de 20 para 10
    const spacing = 16 // Dobrado de 8 para 16
    const gridStart = -80 // Início do grid (alinhado com as paredes)
    const lineMaterial = new THREE.LineDashedMaterial({
      color: 0x9ca3af,
      dashSize: 1.6, // Dobrado proporcionalmente
      gapSize: 1.2, // Dobrado proporcionalmente
      linewidth: 1,
      opacity: 0.8,
      transparent: true,
    })

    // Linhas verticais
    for (let x = 0; x <= gridSize; x++) {
      const points = []
      const xPos = gridStart + x * spacing
      points.push(new THREE.Vector3(xPos, 0.16, gridStart))
      points.push(new THREE.Vector3(xPos, 0.16, gridStart + gridSize * spacing))
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const line = new THREE.Line(geometry, lineMaterial)
      line.computeLineDistances()
      blocksGroup.add(line)
    }

    // Linhas horizontais
    for (let y = 0; y <= gridSize; y++) {
      const points = []
      const zPos = gridStart + y * spacing
      points.push(new THREE.Vector3(gridStart, 0.16, zPos))
      points.push(new THREE.Vector3(gridStart + gridSize * spacing, 0.16, zPos))
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      const line = new THREE.Line(geometry, lineMaterial)
      line.computeLineDistances()
      blocksGroup.add(line)
    }

    // Handle Click
    const handleClick = (event: MouseEvent) => {
      if (!containerRef.current || !cameraRef.current || !blocksGroupRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current)
      const intersects = raycasterRef.current.intersectObjects(blocksGroupRef.current.children, false)

      if (intersects.length > 0) {
        const intersected = intersects[0].object as THREE.Mesh
        if (intersected.userData.block) {
          onBlockSelectRef.current(intersected.userData.block)
        }
      } else {
        onBlockSelectRef.current(null)
      }
    }

    renderer.domElement.addEventListener("click", handleClick)

    // Animation Loop com efeito de pulso para blocos críticos
    const clock = new THREE.Clock()
    const animate = () => {
      requestAnimationFrame(animate)
      
      const elapsedTime = clock.getElapsedTime()
      
      // Animar bordas LED de blocos críticos (efeito de pulso)
      blocksGroup.children.forEach((child) => {
        if (child.userData.isCritical) {
          // Pulso suave entre 0.8 e 1.5 de intensidade
          const pulseIntensity = 0.8 + Math.sin(elapsedTime * 3) * 0.35
          child.traverse((obj) => {
            if (obj instanceof THREE.Mesh && obj.material instanceof THREE.MeshStandardMaterial) {
              obj.material.emissiveIntensity = pulseIntensity
            }
          })
        }
      })
      
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
      
      // Limpar geometrias e materiais para evitar vazamento de memória
      blockGeometry.dispose()
      floorGeometry.dispose()
      floorMaterial.dispose()
      wallMaterial.dispose()
      dividerMaterial.dispose()
      windowFrameMaterial.dispose()
      equipmentMaterial.dispose()
      deskMaterial.dispose()
      doorFrameMaterial.dispose()
      
      // Limpar todos os objetos da cena
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose()
          if (Array.isArray(object.material)) {
            object.material.forEach(m => m.dispose())
          } else {
            object.material.dispose()
          }
        }
      })
      
      blocksGroup.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose()
          if (Array.isArray(child.material)) {
            child.material.forEach(m => m.dispose())
          } else {
            child.material.dispose()
          }
        }
      })
      
      // Limpar referências de meshes
      blockMeshesRef.current.clear()
      
      // Dispose do renderer
      renderer.dispose()
      
      // Remover canvas do DOM apenas se ainda estiver no container
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }
    }
  }, [blocks])

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
