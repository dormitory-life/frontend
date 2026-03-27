export interface FileInfo {
  path: string
  name: string
  size: number
  last_modified?: string
  url: string
}

export interface Dormitory {
  id: string
  name: string
  address: string
  support_email: string
  description: string
  photo_links: FileInfo[]
}

export interface AvgGrade {
  id: string
  dormitory_id: string
  period_date: string

  avg_bathroom_cleanliness: number
  avg_corridor_cleanliness: number
  avg_kitchen_cleanliness: number
  avg_cleaning_frequency: number
  avg_room_spaciousness: number
  avg_corridor_spaciousness: number
  avg_kitchen_spaciousness: number
  avg_shower_location_convenience: number
  avg_equipment_maintenance: number
  avg_window_condition: number
  avg_noise_isolation: number
  avg_common_areas_equipment: number
  avg_transport_accessibility: number
  avg_administration_quality: number
  avg_residents_culture_level: number

  overall_average: number
  total_ratings: number

  created_at: string
  updated_at: string
}

export interface Review {
  review_id: string
  owner_id: string
  dormitory_id: string
  review_photos: FileInfo[]
  title: string
  description: string
  created_at: string
}

export interface Event {
  event_id: string
  dormitory_id: string
  title: string
  description: string
  event_photos: FileInfo[]
  created_at: string
}

export interface ChatMessage {
  id: string
  dormitory_id: string
  user_id: string
  email: string
  text: string
  created_at?: string
}

export interface CreateGradePayload {
  bathroom_cleanliness: number
  corridor_cleanliness: number
  kitchen_cleanliness: number
  cleaning_frequency: number
  room_spaciousness: number
  corridor_spaciousness: number
  kitchen_spaciousness: number
  shower_location_convenience: number
  equipment_maintenance: number
  window_condition: number
  noise_isolation: number
  common_areas_equipment: number
  transport_accessibility: number
  administration_quality: number
  residents_culture_level: number
}