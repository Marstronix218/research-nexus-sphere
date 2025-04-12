
import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { Researcher, Node, Link, researchers, createNetworkData } from "@/data/mockData";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Search, Maximize, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

// Node component for the 3D graph
function NodeObject({ 
  node, 
  position, 
  isHovered, 
  isSelected, 
  onHover, 
  onSelect, 
  scale = 1 
}: { 
  node: Node, 
  position: [number, number, number], 
  isHovered: boolean, 
  isSelected: boolean, 
  onHover: (id: string | null) => void, 
  onSelect: (id: string) => void, 
  scale?: number 
}) {
  const mesh = useRef<THREE.Mesh>(null);
  
  // Colors
  const baseColor = new THREE.Color("#3498DB");
  const hoverColor = new THREE.Color("#9B59B6");
  const selectedColor = new THREE.Color("#E74C3C");
  
  // Animate hover/select
  useFrame(() => {
    if (!mesh.current) return;
    
    if (isSelected) {
      mesh.current.material.color.lerp(selectedColor, 0.1);
    } else if (isHovered) {
      mesh.current.material.color.lerp(hoverColor, 0.1);
    } else {
      mesh.current.material.color.lerp(baseColor, 0.1);
    }
    
    // Subtle animation
    mesh.current.rotation.y += 0.01;
  });
  
  const scaleFactor = isSelected ? 1.2 : isHovered ? 1.1 : 1;
  const finalScale = scale * scaleFactor * (node.val || 1);
  
  return (
    <group position={position}>
      <mesh
        ref={mesh}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(node.id);
        }}
        onPointerOut={() => onHover(null)}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node.id);
        }}
      >
        <sphereGeometry args={[finalScale, 16, 16]} />
        <meshStandardMaterial roughness={0.5} metalness={0.2} />
      </mesh>
      
      {(isHovered || isSelected) && (
        <Text
          position={[0, finalScale + 0.5, 0]}
          fontSize={0.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          backgroundColor="#00000088"
          padding={0.2}
        >
          {node.name}
        </Text>
      )}
    </group>
  );
}

// Link component
function LinkObject({ start, end, isHighlighted }: { start: [number, number, number], end: [number, number, number], isHighlighted: boolean }) {
  const lineRef = useRef<THREE.Line>(null);
  
  const points = [
    new THREE.Vector3(...start),
    new THREE.Vector3(...end)
  ];
  
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  
  // Animate highlight
  useFrame(() => {
    if (!lineRef.current) return;
    
    const targetOpacity = isHighlighted ? 1 : 0.2;
    const material = lineRef.current.material as THREE.LineBasicMaterial;
    material.opacity += (targetOpacity - material.opacity) * 0.1;
  });
  
  return (
    <line ref={lineRef} geometry={lineGeometry}>
      <lineBasicMaterial 
        attach="material" 
        color={isHighlighted ? "#9B59B6" : "#3498DB"} 
        linewidth={isHighlighted ? 2 : 1} 
        transparent 
        opacity={0.2} 
      />
    </line>
  );
}

// Scene component
function NetworkScene({ 
  data, 
  onSelectNode, 
  highlightedNodes = [], 
  scale = 1 
}: { 
  data: { nodes: Node[], links: Link[] }, 
  onSelectNode: (id: string) => void, 
  highlightedNodes?: string[], 
  scale?: number 
}) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const { camera } = useThree();
  
  // Position nodes in a sphere
  const nodePositions = useRef<Record<string, [number, number, number]>>({});
  
  // Initialize positions
  useEffect(() => {
    const r = 10 * scale; // radius
    data.nodes.forEach((node, i) => {
      const phi = Math.acos(-1 + (2 * i) / data.nodes.length);
      const theta = Math.sqrt(data.nodes.length * Math.PI) * phi;
      
      nodePositions.current[node.id] = [
        r * Math.cos(theta) * Math.sin(phi),
        r * Math.sin(theta) * Math.sin(phi),
        r * Math.cos(phi)
      ];
    });
  }, [data.nodes, scale]);
  
  // Reset camera
  const resetCamera = () => {
    camera.position.set(15 * scale, 10 * scale, 15 * scale);
    camera.lookAt(0, 0, 0);
  };
  
  useEffect(() => {
    resetCamera();
  }, [scale]);
  
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      
      {/* Render links */}
      {data.links.map((link, i) => {
        const startPos = nodePositions.current[link.source];
        const endPos = nodePositions.current[link.target];
        
        if (!startPos || !endPos) return null;
        
        const isHighlighted = 
          highlightedNodes.includes(link.source) || 
          highlightedNodes.includes(link.target) ||
          (hoveredNode && (hoveredNode === link.source || hoveredNode === link.target));
        
        return (
          <LinkObject 
            key={`link-${i}`} 
            start={startPos} 
            end={endPos} 
            isHighlighted={isHighlighted} 
          />
        );
      })}
      
      {/* Render nodes */}
      {data.nodes.map((node) => {
        const position = nodePositions.current[node.id];
        if (!position) return null;
        
        return (
          <NodeObject 
            key={`node-${node.id}`} 
            node={node} 
            position={position} 
            isHovered={hoveredNode === node.id}
            isSelected={highlightedNodes.includes(node.id)}
            onHover={setHoveredNode}
            onSelect={onSelectNode}
            scale={scale}
          />
        );
      })}
      
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
    </>
  );
}

// Main component
export default function NetworkGraph() {
  const [networkData, setNetworkData] = useState(createNetworkData());
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Researcher[]>([]);
  const [scale, setScale] = useState(1);
  
  // Handle node selection
  const handleSelectNode = (id: string) => {
    setSelectedNodes(prev => 
      prev.includes(id) 
        ? prev.filter(nodeId => nodeId !== id) 
        : [...prev, id]
    );
  };
  
  // Search for researchers
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      return;
    }
    
    const results = researchers.filter(
      r => r.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  }, [searchTerm]);
  
  // Highlight search result
  const handleSelectSearchResult = (id: string) => {
    setSelectedNodes([id]);
    setSearchTerm("");
    setSearchResults([]);
  };
  
  // Reset view
  const resetView = () => {
    setSelectedNodes([]);
    setScale(1);
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-research-blue mb-2">Citation Network</h1>
        <p className="text-gray-600">
          Explore the connections between researchers through their citation relationships.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4 space-y-6">
          {/* Search and controls */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-medium mb-4">Search Researchers</h3>
            
            <div className="relative mb-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name..."
                className="w-full p-2 border rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-research-purple"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
            
            {searchResults.length > 0 && (
              <div className="bg-white rounded-md shadow-lg border max-h-60 overflow-y-auto animate-fade-in">
                {searchResults.map(researcher => (
                  <button
                    key={researcher.id}
                    className="w-full p-2 hover:bg-gray-50 text-left flex items-center"
                    onClick={() => handleSelectSearchResult(researcher.id)}
                  >
                    <img
                      src={researcher.avatar}
                      alt={researcher.name}
                      className="rounded-full w-8 h-8 object-cover mr-2"
                    />
                    <div>
                      <p className="font-medium text-sm">{researcher.name}</p>
                      <p className="text-xs text-gray-500">{researcher.institution}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">Network Size</h4>
              <Slider
                defaultValue={[scale]}
                min={0.5}
                max={2}
                step={0.1}
                onValueChange={(values) => setScale(values[0])}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Smaller</span>
                <span>Larger</span>
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <Button variant="outline" size="sm" onClick={resetView}>
                <RotateCcw className="mr-1 h-3 w-3" /> Reset
              </Button>
              <Button variant="outline" size="sm">
                <Maximize className="mr-1 h-3 w-3" /> Fullscreen
              </Button>
            </div>
          </div>
          
          {/* Selected nodes info */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-medium mb-4">Selected Researchers</h3>
            
            {selectedNodes.length > 0 ? (
              <div className="space-y-3">
                {selectedNodes.map(nodeId => {
                  const researcher = researchers.find(r => r.id === nodeId);
                  if (!researcher) return null;
                  
                  return (
                    <div key={nodeId} className="flex items-start p-2 bg-gray-50 rounded-lg">
                      <img
                        src={researcher.avatar}
                        alt={researcher.name}
                        className="rounded-full w-10 h-10 object-cover mr-3"
                      />
                      <div>
                        <h4 className="font-medium text-sm">{researcher.name}</h4>
                        <p className="text-xs text-gray-500">{researcher.institution}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {researcher.interests.slice(0, 2).map(interest => (
                            <Badge key={interest} variant="secondary" className="text-xs">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic">
                Click on a node in the network to select a researcher
              </p>
            )}
          </div>
        </div>
        
        {/* Network visualization */}
        <div className="md:w-3/4">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="network-container h-[600px]">
              <Canvas className="network-canvas">
                <NetworkScene 
                  data={networkData} 
                  onSelectNode={handleSelectNode} 
                  highlightedNodes={selectedNodes}
                  scale={scale}
                />
              </Canvas>
              
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <Button variant="outline" size="icon" className="bg-white">
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="bg-white">
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-md text-xs text-gray-700">
                <p>Nodes: {networkData.nodes.length} | Links: {networkData.links.length}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            <p>
              <span className="font-medium">How to use:</span> Click and drag to rotate, scroll to zoom, 
              click on researchers to select them. Lines represent citation relationships.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
