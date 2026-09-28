export interface MapTextureConfig {
    id: string;
    file: string;
    type: 'raster';
    opacity?: number;
    attribution?: string;
}

export interface MapTheme {
    id: string;
    bounds?: [[number, number], [number, number]];
    center: [number, number];
    zoom: number;
    mobileZoom: number;
    minZoom ?: number;
    maxZoom ?: number;
    maxPitch?: number;
    pitch?:number;
    bearing?:number,
    projection: 'globe' | 'mercator';
    colors: {
        background: string;
        water: string;
        land ?: string,
        boundariesADM0 ?: string,
        boundariesWidthLine ?: number,
        boundariesADM1 ?: string,
        boundariesWidthLine1 ?: number,
        textureOpacity ?: number;
        roads: string;
        roadsLineWidth ?: number;
        roadsOpacity ?: number;
        buildings: string;
        text: string;
    };
    text: {
        textField: string;
        textFont: string;
        textSize: number;
        textAnchor: string;
    }
    features: {
        autoRotate?: boolean; 
        autoRotateSpeed?: number;
        showTerrain: boolean;
        showHillshade?: boolean;
        showRoads: boolean;
        showStreetNames:boolean;
        showBuildings: boolean; 
        showBuildings3D: boolean;
        showCountriesNames: boolean;
        showBoundariesADM0 ?: boolean;
        showBoundariesADM1 ?: boolean;
        showBoundariesADM2 ?: boolean;
        showBoundariesADM3 ?: boolean;
        filterCountry?: string;
        filterIso?: string;
        textures?: MapTextureConfig[];
    };
}

export const THEMES: Record<string, MapTheme> = {
    'GLOBE_3D_WHITE': {
        id: 'globe-3d-white',
        center: [0, 20],
        zoom:2.7,
        mobileZoom: 2,
        minZoom: 0,
        maxPitch: 80,
        projection: 'globe',
        colors: {
            background: '#ffffffff',
            water: '#fdfeff',
            boundariesADM0: '#F8BA88',
            boundariesWidthLine: .4, 
            textureOpacity: 0.6,
            roads: '#a09f9fff',
            roadsLineWidth: 2,
            roadsOpacity: 1,
            buildings: '#9b9b9bff',
            text: '#243B4A'
        },
            text: {
            textField: 'name:en',
            textFont: 'Lexend-Regular',
            textSize: 10,
            textAnchor: 'center'
        },
        features: {
            autoRotate: true,
            autoRotateSpeed: 3,
            showTerrain: true,
            showHillshade:true,
            showRoads: false,
            showStreetNames:false,
            showBuildings: true,
            showBuildings3D: false,
            showCountriesNames: true,
            showBoundariesADM0: true,
        }
    },
    'CAMBODIA_WHITE': {
        id: 'camb-3d-white',
        center: [0, 20],
        zoom:2.7,
        mobileZoom: 2,
        minZoom: 0,
        maxPitch: 80,
        projection: 'mercator',
        colors: {
            background: '#ffffffff',
            water: '#fdfeff',
            boundariesADM0: '#F8BA88',
            boundariesWidthLine: .4, 
            textureOpacity: 0.6,
            roads: '#a09f9fff',
            roadsLineWidth: 2,
            roadsOpacity: 1,
            buildings: '#9b9b9bff',
            text: '#243B4A'
        },
            text: {
            textField: 'name:en',
            textFont: 'Lexend-Regular',
            textSize: 10,
            textAnchor: 'center'
        },
        features: {
            autoRotate: false,
            autoRotateSpeed: 3,
            showTerrain: true,
            showHillshade:true,
            showRoads: false,
            showStreetNames:false,
            showBuildings: true,
            showBuildings3D: false,
            showCountriesNames: true,
            showBoundariesADM0: true,
        }
    }
}