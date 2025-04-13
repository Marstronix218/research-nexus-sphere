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
  createSampleResearcherNetwork,
  CitationNode, 
  CitationLink 
} from "@/services/citationNetworkService";
import { toast } from "@/components/ui/use-toast";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
  
  const baseColor = new THREE.Color("#3498DB");
  const hoverColor = new THREE.Color("#9B59B6");
  const selectedColor = new THREE.Color("#E74C3C");
  
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
    
    mesh.current.rotation.y += 0.01;
  });
  
  const nodeType = (node as any).type || 'default';
  const baseSize = 0.3;
  const scaleFactor = isSelected ? 1.3 : isHovered ? 1.2 : 1;
  const nodeValue = node.val || 1;
  const cappedNodeValue = Math.min(nodeValue, 2);
  const finalScale = scale * scaleFactor * baseSize * Math.sqrt(cappedNodeValue);
  
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
          position={[0, finalScale + 0.15, 0]}
          fontSize={0.15}
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

interface PaperInfo {
  id?: string;
  title?: string;
  authors?: string[];
  year?: number;
  doi?: string;
  url?: string;
}

function LinkObject({ 
  start, 
  end, 
  isHighlighted,
  isDirectional = true,
  weight = 1,
  sourceId,
  targetId,
  papers = [],
  onHoverLink
}: { 
  start: [number, number, number], 
  end: [number, number, number], 
  isHighlighted: boolean,
  isDirectional?: boolean,
  weight?: number,
  sourceId?: string,
  targetId?: string,
  papers?: PaperInfo[],
  onHoverLink?: (source: string | null, target: string | null, papers: PaperInfo[] | null) => void
}) {
  const direction = new THREE.Vector3(
    end[0] - start[0],
    end[1] - start[1],
    end[2] - start[2]
  );
  
  const length = direction.length();
  direction.normalize();
  
  const arrowPosition = new THREE.Vector3(
    start[0] + direction.x * length * 0.7,
    start[1] + direction.y * length * 0.7,
    start[2] + direction.z * length * 0.7
  );
  
  const points = [];
  points.push(new THREE.Vector3(...start));
  points.push(new THREE.Vector3(...end));
  
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  
  const lineWeight = Math.min(weight, 5) / 10;
  const lineOpacity = isHighlighted ? 0.8 : 0.3;
  const lineColor = isHighlighted ? "#E74C3C" : "#3498DB";
  
  const handlePointerOver = () => {
    if (onHoverLink && sourceId && targetId) {
      onHoverLink(sourceId, targetId, papers);
    }
  };
  
  const handlePointerOut = () => {
    if (onHoverLink) {
      onHoverLink(null, null, null);
    }
  };
  
  return (
    <group 
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <primitive object={new THREE.Line(
        lineGeometry,
        new THREE.LineBasicMaterial({ 
          color: lineColor,
          opacity: lineOpacity,
          transparent: true,
          linewidth: 1 // Note: linewidth > 1 not supported in WebGLRenderer
        })
      )} />
      
      {isDirectional && isHighlighted && (
        <mesh position={[arrowPosition.x, arrowPosition.y, arrowPosition.z]}>
          <coneGeometry args={[0.05, 0.15, 8]} />
          <meshBasicMaterial color={lineColor} transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  );
}

function NetworkScene({ 
  data, 
  onSelectNode, 
  highlightedNodes = [], 
  scale = 1,
  onHoverLink 
}: { 
  data: { nodes: Node[], links: Link[] }, 
  onSelectNode: (id: string) => void, 
  highlightedNodes?: string[], 
  scale?: number,
  onHoverLink?: (source: string | null, target: string | null, papers: PaperInfo[] | null) => void
}) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const { camera } = useThree();
  
  const nodePositions = useRef<Record<string, [number, number, number]>>({});
  
  useEffect(() => {
    const r = 20 * scale;
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
  
  const resetCamera = () => {
    camera.position.set(25 * scale, 20 * scale, 25 * scale);
    camera.lookAt(0, 0, 0);
  };
  
  useEffect(() => {
    resetCamera();
  }, [scale]);
  
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      
      {data.links.map((link, i) => {
        const startPos = nodePositions.current[link.source as string];
        const endPos = nodePositions.current[link.target as string];
        
        if (!startPos || !endPos) return null;
        
        const isHighlighted = 
          highlightedNodes.includes(link.source as string) || 
          highlightedNodes.includes(link.target as string) ||
          (hoveredNode && (hoveredNode === link.source || hoveredNode === link.target));
        
        return (
          <LinkObject 
            key={`link-${i}`} 
            start={startPos} 
            end={endPos} 
            isHighlighted={isHighlighted}
            isDirectional={true}
            weight={(link as CitationLink).weight || 1}
            sourceId={link.source as string}
            targetId={link.target as string}
            papers={(link as CitationLink).papers || []}
            onHoverLink={onHoverLink}
          />
        );
      })}
      
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

function CitationPapersCard({ source, target, papers }: { source: string, target: string, papers: PaperInfo[] }) {
  const sourceNode = document.querySelector(`[data-node-id="${source}"]`);
  const targetNode = document.querySelector(`[data-node-id="${target}"]`);
  
  const sourceName = sourceNode?.getAttribute("data-node-name") || source;
  const targetName = targetNode?.getAttribute("data-node-name") || target;
  
  return (
    <div className="w-full">
      <h3 className="text-sm font-medium mb-2">
        Citation papers from <span className="text-research-purple">{sourceName}</span>
        <span> to </span>
        <span className="text-research-blue">{targetName}</span>
      </h3>
      
      {papers.length > 0 ? (
        <div className="max-h-60 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Year</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {papers.map((paper, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="font-medium">{paper.title || "Unknown title"}</div>
                    {paper.authors && (
                      <div className="text-xs text-gray-500 mt-1">
                        {paper.authors.join(", ")}
                      </div>
                    )}
                    {paper.doi && (
                      <div className="text-xs text-blue-500 mt-1">
                        <a 
                          href={paper.url || `https://doi.org/${paper.doi}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          {paper.doi}
                        </a>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{paper.year || "N/A"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">No detailed paper information available</p>
      )}
    </div>
  );
}

export default function NetworkGraph() {
  const [networkData, setNetworkData] = useState(() => createSampleResearcherNetwork());
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Partial<Researcher>[]>([]);
  const [scale, setScale] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [networkType, setNetworkType] = useState<'citation' | 'coauthor'>('citation');
  const [hoveredLink, setHoveredLink] = useState<{
    source: string | null, 
    target: string | null, 
    papers: PaperInfo[] | null
  }>({ source: null, target: null, papers: null });
  
  const handleSelectNode = (id: string) => {
    setSelectedNodes(prev => 
      prev.includes(id) 
        ? prev.filter(nodeId => nodeId !== id) 
        : [...prev, id]
    );
  };
  
  const handleHoverLink = (source: string | null, target: string | null, papers: PaperInfo[] | null) => {
    setHoveredLink({ source, target, papers });
  };
  
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      return;
    }
    
    const fetchResults = async () => {
      try {
        setIsLoading(true);
        const apiResults = await searchResearchers(searchTerm);
        
        if (apiResults.length > 0) {
          setSearchResults(apiResults);
        } else {
          const mockResults = researchers.filter(
            r => r.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setSearchResults(mockResults);
        }
      } catch (error) {
        console.error("Error searching researchers:", error);
        const mockResults = researchers.filter(
          r => r.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(mockResults);
      } finally {
        setIsLoading(false);
      }
    };
    
    const timeoutId = setTimeout(fetchResults, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);
  
  const handleSelectSearchResult = async (id: string, source?: string) => {
    try {
      setIsLoading(true);
      setSelectedNodes([id]);
      setSearchTerm("");
      setSearchResults([]);
      
      let newNetworkData;
      
      if (networkType === 'citation') {
        toast({
          title: "Loading citation network",
          description: "Fetching researcher citation data...",
        });
        newNetworkData = await createResearcherCitationNetwork(id, source);
      } else {
        toast({
          title: "Loading co-author network",
          description: "Fetching collaboration data...",
        });
        newNetworkData = await createCoAuthorNetwork(id, source);
      }
      
      if (newNetworkData.nodes.length > 0) {
        setNetworkData(newNetworkData);
        toast({
          title: "Network loaded",
          description: `Loaded ${newNetworkData.nodes.length} researchers and ${newNetworkData.links.length} citation connections.`,
        });
      } else {
        toast({
          title: "Using sample data",
          description: "Could not retrieve enough data from APIs, showing sample network.",
          variant: "destructive"
        });
        setNetworkData(createSampleResearcherNetwork());
      }
    } catch (error) {
      console.error("Error creating network:", error);
      toast({
        title: "Error loading network",
        description: "Could not create the network. Using sample data instead.",
        variant: "destructive"
      });
      setNetworkData(createSampleResearcherNetwork());
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetView = () => {
    setSelectedNodes([]);
    setScale(1);
    setNetworkData(createSampleResearcherNetwork());
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-research-blue mb-2">Researcher Citation Network</h1>
        <p className="text-gray-600">
          Explore the connections between researchers through their citation relationships.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4 space-y-6">
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
                    onClick={() => handleSelectSearchResult(researcher.id!, (researcher as any).source)}
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
          
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-medium mb-4">Selected Researchers</h3>
            
            {selectedNodes.length > 0 ? (
              <div className="space-y-3">
                {selectedNodes.map(nodeId => {
                  const nodeInfo = networkData.nodes.find(n => n.id === nodeId) as CitationNode;
                  
                  if (!nodeInfo) return null;
                  
                  return (
                    <div key={nodeId} className="flex items-start p-2 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-research-blue rounded-full flex items-center justify-center text-white mr-3">
                        {nodeInfo.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{nodeInfo.name}</h4>
                        {nodeInfo.paperCount && (
                          <p className="text-xs text-gray-500">Papers: {nodeInfo.paperCount}</p>
                        )}
                        {nodeInfo.citationCount && (
                          <p className="text-xs text-gray-500">Citations: {nodeInfo.citationCount}</p>
                        )}
                        <div className="flex flex-wrap gap-1 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {(nodeInfo as any).type || "Researcher"}
                          </Badge>
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
                  onHoverLink={handleHoverLink}
                />
              </Canvas>
              
              {hoveredLink.source && hoveredLink.target && hoveredLink.papers && (
                <div className="absolute bottom-4 left-4 w-96 bg-white/95 backdrop-blur-sm p-4 rounded-md shadow-lg border border-gray-200 text-sm">
                  <CitationPapersCard 
                    source={hoveredLink.source} 
                    target={hoveredLink.target}
                    papers={hoveredLink.papers}
                  />
                </div>
              )}
              
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <Button variant="outline" size="icon" className="bg-white" disabled={isLoading}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="bg-white" disabled={isLoading}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-md text-xs text-gray-700">
                <p>Researchers: {networkData.nodes.length} | Citations: {networkData.links.length}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            <p>
              <span className="font-medium">How to use:</span> Click and drag to rotate, scroll to zoom, 
              click on researchers to select them. Lines represent {networkType === 'citation' ? 'citation' : 'collaboration'} relationships.
              Hover over connecting lines to see the papers that created the citation relationship.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
