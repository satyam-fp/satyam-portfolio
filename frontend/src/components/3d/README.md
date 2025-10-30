# 3D Neural Network Components

This directory contains the 3D visualization components for the Neural Space portfolio, implementing an interactive neural network representation of projects and blog posts.

## Components

### NeuralScene
The main 3D scene component that orchestrates the entire neural network visualization.

**Features:**
- Intelligent node positioning using golden spiral distribution
- Force-directed layout optimization
- Interactive hover and selection states
- Connection highlighting
- Responsive camera controls

**Usage:**
```tsx
<NeuralScene 
  projects={projectsData} 
  blogs={blogsData}
  className="w-full h-screen"
/>
```

### Node3D
Individual node component representing projects or blog posts in 3D space.

**Features:**
- Dynamic glow effects and materials
- Hover state animations
- Type-specific visual indicators (cube for projects, octahedron for blogs)
- Neural activity particles on interaction
- Floating text labels

**Visual States:**
- **Default**: Subtle glow with base colors
- **Hovered**: Increased scale and brightness
- **Selected**: Maximum glow and scale
- **Connected**: Intermediate highlighting when related nodes are selected

### Connection3D
Renders curved lines between related nodes based on content similarity.

**Features:**
- Bezier curve connections for organic appearance
- Strength-based visual weight and opacity
- Animated pulsing effects
- Highlight states for connected nodes

### SceneSetup
Provides optimized lighting and environment for the neural network aesthetic.

**Features:**
- Multi-directional lighting setup
- Animated dynamic lights
- Neural grid background
- Development helpers (coordinate axes, bounds visualization)

## Neural Positioning Algorithm

The positioning system (`neuralPositioning.ts`) creates intelligent 3D layouts:

### Positioning Strategy
1. **Cluster Generation**: Uses golden spiral distribution for natural node placement
2. **Force-Directed Layout**: Applies attraction/repulsion forces for optimization
3. **Connection Analysis**: Generates relationships based on content similarity

### Connection Logic
- **Project-Blog**: Connected based on keyword similarity in titles/descriptions
- **Project-Project**: Connected based on shared technology stack
- **Strength Calculation**: Uses Jaccard similarity for tech stacks and keyword overlap

### Configuration
```typescript
const config: PositioningConfig = {
  bounds: { x: [-12, 12], y: [-8, 8], z: [-10, 10] },
  minDistance: 2.5,
  clusterSeparation: 6,
  connectionStrength: 0.7
};
```

## Visual Design

### Color Scheme
- **Projects**: Blue gradient (#1e40af → #3b82f6 → #06b6d4)
- **Blogs**: Purple gradient (#7c3aed → #a855f7 → #d946ef)
- **Connections**: Dynamic blue-purple based on strength

### Materials
- **Nodes**: Metallic materials with emissive properties
- **Glow**: Multiple layered spheres with transparency
- **Connections**: Animated lines with strength-based opacity

### Animations
- **Floating**: Subtle sine wave movement
- **Rotation**: Gentle continuous rotation
- **Pulsing**: Synchronized glow intensity changes
- **Scaling**: Smooth transitions between interaction states

## Performance Considerations

### Optimization Techniques
- **LOD System**: Reduced geometry for distant nodes (planned)
- **Instanced Rendering**: Efficient rendering of similar geometries
- **Culling**: Off-screen object removal
- **Material Sharing**: Reused materials across similar nodes

### Frame Rate Targets
- **Desktop**: 60 FPS with full effects
- **Mobile**: 30 FPS with reduced particle effects
- **Fallback**: 2D layout for WebGL-incompatible devices

## Development

### Testing
Run component tests:
```bash
npm test -- neuralPositioning.test.ts
```

### Debug Mode
Development builds include:
- Coordinate system visualization
- Node count and connection statistics
- Performance metrics overlay
- Wireframe scene bounds

### Adding New Node Types
1. Update `Node3DData` interface in `types/3d.ts`
2. Add color scheme in `Node3D.tsx`
3. Update positioning algorithm in `neuralPositioning.ts`
4. Add connection logic for new type relationships

## Future Enhancements

### Planned Features
- **Physics Integration**: Realistic node physics with collision detection
- **Particle Systems**: Neural activity visualization between nodes
- **Audio Visualization**: Sound-reactive node animations
- **VR Support**: WebXR integration for immersive exploration
- **AI Pathfinding**: Intelligent camera navigation between nodes

### Performance Improvements
- **WebGL2 Features**: Advanced rendering techniques
- **Web Workers**: Background positioning calculations
- **Streaming**: Progressive loading of large node networks
- **Caching**: Persistent positioning and connection data