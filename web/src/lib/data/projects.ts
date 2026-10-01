export interface ProjectProperties {
  id: string;
  name: string;
  country: string;
  type: 'Zero pollution' | 'Biodiversity protection' | 'Deforestation prevention';
  color: string;
  zoom: number;
  pitch?: number;
  bearing?: number;
  description?: string;
}

export const CATEGORY_COLORS: Record<ProjectProperties['type'], string> = {
  'Zero pollution': '#C7D5E0',
  'Biodiversity protection': '#F8BA88',
  'Deforestation prevention': '#E1E692'
};

export const PROJECTS_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [104.2389, 12.5657] },
      properties: {
        id: 'from-viewers-to-rangers',
        name: 'From Powers to Rangers',
        country: 'Cambodia',
        type: 'Deforestation prevention',
        color: CATEGORY_COLORS['Deforestation prevention'],
        zoom: 9.5,
        pitch: 50,
        bearing: -15,
        description: 'Logging control in Wildlife Protected Areas using images provided by the comunity.'
      }
    },
  ]
};