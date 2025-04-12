
import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { Researcher, Node, Link, researchers, createNetworkData } from "@/data/mockData";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Search, Maximize, ZoomIn, ZoomOut, RotateCcw, RefreshCw } from "lucide-react";
import { 
  searchResearchers, 
  getResearcherDetails, 
  createResearcherCitationNetwork,
  createCoAuthorNetwork,
  CitationNode, 
  CitationLink 
} from "@/services/citationNetworkService";
import { toast } from "@/components/ui/use-toast";

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
    
    const material = mesh.current.material as THREE.MeshStandardMaterial;
    
    if (isSelected) {
      material.color.lerp(selectedColor, 0.1);
    } else if (isHovered) {
      material.color.lerp(hoverColor, 0.1);
    } else {
      material.color.lerp(baseColor, 0.1);
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
        <meshStandardMaterial roughness={0.5} metalness={0.2} color={baseColor} />
      </mesh>
      
      {(isHovered || isSelected) && (
        <Text
          position={[0, finalScale + 0.5, 0]}
          fontSize={0.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {node.name}
        </Text>
      )}
    </group>
  );
}

// Link component
function LinkObject({ 
  start, 
  end, 
  isHighlighted 
}: { 
  start: [number, number, number], 
  end: [number, number, number], 
  isHighlighted: boolean 
}) {
  // Create a proper Three.js line using primitive
  const points = [];
  points.push(new THREE.Vector3(...start));
  points.push(new THREE.Vector3(...end));
  
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const color = isHighlighted ? "#9B59B6" : "#3498DB";
  const opacity = isHighlighted ? 1 : 0.2;
  
  return (
    <primitive object={new THREE.Line(
      lineGeometry,
      new THREE.LineBasicMaterial({ 
        color: color,
        opacity: opacity,
        transparent: true
      })
    )} />
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
  const [searchResults, setSearchResults] = useState<Partial<Researcher>[]>([]);
  const [scale, setScale] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [networkType, setNetworkType] = useState<'citation' | 'coauthor'>('citation');
  
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
    
    const fetchResults = async () => {
      try {
        setIsLoading(true);
        // First try to get from the real APIs
        const apiResults = await searchResearchers(searchTerm);
        
        if (apiResults.length > 0) {
          setSearchResults(apiResults);
        } else {
          // Fall back to mock data if no results from API
          const mockResults = researchers.filter(
            r => r.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setSearchResults(mockResults);
        }
      } catch (error) {
        console.error("Error searching researchers:", error);
        // Fall back to mock data on error
        const mockResults = researchers.filter(
          r => r.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(mockResults);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Debounce to avoid too many API calls
    const timeoutId = setTimeout(fetchResults, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);
  
  // Highlight search result
  const handleSelectSearchResult = async (id: string, source?: string) => {
    try {
      setIsLoading(true);
      setSelectedNodes([id]);
      setSearchTerm("");
      setSearchResults([]);
      
      // Fetch and create the network
      let newNetworkData;
      
      if (networkType === 'citation') {
        toast({
          title: "Loading citation network",
          description: "Fetching citation data from academic APIs...",
        });
        newNetworkData = await createResearcherCitationNetwork(id, source);
      } else {
        toast({
          title: "Loading co-author network",
          description: "Fetching collaboration data from academic APIs...",
        });
        newNetworkData = await createCoAuthorNetwork(id, source);
      }
      
      // If we got data from the API, use it
      if (newNetworkData.nodes.length > 0) {
        setNetworkData(newNetworkData);
        toast({
          title: "Network loaded",
          description: `Loaded ${newNetworkData.nodes.length} nodes and ${newNetworkData.links.length} connections.`,
        });
      } else {
        // Fall back to mock data
        toast({
          title: "Using sample data",
          description: "Could not retrieve enough data from APIs, showing sample network.",
          variant: "destructive"
        });
        setNetworkData(createNetworkData());
      }
    } catch (error) {
      console.error("Error creating network:", error);
      toast({
        title: "Error loading network",
        description: "Could not create the citation network. Using sample data instead.",
        variant: "destructive"
      });
      setNetworkData(createNetworkData());
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reset view
  const resetView = () => {
    setSelectedNodes([]);
    setScale(1);
    setNetworkData(createNetworkData());
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
                disabled={isLoading}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
            
            {searchResults.length > 0 && (
              <div className="bg-white rounded-md shadow-lg border max-h-60 overflow-y-auto animate-fade-in">
                {searchResults.map(researcher => (
                  <button
                    key={researcher.id}
                    className="w-full p-2 hover:bg-gray-50 text-left flex items-center"
                    onClick={() => handleSelectSearchResult(researcher.id!, researcher.source)}
                    disabled={isLoading}
                  >
                    <img
                      src={researcher.avatar || "/placeholder.svg"}
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
              <h4 className="text-sm font-medium mb-2">Network Type</h4>
              <div className="flex gap-2 mb-4">
                <Button 
                  variant={networkType === 'citation' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setNetworkType('citation')}
                  className="flex-1"
                >
                  Citation
                </Button>
                <Button 
                  variant={networkType === 'coauthor' ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setNetworkType('coauthor')}
                  className="flex-1"
                >
                  Co-Author
                </Button>
              </div>
              
              <h4 className="text-sm font-medium mb-2">Network Size</h4>
              <Slider
                defaultValue={[scale]}
                min={0.5}
                max={2}
                step={0.1}
                onValueChange={(values) => setScale(values[0])}
                disabled={isLoading}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Smaller</span>
                <span>Larger</span>
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <Button variant="outline" size="sm" onClick={resetView} disabled={isLoading}>
                <RotateCcw className="mr-1 h-3 w-3" /> Reset
              </Button>
              <Button variant="outline" size="sm" disabled={true}>
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
                  // First check if it's in the network data
                  const nodeInNetwork = networkData.nodes.find(n => n.id === nodeId);
                  
                  // Then check in mock researchers
                  const researcher = nodeInNetwork?.type === "researcher" 
                    ? researchers.find(r => r.id === nodeId) 
                    : null;
                  
                  if (!nodeInNetwork) return null;
                  
                  if (researcher) {
                    // It's a researcher node
                    return (
                      <div key={nodeId} className="flex items-start p-2 bg-gray-50 rounded-lg">
                        <img
                          src={researcher.avatar || "/placeholder.svg"}
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
                  } else {
                    // It's a paper or other type of node
                    const citationNode = nodeInNetwork as CitationNode;
                    return (
                      <div key={nodeId} className="p-2 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-sm">{citationNode.name}</h4>
                        {citationNode.year && (
                          <p className="text-xs text-gray-500">Published: {citationNode.year}</p>
                        )}
                        {citationNode.authors && citationNode.authors.length > 0 && (
                          <p className="text-xs text-gray-500">
                            By: {citationNode.authors.slice(0, 2).join(", ")}
                            {citationNode.authors.length > 2 ? " et al." : ""}
                          </p>
                        )}
                        {citationNode.venue && (
                          <p className="text-xs text-gray-500">In: {citationNode.venue}</p>
                        )}
                      </div>
                    );
                  }
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic">
                Click on a node in the network to select a researcher or paper
              </p>
            )}
          </div>
        </div>
        
        {/* Network visualization */}
        <div className="md:w-3/4">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="network-container h-[600px] relative">
              {isLoading && (
                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-10">
                  <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                    <RefreshCw className="h-8 w-8 mx-auto animate-spin text-research-purple mb-4" />
                    <p className="text-lg font-medium">Loading network data...</p>
                    <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
                  </div>
                </div>
              )}
              
              <Canvas className="network-canvas">
                <NetworkScene 
                  data={networkData} 
                  onSelectNode={handleSelectNode} 
                  highlightedNodes={selectedNodes}
                  scale={scale}
                />
              </Canvas>
              
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <Button variant="outline" size="icon" className="bg-white" disabled={isLoading}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="bg-white" disabled={isLoading}>
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
              click on researchers or papers to select them. Lines represent {networkType === 'citation' ? 'citation' : 'collaboration'} relationships.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
