/**
 * Target Detector: Uses simple proximity heuristic to find players
 * Strategy: Scan pixels around crosshair for movement/entity silhouettes
 * Assumes players are roughly humanoid-shaped and appear as distinct pixels
 */

class TargetDetector {
  constructor() {
    // Detection parameters
    this.scanRadius = 80; // ~4 blocks in pixel distance
    this.headSearchRadius = 40; // Focus on upper area (head height)
    this.entityColorThreshold = 50; // Brightness threshold to detect entities
    this.minEntitySize = 4; // Minimum pixel cluster to consider a target
  }

  /**
   * Find the nearest player target near the crosshair
   * @param {Jimp} jimpImg - Screenshot image
   * @param {Object} crosshair - {x, y} current mouse position
   * @returns {Object|null} - {x, y} position of nearest player or null
   */
  findNearestPlayer(jimpImg, crosshair) {
    const width = jimpImg.bitmap.width;
    const height = jimpImg.bitmap.height;

    // Define search area around crosshair (upper portion = head area)
    const searchAreaWidth = this.scanRadius;
    const searchAreaHeight = this.headSearchRadius;

    const minX = Math.max(0, crosshair.x - searchAreaWidth);
    const maxX = Math.min(width, crosshair.x + searchAreaWidth);
    const minY = Math.max(0, crosshair.y - searchAreaHeight);
    const maxY = Math.min(height, crosshair.y + searchAreaHeight / 2);

    // Scan for entity pixels (skin tones, clothing, movement artifacts)
    const targets = [];

    for (let y = minY; y < maxY; y++) {
      for (let x = minX; x < maxX; x++) {
        const pixel = Jimp.intToRGBA(jimpImg.getPixelColor(x, y));
        
        // Check if pixel looks like an entity (not background)
        if (this.isEntityPixel(pixel, jimpImg, x, y)) {
          targets.push({ x, y });
        }
      }
    }

    // Cluster nearby pixels into single targets
    const playerClusters = this.clusterTargets(targets);

    if (playerClusters.length === 0) {
      return null;
    }

    // Return the closest cluster to crosshair
    return this.getClosestCluster(playerClusters, crosshair);
  }

  /**
   * Determine if a pixel belongs to an entity
   * Uses simple heuristic: distinct color from sky/blocks
   */
  isEntityPixel(pixel, jimpImg, x, y) {
    const { r, g, b, a } = pixel;

    // Ignore transparent pixels
    if (a < 200) return false;

    // Skin tone detection (rough range)
    const isSkinTone = r > 180 && g > 140 && b > 110 && 
                       Math.abs(r - g) < 50 && Math.abs(r - b) < 70;

    // Clothing/equipment colors (darker, distinct)
    const isClothing = (r < 150 && g < 150 && b < 150) && 
                       !(r > 150 && g > 150 && b > 150); // Not white sky

    // Sky/bright background detection (avoid)
    const isSkyOrBright = r > 200 && g > 200 && b > 200;

    return (isSkinTone || isClothing) && !isSkyOrBright;
  }

  /**
   * Cluster nearby target pixels into distinct entities
   */
  clusterTargets(targets) {
    if (targets.length === 0) return [];

    const clusters = [];
    const visited = new Set();
    const clusterDistance = 15; // Pixels to consider as same entity

    for (let i = 0; i < targets.length; i++) {
      if (visited.has(i)) continue;

      const cluster = [targets[i]];
      visited.add(i);

      // Find nearby pixels
      for (let j = i + 1; j < targets.length; j++) {
        if (visited.has(j)) continue;

        const dist = Math.hypot(
          targets[i].x - targets[j].x,
          targets[i].y - targets[j].y
        );

        if (dist < clusterDistance) {
          cluster.push(targets[j]);
          visited.add(j);
        }
      }

      // Only accept clusters of minimum size
      if (cluster.length >= this.minEntitySize) {
        clusters.push(cluster);
      }
    }

    return clusters;
  }

  /**
   * Calculate center of mass for a cluster and return closest one
   */
  getClosestCluster(clusters, crosshair) {
    let closest = null;
    let minDistance = Infinity;

    for (const cluster of clusters) {
      // Calculate center of mass
      const centerX = cluster.reduce((sum, p) => sum + p.x, 0) / cluster.length;
      const centerY = cluster.reduce((sum, p) => sum + p.y, 0) / cluster.length;

      const distance = Math.hypot(centerX - crosshair.x, centerY - crosshair.y);

      if (distance < minDistance) {
        minDistance = distance;
        closest = { x: centerX, y: centerY };
      }
    }

    return closest;
  }
}

module.exports = { TargetDetector };
