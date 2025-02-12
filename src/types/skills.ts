
export interface SkillPath {
  id: string;
  name: string;
  description: string;
  icon: string;
  level: number;
}

export interface Skill {
  id: string;
  path_id: string;
  name: string;
  description: string;
  points: number;
  level: number;
  prerequisites: string[];
  cooldown_minutes: number | null;
  requirements: {
    description: string;
  };
}

export interface UserSkillProgress {
  id: string;
  skill_id: string;
  completed_at: string | null;
  progress: number;
  times_completed: number;
  last_completed_at: string | null;
}
