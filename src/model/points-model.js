import { getRandomPoints } from '../mock/points.js';

const POINT_COUNT = 4;

export default class PointsModel {
  points = Array.from({ length: POINT_COUNT }, getRandomPoints);

  getPoints() {
    return this.points;
  }
}
