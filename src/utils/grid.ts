export interface GridConfig {
  cols: number;
  rows: number;
}

export function getOptimalGrid(count: number, width: number, height: number): GridConfig {
  if (count <= 0) return { cols: 1, rows: 1 };
  
  let bestCols = 1;
  let bestRows = count;
  let minAspectDiff = Infinity;
  const targetAspect = 1.6; // Perfect landscape aspect ratio for cards

  for (let cols = 1; cols <= count; cols++) {
    const rows = Math.ceil(count / cols);
    const cellW = width / cols;
    const cellH = height / rows;
    const aspect = cellW / cellH;
    
    // Calculate difference from target aspect ratio
    const aspectDiff = Math.abs(aspect - targetAspect);
    
    // Penalize empty cells to keep the grid full and dense
    const totalSlots = cols * rows;
    const emptySlots = totalSlots - count;
    
    const score = aspectDiff + (emptySlots * 0.25);

    if (score < minAspectDiff) {
      minAspectDiff = score;
      bestCols = cols;
      bestRows = rows;
    }
  }

  return { cols: bestCols, rows: bestRows };
}

export function getDomain(url: string): string {
  try {
    // Add protocol if missing to parse correctly
    const secureUrl = url.match(/^[a-zA-Z]+:\/\//) ? url : `https://${url}`;
    const parsed = new URL(secureUrl);
    return parsed.hostname.replace('www.', '');
  } catch (e) {
    return url;
  }
}
