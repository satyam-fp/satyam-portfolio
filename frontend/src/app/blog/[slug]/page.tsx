import { notFound } from 'next/navigation';
import Link from 'next/link';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import BlogMetadata from '@/components/BlogMetadata';
import { getBlog } from '@/lib/api';
import { Blog } from '@/types/api';

// Fallback mock data for development
const mockBlogs: Record<string, Blog> = {
  'getting-started-3d-ml': {
    id: 1,
    title: 'Getting Started with 3D Machine Learning',
    slug: 'getting-started-3d-ml',
    summary: 'An introduction to the fascinating world of 3D machine learning, covering point clouds, meshes, and voxels.',
    created_at: '2024-03-01',
    position_x: 0,
    position_y: 0,
    position_z: 0,
    content: `# Getting Started with 3D Machine Learning

The world of 3D machine learning is rapidly evolving, offering exciting opportunities for developers and researchers. In this post, we'll explore the fundamental concepts and data representations that make 3D ML unique.

## Understanding 3D Data Representations

### Point Clouds
Point clouds are collections of 3D points in space, each typically containing (x, y, z) coordinates and potentially additional features like color or intensity.

\`\`\`python
import numpy as np

# Simple point cloud representation
point_cloud = np.array([
    [1.0, 2.0, 3.0],  # Point 1: (x, y, z)
    [2.0, 1.0, 4.0],  # Point 2: (x, y, z)
    [3.0, 3.0, 2.0],  # Point 3: (x, y, z)
])
\`\`\`

### Meshes
Meshes represent 3D surfaces using vertices and faces, providing explicit connectivity information between points.

### Voxels
Voxels are 3D pixels that discretize space into regular grids, similar to how pixels work in 2D images.

## Key Challenges in 3D ML

1. **Irregular Structure**: Unlike images, 3D data often lacks regular structure
2. **Scale Variance**: Objects can appear at different scales and orientations
3. **Sparsity**: 3D data is often sparse, with most of the space being empty
4. **Computational Complexity**: Processing 3D data requires more computational resources

## Popular Architectures

### PointNet
PointNet was one of the first successful architectures for processing point clouds directly, using permutation-invariant operations.

### PointNet++
An extension of PointNet that captures local structures through hierarchical feature learning.

### 3D CNNs
Convolutional neural networks extended to 3D for processing voxel data.

## Getting Started

To begin your journey in 3D ML, I recommend:

1. Start with point cloud processing using libraries like Open3D
2. Experiment with PointNet implementations
3. Work with datasets like ModelNet40 or ShapeNet
4. Practice with 3D visualization tools

The field is moving fast, with new architectures and techniques emerging regularly. Stay curious and keep experimenting!`,
  },
  'realtime-neural-rendering': {
    id: 2,
    title: 'Real-time Neural Rendering Techniques',
    slug: 'realtime-neural-rendering',
    summary: 'Exploring modern techniques for real-time neural rendering and their applications in interactive 3D graphics.',
    created_at: '2024-02-15',
    position_x: 0,
    position_y: 0,
    position_z: 0,
    content: `# Real-time Neural Rendering Techniques

Neural rendering has revolutionized computer graphics by combining the power of neural networks with traditional rendering pipelines. This post explores the latest techniques that enable real-time performance.

## What is Neural Rendering?

Neural rendering uses neural networks to generate or enhance images, often by learning complex mappings from input data to photorealistic outputs.

## Key Techniques

### Neural Radiance Fields (NeRF)
NeRF represents scenes as continuous volumetric functions, enabling novel view synthesis with unprecedented quality.

### Instant NGP
NVIDIA's Instant Neural Graphics Primitives dramatically accelerated NeRF training and inference using hash encoding.

### Neural Textures
Neural textures store learned features instead of traditional RGB values, enabling more expressive surface representations.

## Real-time Considerations

Achieving real-time performance requires careful optimization:

1. **Network Architecture**: Smaller, more efficient networks
2. **Caching**: Pre-compute expensive operations
3. **Level of Detail**: Adaptive quality based on viewing distance
4. **Hardware Acceleration**: Leverage GPU tensor cores

## Applications

- Virtual and Augmented Reality
- Game Development
- Film and Animation
- Digital Twins

The future of neural rendering is bright, with new techniques emerging that push the boundaries of what's possible in real-time graphics.`,
  },
  'point-cloud-deep-learning': {
    id: 3,
    title: 'Point Cloud Processing with Deep Learning',
    slug: 'point-cloud-deep-learning',
    summary: 'Deep dive into processing 3D point clouds using neural networks, from PointNet to modern architectures.',
    created_at: '2024-01-30',
    position_x: 0,
    position_y: 0,
    position_z: 0,
    content: `# Point Cloud Processing with Deep Learning

Point clouds are one of the most important 3D data representations, especially in robotics, autonomous vehicles, and 3D scanning applications. Let's explore how deep learning has transformed point cloud processing.

## The Challenge of Point Clouds

Point clouds present unique challenges for machine learning:

- **Unordered**: Points have no inherent ordering
- **Irregular**: Non-uniform density and distribution
- **Permutation Invariant**: The same object should be recognized regardless of point order

## Evolution of Architectures

### PointNet (2017)
The breakthrough architecture that could process raw point clouds:

\`\`\`python
# Simplified PointNet concept
def pointnet_layer(points):
    # Apply MLP to each point independently
    features = mlp(points)  # [N, 3] -> [N, 64]
    
    # Global max pooling for permutation invariance
    global_feature = max_pool(features)  # [N, 64] -> [1, 64]
    
    return global_feature
\`\`\`

### PointNet++ (2017)
Added hierarchical learning to capture local structures:

1. **Sampling**: Select representative points
2. **Grouping**: Find neighboring points
3. **PointNet**: Apply PointNet to local regions

### Modern Architectures

- **Point Transformer**: Attention mechanisms for point clouds
- **PointConv**: Convolution operations adapted for irregular data
- **DGCNN**: Dynamic graph construction for local feature learning

## Applications

### Semantic Segmentation
Classify each point in the cloud (e.g., car, building, tree).

### Object Detection
Identify and localize objects in 3D space.

### Shape Classification
Recognize the category of 3D objects.

## Best Practices

1. **Data Preprocessing**: Normalize coordinates and handle varying densities
2. **Augmentation**: Rotation, scaling, and jittering for robustness
3. **Loss Functions**: Consider geometric properties in loss design
4. **Evaluation Metrics**: Use appropriate 3D metrics (IoU, Chamfer distance)

## Tools and Libraries

- **Open3D**: Comprehensive 3D data processing
- **PyTorch3D**: PyTorch-based 3D deep learning
- **MinkowskiEngine**: Sparse convolutions for 3D data

Point cloud processing continues to evolve rapidly, with new architectures and applications emerging regularly. The key is understanding the unique properties of 3D data and designing networks that respect these characteristics.`,
  },
};

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const { slug } = await params;
  let blog: Blog;

  try {
    blog = await getBlog(slug);
  } catch (error) {
    console.warn('Failed to fetch blog from API, trying mock data:', error);
    blog = mockBlogs[slug];
    
    if (!blog) {
      notFound();
    }
  }

  const formattedDate = new Date(blog.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Back Navigation */}
          <Link
            href="/blog"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            ← Back to Blog
          </Link>

          {/* Blog Header */}
          <article>
            <header className="mb-12">
              <div className="mb-6">
                <BlogMetadata blog={blog} variant="detailed" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {blog.title}
              </h1>
              
              {blog.summary && (
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                  {blog.summary}
                </p>
              )}
            </header>

            {/* Blog Content with Markdown Rendering */}
            <div className="mb-12">
              <MarkdownRenderer content={blog.content} />
            </div>
          </article>

          {/* Navigation to other posts */}
          <footer className="pt-8 border-t border-border">
            <div className="flex items-center justify-between">
              <Link
                href="/blog"
                className="inline-flex items-center text-primary hover:underline font-medium"
              >
                ← View all posts
              </Link>
              
              <div className="text-sm text-muted-foreground">
                Published on {formattedDate}
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}