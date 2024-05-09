import * as L from 'leaflet';

export interface LeafletPrintOptions {
    title?: string;
    position?: L.ControlPosition;
    contentSelector?: string;
    pagesSelector?: string;

}


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

    namespace control {
        function fullscreen(v: any): L.Control;
        function browserPrint(option?: LeafletPrintOptions): L.Control;
    }

    // namespace motion {
    //     function polyline([], options, motionOptions, markerOptions): motion.polyline;
    //     function polygon([], options, motionOptions, markerOptions): motion.polygon;
    //     function group([], options): motion.group;
    //     function seq([], options): motion.seq;

    // }

    // namespace Motion.Ease {
    //     function linear(x);
    //     function swing(x);
    //     function easeInQuad(x, t, b, c, d);
    //     function easeOutQuad(x, t, b, c, d);
    //     function easeInOutQuad(x, t, b, c, d);
    //     function easeInCubic(x, t, b, c, d);
    //     function easeOutCubic(x, t, b, c, d);
    //     function easeInOutCubic(x, t, b, c, d);
    //     function easeInQuart(x, t, b, c, d);
    //     function easeOutQuart(x, t, b, c, d);
    //     function easeInOutQuart(x, t, b, c, d);
    //     function easeInQuint(x, t, b, c, d);
    //     function easeOutQuint(x, t, b, c, d);
    //     function easeInOutQuint(x, t, b, c, d);
    //     function easeInSine(x, t, b, c, d);
    //     function easeOutSine(x, t, b, c, d);
    //     function easeInOutSine(x, t, b, c, d);
    //     function easeInExpo(x, t, b, c, d);
    //     function easeOutExpo(x, t, b, c, d);
    //     function easeInOutExpo(x, t, b, c, d);
    //     function easeInCirc(x, t, b, c, d);
    //     function easeOutCirc(x, t, b, c, d);
    //     function easeInOutCirc(x, t, b, c, d);
    //     function easeInElastic(x, t, b, c, d);
    //     function easeOutElastic(x, t, b, c, d);
    //     function easeInOutElastic(x, t, b, c, d);
    //     function easeInBack(x, t, b, c, d, s);
    //     function easeOutBack(x, t, b, c, d, s);
    //     function easeInOutBack(x, t, b, c, d, s);
    //     function easeInBounce(x, t, b, c, d);
    //     function easeOutBounce(x, t, b, c, d);
    //     function easeInOutBounce(x, t, b, c, d);
    // }
    // namespace motion {
    //     interface polyline {
    //         addTo(map: L.Map): any;
    //         addTo(featureGroup: L.FeatureGroup): any;

    //         motionStart() // to start motion.
    //         motionStop() // to stop motion.
    //         motionPause() // to pause motion.
    //         motionResume() // to resume paused motion.
    //         motionToggle() // to pause motion, if it's running. To start motion if it's not. Or just resume.
    //         getMarkers() // to get multi-dimensional array of markers from all motion sub components.

    //         // - expected duration for motion in milliseconds, can be used after motion is created to start animation
    //         // and can be used during animation to change object animation duration.
    //         motionDuration(duration)

    //         // - expected motion speed in KM/H, can be used after motion is created to start animation
    //         // and can be used during animation to change object speed.
    //         motionSpeed(speed)

    //         addLatLng(latLng) // - allows to add additional point in the end for the motion animation.

    //         // Returns marker (if markerOptions is passed on creation) to attach needed behavior.
    //         // Marker will be added to the map only during animation
    //         getMarker()
    //     }
    //     interface polygon {
    //         addTo(map: L.Map): any;

    //         motionStart() // to start motion.
    //         motionStop() // to stop motion.
    //         motionPause() // to pause motion.
    //         motionResume() // to resume paused motion.
    //         motionToggle() // to pause motion, if it's running. To start motion if it's not. Or just resume.
    //         getMarkers() // to get multi-dimensional array of markers from all motion sub components.

    //         // - expected duration for motion in milliseconds, can be used after motion is created to start animation
    //         // and can be used during animation to change object animation duration.
    //         motionDuration(duration)

    //         // - expected motion speed in KM/H, can be used after motion is created to start animation
    //         // and can be used during animation to change object speed.
    //         motionSpeed(speed)

    //         addLatLng(latLng) // - allows to add additional point in the end for the motion animation.

    //         // Returns marker (if markerOptions is passed on creation) to attach needed behavior.
    //         // Marker will be added to the map only during animation
    //         getMarker()
    //     }
    //     interface group {
    //         addTo(map: L.Map): any;

    //         motionStart() // to start motion.
    //         motionStop() // to stop motion.
    //         motionPause() // to pause motion.
    //         motionResume() // to resume paused motion.
    //         motionToggle() // to pause motion, if it's running. To start motion if it's not. Or just resume.
    //         getMarkers() // to get multi-dimensional array of markers from all motion sub components.
    //     }
    //     interface seq {
    //         addTo(map: L.Map): any;

    //         motionStart() // to start motion.
    //         motionStop() // to stop motion.
    //         motionPause() // to pause motion.
    //         motionResume() // to resume paused motion.
    //         motionToggle() // to pause motion, if it's running. To start motion if it's not. Or just resume.
    //         getMarkers() // to get multi-dimensional array of markers from all motion sub components.
    //     }
    // }
}
