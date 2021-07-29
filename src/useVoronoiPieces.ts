
import { voronoi } from 'd3-voronoi';
import { sum } from 'lodash';
// import { Delaunay } from 'd3-delaunay';

export type ShatteredPiece = {
  x: number,
  y: number,
  clipPath: string,
}


interface Config {
  height: number;
  width: number;
  numPieces: number;
}

export const useVoronoiPieces = ({
  height = 100,
  width = 100,
  numPieces = 2,
}: Config): {
  shatteredPieces: ShatteredPiece[],
} => {
  const vertices: [number, number][] = Array(numPieces)
    .fill([0, 0])
    .map(() => {
      return [Math.floor(Math.random() * width), Math.floor(Math.random() * height)];
    });

  const extent = voronoi().extent([
    [0, 0],
    [width, height],
  ]);

  const randomXY = (averageX: number, averageY: number) => {
    const randoX = Math.round((Math.random() * 300));
    const randoY = Math.round((Math.random() * 300));

    return {
      x: averageX > 50 ? randoX * 1 : randoX * -1,
      y: averageY > 50 ? randoY * 1 : randoX * -1,
    }
  }

  const pieces = extent(vertices).polygons();

  const shatteredPieces = pieces.map((piece) => {
    const cleanPiece = piece.filter((points) => points !== piece.data);

    const xs = cleanPiece.map(num => Math.ceil((num[0] / width) * 100))
    const averageX = sum(xs) / xs.length;

    const ys = cleanPiece.map(num => Math.ceil((num[1] / width) * 100))
    const averageY = sum(ys) / ys.length;

    const xyPercentages = piece
      .filter((points) => points !== piece.data)
      .map((point) => `${Math.ceil((point[0] / width) * 100)}% ${Math.ceil((point[1] / height) * 100)}%`)
      .join(', ');

    const { x, y } = randomXY(averageX, averageY)

    return {
      x,
      y,
      clipPath: `polygon(${xyPercentages})`,
    }
  });

  return { shatteredPieces }
}