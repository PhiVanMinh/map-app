export class SpeedViolationVehicle {
    vehicleID!: number;
    vehiclePlate!: string;   // Biển số
    privateCode!: string;    // Số hiệu xe
    transportType!: string;  // Loại hình
    speedVioLevel1!: number; // 5-10 km
    speedVioLevel2!: number; // 10-20 km
    speedVioLevel3!: number; // 20-35 km
    speedVioLevel4!: number; // Trên 35 km
    totalSpeedVio!: number;  // Tổng số lần vi phạm
    ratioSpeedVio!: number;  // Tỉ lệ vi phạm trên 1000 km xe chạy
    totalKmVio!: number;     // Tổng sổ km vi phạm
    totalKm!: number;        // Tổng số km đã đi
    ratioKmVio!: number;     // Tỷ lệ km vi phạm 
    totalTimeVio!: number;   // Tổng thời gian vi phạm
    totalTime!: number;      // Tổng thời gian xe đã đi
    ratioTimeVio!: number;   // Tỉ lệ thời gian vi phạm
  }