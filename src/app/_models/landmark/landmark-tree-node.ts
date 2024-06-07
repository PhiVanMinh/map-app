export interface LandmarkTreeNode {
    id: number;
    name: string;
    iconUrl?: string;
    isGroup?: boolean;
    landmarkCategoryID?: number;
    groupIDs?: number[];
    isVisible?: boolean;
    isLandmarkManagement?: boolean;
    children?: LandmarkTreeNode[];
    checked?: boolean;
    indeterminate?: boolean;
}
