import * as L from 'leaflet';

declare module 'leaflet' {
    /** Kiểu đường bao */
    type Surround = L.Circle | L.Polygon | L.Polyline | L.Rectangle;

    interface MarkerOptions {
        /** Binding dữ liệu gốc và marker, phục vụ cho việc tìm kiếm marker trên bản đồ */
        dataId?: any;
        /** Tạo marker icon tự động dựa trên Options. (Dùng thuộc tính IconOptions thì không cần gán thuộc tính Icon khi tạo marker) */
        iconOptions?: L.DivIconOptions;
        popupContent?: string;
        popupClass?: string;
        popupMinWidth?: number;
        popupMaxWidth?: number;
        popupOffset?: L.PointExpression;
        surround?: Surround;
        surroundExtra?: Surround;
        /** Thuộc tính này chỉ để kiểm tra xem marker thuộc ListNoCluster hay ListCluster. Gán giá trị không có tác dụng! */
        inListNoCLuster?: boolean;
    }

    interface MarkerClusterGroupOptions {
        hideClusterIcon?: boolean;
        iconHtml?: string;
    }

    interface DivIconOptions {
        labelContent?: string;
        rotationDeg?: number;
        flipX?: boolean;
        flipY?: boolean;
        fontAwesomeClass?: string;
        fontAwesomeColor?: string;
    }

}
