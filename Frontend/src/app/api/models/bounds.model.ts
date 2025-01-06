import { BoundingBox } from './bounding-box.model';

export interface Bounds {
  osmId: number;
  name: string;
  insideArea: object;
  outsideArea: object;
  boundingBox: BoundingBox;
}
