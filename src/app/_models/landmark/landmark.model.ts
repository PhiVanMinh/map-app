export class Landmark {
  id!: number;
  name!: string;
  privateName!: string;
  address!: string;
  description!: string;
  icon!: string;
  latitude!: number;
  longitude!: number;
  polygon!: string;
  polyline!: string;
  color!: number;
  radius!: number;
  /** 0: Không thuộc nhóm nào */
  groupIDs!: number[];
  categoryID!: number;
  categoryName!: string;
  companyID!: number;
  languageID!: number;
  systemID!: number;
  isVisible = true;
  isLandmarkManagement!: boolean;
  isManagementByCircle!: boolean;
  isSystemLandmark!: boolean;
  isClosed!: boolean;
  isTranslate!: boolean;
  isDisplayName = true;
  isDisplayBound = true;
  highwayVelocityAllow!: number;
  orderInRoute?: number;

  direction?: number;

  landmarkInRoute?: string;
  colorString?: string;
}

