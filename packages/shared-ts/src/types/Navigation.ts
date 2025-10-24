export enum POICategory {
  DEPARTMENT = 'DEPARTMENT',
  RESTROOM = 'RESTROOM',
  CAFETERIA = 'CAFETERIA',
  PHARMACY = 'PHARMACY',
  PARKING = 'PARKING',
  ELEVATOR = 'ELEVATOR',
  EXIT = 'EXIT',
}

export interface PointOfInterest {
  id: string;
  name: string;
  category: POICategory;
  building: string;
  floor: number;
  coordinates: { lat: number; lng: number; alt: number };
  description?: string;
}

export interface NavigationRoute {
  id: string;
  from: PointOfInterest;
  to: PointOfInterest;
  distance: number; // in meters
  estimatedTime: number; // in seconds
  waypoints: { lat: number; lng: number; alt: number }[];
  instructions: string[];
}
