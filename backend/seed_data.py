"""
Seed data for Neural Space Portfolio
Contains sample projects and blog posts with 3D positioning for neural network visualization.
"""

import math
import random
from datetime import datetime, timedelta

# Sample project data with realistic ML/3D AI content
SAMPLE_PROJECTS = [
    {
        "title": "Neural Mesh Reconstruction",
        "slug": "neural-mesh-reconstruction",
        "description": "Deep learning pipeline for reconstructing 3D meshes from sparse point clouds using Graph Neural Networks. Achieved 15% improvement in surface accuracy over traditional methods.",
        "tech_stack": ["Python", "PyTorch", "Open3D", "CUDA", "Docker"],
        "github_url": "https://github.com/username/neural-mesh-reconstruction",
        "live_demo": "https://neural-mesh-demo.vercel.app",
        "image_url": "/images/neural-mesh.jpg"
    },
    {
        "title": "Real-time Style Transfer for 3D Scenes",
        "slug": "realtime-3d-style-transfer",
        "description": "GPU-accelerated neural style transfer system for real-time 3D scene rendering. Implements custom CUDA kernels for 60fps performance on consumer hardware.",
        "tech_stack": ["C++", "CUDA", "OpenGL", "PyTorch", "CMake"],
        "github_url": "https://github.com/username/3d-style-transfer",
        "live_demo": None,
        "image_url": "/images/style-transfer.jpg"
    },
    {
        "title": "Volumetric Human Pose Estimation",
        "slug": "volumetric-pose-estimation",
        "description": "Multi-view 3D human pose estimation using volumetric representations and transformer architecture. Deployed as real-time motion capture system.",
        "tech_stack": ["Python", "TensorFlow", "OpenCV", "NumPy", "Flask"],
        "github_url": "https://github.com/username/volumetric-pose",
        "live_demo": "https://pose-estimation-demo.herokuapp.com",
        "image_url": "/images/pose-estimation.jpg"
    },
    {
        "title": "NeRF Scene Optimization",
        "slug": "nerf-scene-optimization",
        "description": "Optimized Neural Radiance Fields implementation with custom sampling strategies. Reduced training time by 40% while maintaining photorealistic quality.",
        "tech_stack": ["Python", "JAX", "Optax", "Matplotlib", "Weights & Biases"],
        "github_url": "https://github.com/username/optimized-nerf",
        "live_demo": "https://nerf-viewer.netlify.app",
        "image_url": "/images/nerf-optimization.jpg"
    },
    {
        "title": "3D Object Detection Pipeline",
        "slug": "3d-object-detection",
        "description": "End-to-end 3D object detection system for autonomous vehicles using LiDAR and camera fusion. Achieved 92% mAP on KITTI dataset.",
        "tech_stack": ["Python", "PyTorch", "PCL", "ROS", "Docker"],
        "github_url": "https://github.com/username/3d-object-detection",
        "live_demo": None,
        "image_url": "/images/object-detection.jpg"
    },
    {
        "title": "Generative 3D Asset Creation",
        "slug": "generative-3d-assets",
        "description": "GAN-based system for generating game-ready 3D assets from text descriptions. Integrated with Blender for automated UV mapping and texturing.",
        "tech_stack": ["Python", "PyTorch", "Blender API", "CLIP", "Gradio"],
        "github_url": "https://github.com/username/generative-3d-assets",
        "live_demo": "https://3d-asset-generator.streamlit.app",
        "image_url": "/images/generative-assets.jpg"
    }
]

# Sample blog posts with Markdown content
SAMPLE_BLOGS = [
    {
        "title": "Getting Started with Neural Radiance Fields",
        "slug": "getting-started-nerf",
        "summary": "A comprehensive guide to understanding and implementing NeRF from scratch, covering the mathematical foundations and practical implementation details.",
        "content": """# Getting Started with Neural Radiance Fields

Neural Radiance Fields (NeRF) have revolutionized the field of 3D scene reconstruction and novel view synthesis. In this post, I'll walk you through the core concepts and show you how to implement a basic NeRF from scratch.

## What are Neural Radiance Fields?

NeRF represents a 3D scene as a continuous volumetric function that maps 3D coordinates and viewing directions to color and density values. The key insight is using a neural network to learn this implicit representation directly from 2D images.

```python
def nerf_forward(positions, directions, network):
    # Positional encoding
    encoded_pos = positional_encoding(positions)
    encoded_dir = positional_encoding(directions)
    
    # Network forward pass
    density, features = network(encoded_pos)
    color = color_network(features, encoded_dir)
    
    return density, color
```

## Volume Rendering

The magic happens in volume rendering, where we integrate along rays to produce the final pixel colors:

```python
def volume_render(ray_origins, ray_directions, network, near=0.1, far=10.0, n_samples=64):
    # Sample points along rays
    t_vals = torch.linspace(near, far, n_samples)
    points = ray_origins[..., None, :] + ray_directions[..., None, :] * t_vals[..., :, None]
    
    # Get density and color predictions
    density, color = nerf_forward(points, ray_directions, network)
    
    # Compute weights using alpha compositing
    alpha = 1 - torch.exp(-density * delta_t)
    weights = alpha * torch.cumprod(1 - alpha + 1e-10, dim=-1)
    
    # Composite colors
    rgb = torch.sum(weights[..., None] * color, dim=-2)
    return rgb
```

## Training Tips

1. **Positional Encoding**: Essential for learning high-frequency details
2. **Hierarchical Sampling**: Use coarse and fine networks for efficiency
3. **Learning Rate Scheduling**: Start high and decay exponentially
4. **Regularization**: Add noise to inputs during training

## Results and Applications

NeRF has opened up incredible possibilities:
- Photorealistic novel view synthesis
- 3D content creation from photos
- Virtual reality experiences
- Digital twin creation

The field is rapidly evolving with improvements like Instant-NGP, Plenoxels, and TensoRF making real-time NeRF a reality.

## Next Steps

Try implementing a basic NeRF on a simple dataset like the Lego bulldozer. The [official implementation](https://github.com/bmild/nerf) is a great starting point.

Happy rendering! 🚀
"""
    },
    {
        "title": "Optimizing 3D Deep Learning Pipelines",
        "slug": "optimizing-3d-deep-learning",
        "summary": "Performance optimization techniques for 3D deep learning models, including memory management, GPU utilization, and data loading strategies.",
        "content": """# Optimizing 3D Deep Learning Pipelines

Working with 3D data presents unique challenges in deep learning. Large point clouds, voxel grids, and mesh data can quickly overwhelm GPU memory and slow down training. Here's what I've learned about optimization.

## Memory Management Strategies

### 1. Gradient Checkpointing

```python
import torch.utils.checkpoint as checkpoint

class OptimizedPointNet(nn.Module):
    def forward(self, x):
        # Use checkpointing for memory-intensive layers
        x = checkpoint.checkpoint(self.feature_extractor, x)
        x = self.classifier(x)
        return x
```

### 2. Mixed Precision Training

```python
from torch.cuda.amp import autocast, GradScaler

scaler = GradScaler()

for batch in dataloader:
    with autocast():
        outputs = model(batch)
        loss = criterion(outputs, targets)
    
    scaler.scale(loss).backward()
    scaler.step(optimizer)
    scaler.update()
```

## Data Loading Optimization

### Efficient Point Cloud Loading

```python
class OptimizedPointCloudDataset(Dataset):
    def __init__(self, data_dir, max_points=2048):
        self.max_points = max_points
        # Pre-compute file paths and metadata
        self.samples = self._index_samples(data_dir)
    
    def __getitem__(self, idx):
        # Use memory mapping for large files
        points = np.memmap(self.samples[idx], dtype=np.float32, mode='r')
        
        # Random sampling for consistent point count
        if len(points) > self.max_points:
            indices = np.random.choice(len(points), self.max_points, replace=False)
            points = points[indices]
        
        return torch.from_numpy(points)
```

## GPU Utilization

### Batch Size Optimization

```python
def find_optimal_batch_size(model, sample_input):
    batch_size = 1
    while True:
        try:
            # Test with current batch size
            batch = sample_input.repeat(batch_size, 1, 1)
            _ = model(batch)
            batch_size *= 2
        except RuntimeError as e:
            if "out of memory" in str(e):
                return batch_size // 2
            else:
                raise e
```

### Multi-GPU Training

```python
# Use DataParallel for simple multi-GPU setup
model = nn.DataParallel(model)

# Or DistributedDataParallel for better performance
model = nn.parallel.DistributedDataParallel(model)
```

## Profiling and Monitoring

### PyTorch Profiler

```python
from torch.profiler import profile, record_function, ProfilerActivity

with profile(activities=[ProfilerActivity.CPU, ProfilerActivity.CUDA]) as prof:
    with record_function("model_inference"):
        output = model(input)

print(prof.key_averages().table(sort_by="cuda_time_total"))
```

## Architecture-Specific Optimizations

### Point Cloud Networks
- Use sparse convolutions for large scenes
- Implement efficient k-NN search with FAISS
- Consider voxelization for regular sampling

### Mesh Networks
- Use graph neural networks with efficient message passing
- Implement custom CUDA kernels for mesh operations
- Consider mesh simplification for training

## Results

These optimizations typically yield:
- 2-3x faster training times
- 50% reduction in memory usage
- Better GPU utilization (>90%)

The key is profiling your specific use case and identifying bottlenecks systematically.
"""
    },
    {
        "title": "Building Production-Ready 3D ML Systems",
        "slug": "production-3d-ml-systems",
        "summary": "Lessons learned from deploying 3D machine learning models in production, covering scalability, monitoring, and infrastructure considerations.",
        "content": """# Building Production-Ready 3D ML Systems

Deploying 3D ML models in production comes with unique challenges. Here's what I've learned from building systems that handle millions of 3D inference requests.

## Architecture Considerations

### Microservices Design

```python
# Model serving service
class ModelService:
    def __init__(self):
        self.model = self.load_model()
        self.preprocessor = PointCloudPreprocessor()
    
    async def predict(self, point_cloud_data):
        # Async preprocessing
        processed = await self.preprocessor.process(point_cloud_data)
        
        # Batched inference
        with torch.no_grad():
            predictions = self.model(processed)
        
        return self.postprocess(predictions)
```

### Load Balancing

```yaml
# Kubernetes deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: 3d-ml-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: 3d-ml-service
  template:
    spec:
      containers:
      - name: model-server
        image: 3d-ml-service:latest
        resources:
          requests:
            nvidia.com/gpu: 1
          limits:
            nvidia.com/gpu: 1
```

## Model Optimization

### TensorRT Optimization

```python
import tensorrt as trt

def optimize_model_tensorrt(onnx_path, engine_path):
    logger = trt.Logger(trt.Logger.WARNING)
    builder = trt.Builder(logger)
    network = builder.create_network()
    parser = trt.OnnxParser(network, logger)
    
    # Parse ONNX model
    with open(onnx_path, 'rb') as model:
        parser.parse(model.read())
    
    # Build optimized engine
    config = builder.create_builder_config()
    config.max_workspace_size = 1 << 30  # 1GB
    config.set_flag(trt.BuilderFlag.FP16)  # Enable FP16
    
    engine = builder.build_engine(network, config)
    
    # Save engine
    with open(engine_path, 'wb') as f:
        f.write(engine.serialize())
```

### Model Quantization

```python
def quantize_model(model, calibration_data):
    # Post-training quantization
    model.eval()
    
    # Calibrate on representative data
    with torch.no_grad():
        for batch in calibration_data:
            _ = model(batch)
    
    # Apply quantization
    quantized_model = torch.quantization.quantize_dynamic(
        model, {torch.nn.Linear}, dtype=torch.qint8
    )
    
    return quantized_model
```

## Monitoring and Observability

### Custom Metrics

```python
from prometheus_client import Counter, Histogram, Gauge

# Define metrics
inference_counter = Counter('ml_inferences_total', 'Total ML inferences')
inference_duration = Histogram('ml_inference_duration_seconds', 'ML inference duration')
gpu_memory_usage = Gauge('gpu_memory_usage_bytes', 'GPU memory usage')

class MonitoredModel:
    def predict(self, input_data):
        start_time = time.time()
        
        try:
            result = self.model(input_data)
            inference_counter.inc()
            return result
        finally:
            duration = time.time() - start_time
            inference_duration.observe(duration)
            
            # Update GPU memory usage
            if torch.cuda.is_available():
                memory_used = torch.cuda.memory_allocated()
                gpu_memory_usage.set(memory_used)
```

### Health Checks

```python
@app.get("/health")
async def health_check():
    checks = {
        "model_loaded": model is not None,
        "gpu_available": torch.cuda.is_available(),
        "memory_ok": check_memory_usage(),
    }
    
    status = "healthy" if all(checks.values()) else "unhealthy"
    return {"status": status, "checks": checks}
```

## Data Pipeline

### Streaming Processing

```python
import apache_beam as beam

class PointCloudProcessor(beam.DoFn):
    def process(self, element):
        # Process point cloud data
        point_cloud = self.parse_point_cloud(element)
        
        # Normalize and filter
        normalized = self.normalize_points(point_cloud)
        filtered = self.remove_outliers(normalized)
        
        yield {
            'processed_points': filtered,
            'metadata': self.extract_metadata(point_cloud)
        }

# Pipeline definition
pipeline = (
    p
    | 'Read' >> beam.io.ReadFromPubSub(subscription=input_subscription)
    | 'Process' >> beam.ParDo(PointCloudProcessor())
    | 'Predict' >> beam.ParDo(ModelInference())
    | 'Write' >> beam.io.WriteToPubSub(topic=output_topic)
)
```

## Scaling Strategies

### Auto-scaling

```python
# Custom auto-scaler based on queue length
class ModelAutoScaler:
    def __init__(self, min_replicas=1, max_replicas=10):
        self.min_replicas = min_replicas
        self.max_replicas = max_replicas
    
    def scale_decision(self, queue_length, current_replicas):
        target_replicas = current_replicas
        
        if queue_length > 100:  # Scale up
            target_replicas = min(current_replicas * 2, self.max_replicas)
        elif queue_length < 10:  # Scale down
            target_replicas = max(current_replicas // 2, self.min_replicas)
        
        return target_replicas
```

## Cost Optimization

### Spot Instance Management

```python
# Handle spot instance interruptions gracefully
import signal
import sys

class GracefulShutdown:
    def __init__(self, model_service):
        self.model_service = model_service
        signal.signal(signal.SIGTERM, self.handle_shutdown)
    
    def handle_shutdown(self, signum, frame):
        print("Received shutdown signal, draining requests...")
        self.model_service.stop_accepting_requests()
        self.model_service.wait_for_completion(timeout=30)
        sys.exit(0)
```

## Key Takeaways

1. **Start Simple**: Begin with basic deployment, optimize iteratively
2. **Monitor Everything**: GPU usage, memory, latency, accuracy
3. **Plan for Scale**: Design for horizontal scaling from day one
4. **Cost Awareness**: Use spot instances, auto-scaling, and efficient models
5. **Reliability**: Implement proper error handling and graceful degradation

Production 3D ML is challenging but rewarding. The key is building robust, observable systems that can handle the unique demands of 3D data processing.
"""
    },
    {
        "title": "The Future of 3D AI: Trends and Predictions",
        "slug": "future-of-3d-ai",
        "summary": "Exploring emerging trends in 3D AI, from neural rendering to generative 3D models, and predictions for the next decade of spatial computing.",
        "content": """# The Future of 3D AI: Trends and Predictions

The intersection of AI and 3D technology is evolving rapidly. Here are the trends I'm watching and my predictions for the next decade.

## Current State of 3D AI

### Neural Rendering Revolution
- NeRF and variants (Instant-NGP, Plenoxels)
- Real-time neural rendering on mobile devices
- Integration with traditional graphics pipelines

### Generative 3D Models
- Text-to-3D generation (DreamFusion, Magic3D)
- 3D GANs and diffusion models
- Controllable 3D asset creation

## Emerging Trends

### 1. Multimodal 3D Understanding

```python
# Future API might look like this
class Multimodal3DModel:
    def understand_scene(self, rgb_image, depth_map, text_query):
        # Joint understanding of visual, spatial, and textual information
        scene_graph = self.extract_scene_graph(rgb_image, depth_map)
        answer = self.answer_spatial_question(scene_graph, text_query)
        return answer

# Example usage
model = Multimodal3DModel()
answer = model.understand_scene(
    image, depth, 
    "How many chairs are within 2 meters of the table?"
)
```

### 2. Neural Scene Representations

The future belongs to learned representations:
- Implicit neural representations (INRs)
- Neural radiance fields for dynamic scenes
- Compressed neural scene formats

### 3. Real-time 3D Generation

```python
# Streaming 3D generation
async def generate_3d_stream(text_prompt):
    async for mesh_update in model.generate_progressive(text_prompt):
        yield mesh_update  # Real-time mesh refinement
```

## Industry Applications

### Gaming and Entertainment
- Procedural world generation
- Real-time character animation
- Immersive storytelling

### Autonomous Systems
- 3D scene understanding for robotics
- Spatial AI for navigation
- Human-robot interaction in 3D space

### Architecture and Design
- AI-assisted 3D modeling
- Automated space planning
- Virtual prototyping

## Technical Predictions

### Next 2-3 Years
1. **Mobile NeRF**: Real-time neural rendering on smartphones
2. **Unified Models**: Single models handling multiple 3D tasks
3. **Better Datasets**: Large-scale 3D datasets with rich annotations

### Next 5-7 Years
1. **Photorealistic Avatars**: Real-time, personalized 3D avatars
2. **3D Foundation Models**: GPT-like models for 3D understanding
3. **Neural Graphics**: Complete replacement of traditional pipelines

### Next 10 Years
1. **Spatial Computing**: Seamless AR/VR with AI-powered 3D understanding
2. **Digital Twins**: AI-maintained 3D models of the physical world
3. **Embodied AI**: Robots with human-level 3D spatial intelligence

## Challenges Ahead

### Technical Challenges
- Computational efficiency for real-time applications
- Handling dynamic and deformable objects
- Generalization across different 3D domains

### Ethical Considerations
- Deepfake 3D content and verification
- Privacy in 3D scanning and reconstruction
- Bias in 3D AI systems

## Investment and Research Directions

### Hot Research Areas
1. **4D Scene Understanding**: Adding temporal dimension
2. **Physics-Informed 3D AI**: Incorporating physical constraints
3. **Federated 3D Learning**: Privacy-preserving 3D model training

### Promising Startups
- Neural rendering companies
- 3D content generation platforms
- Spatial AI infrastructure providers

## Preparing for the Future

### For Developers
```python
# Skills to develop
skills_roadmap = {
    "immediate": ["PyTorch3D", "Open3D", "Three.js"],
    "short_term": ["NeRF implementations", "3D diffusion models"],
    "long_term": ["Spatial computing", "Embodied AI", "Neural graphics"]
}
```

### For Companies
1. **Data Strategy**: Start collecting 3D data now
2. **Talent Acquisition**: Hire 3D AI specialists
3. **Infrastructure**: Invest in GPU compute and 3D pipelines

## Conclusion

We're at an inflection point in 3D AI. The next decade will see:
- Democratization of 3D content creation
- Integration of AI into every 3D workflow
- New forms of human-computer interaction in 3D space

The companies and individuals who invest in 3D AI capabilities now will have a significant advantage in the spatial computing era.

What trends are you most excited about? Let me know in the comments! 🚀
"""
    }
]

def generate_3d_positions(num_items, layout_type="sphere"):
    """
    Generate 3D positions for neural network layout.
    
    Args:
        num_items: Number of items to position
        layout_type: Type of layout ("sphere", "helix", "cluster")
    
    Returns:
        List of (x, y, z) tuples
    """
    positions = []
    
    if layout_type == "sphere":
        # Distribute points on a sphere using golden spiral
        golden_angle = math.pi * (3.0 - math.sqrt(5.0))  # Golden angle in radians
        
        for i in range(num_items):
            # y goes from 1 to -1
            y = 1 - (i / float(num_items - 1)) * 2
            
            # radius at y
            radius = math.sqrt(1 - y * y)
            
            # golden angle increment
            theta = golden_angle * i
            
            x = math.cos(theta) * radius
            z = math.sin(theta) * radius
            
            # Scale to desired size and add some randomness
            scale = 8.0 + random.uniform(-1.0, 1.0)
            positions.append((x * scale, y * scale, z * scale))
    
    elif layout_type == "helix":
        # Helical distribution
        for i in range(num_items):
            t = i / float(num_items) * 4 * math.pi  # 4 full rotations
            radius = 5.0 + random.uniform(-0.5, 0.5)
            
            x = radius * math.cos(t)
            z = radius * math.sin(t)
            y = (i / float(num_items) - 0.5) * 10  # Spread vertically
            
            positions.append((x, y, z))
    
    elif layout_type == "cluster":
        # Clustered distribution with multiple centers
        centers = [
            (0, 0, 0),
            (8, 3, -2),
            (-5, -4, 6),
            (3, -6, -8)
        ]
        
        for i in range(num_items):
            # Choose a random center
            center = centers[i % len(centers)]
            
            # Add random offset around center
            x = center[0] + random.uniform(-3, 3)
            y = center[1] + random.uniform(-3, 3)
            z = center[2] + random.uniform(-3, 3)
            
            positions.append((x, y, z))
    
    return positions

def create_sample_data():
    """
    Create sample data with 3D positions.
    
    Returns:
        Tuple of (projects_data, blogs_data)
    """
    # Generate positions for projects (sphere layout)
    project_positions = generate_3d_positions(len(SAMPLE_PROJECTS), "sphere")
    
    # Generate positions for blogs (helix layout for variety)
    blog_positions = generate_3d_positions(len(SAMPLE_BLOGS), "helix")
    
    # Add positions to project data
    projects_with_positions = []
    for i, project in enumerate(SAMPLE_PROJECTS):
        project_data = project.copy()
        project_data["position_x"] = project_positions[i][0]
        project_data["position_y"] = project_positions[i][1]
        project_data["position_z"] = project_positions[i][2]
        projects_with_positions.append(project_data)
    
    # Add positions to blog data
    blogs_with_positions = []
    for i, blog in enumerate(SAMPLE_BLOGS):
        blog_data = blog.copy()
        blog_data["position_x"] = blog_positions[i][0]
        blog_data["position_y"] = blog_positions[i][1]
        blog_data["position_z"] = blog_positions[i][2]
        blogs_with_positions.append(blog_data)
    
    return projects_with_positions, blogs_with_positions

if __name__ == "__main__":
    # Test the data generation
    projects, blogs = create_sample_data()
    
    print(f"Generated {len(projects)} projects and {len(blogs)} blogs")
    print("\nSample project:")
    print(f"Title: {projects[0]['title']}")
    print(f"Position: ({projects[0]['position_x']:.2f}, {projects[0]['position_y']:.2f}, {projects[0]['position_z']:.2f})")
    
    print("\nSample blog:")
    print(f"Title: {blogs[0]['title']}")
    print(f"Position: ({blogs[0]['position_x']:.2f}, {blogs[0]['position_y']:.2f}, {blogs[0]['position_z']:.2f})")