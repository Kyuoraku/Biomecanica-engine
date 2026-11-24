export type SegmentLengths = {
  ankleHeight: number;
  foot: number;
  tibia: number;
  femur: number;
  torso: number;
  headNeck: number;
  arm: number;
  forearm: number;
};

export type FootLandmarks = {
  heel: number;
  midfoot: number;
  toe: number;
};

export type JointLimits = {
  ankleDorsiflexionRad: number;
  hipFlexionRad: number;
  hamstringLimitRad: number;
};

export type BodyModel = {
  height: number;
  lengths: SegmentLengths;
  foot: FootLandmarks;
  limits: JointLimits;
  pelvicTiltRad: number;
};
