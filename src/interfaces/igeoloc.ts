export interface IGeoloc {
    coords: {
        accuracy: number,
        altitude?: number,
        altitudeAccuracy?: number,
        heading?: any,
        latitude: number,
        longitude: number,
        speed?: number
    },
    timestamp: number
}
