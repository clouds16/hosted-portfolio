export type Discipline = "software" | "mechanical";
export type DisciplineFilter = Discipline | "all";

export type Skill = {
  category: string;
  items: string[];
  disciplines: Discipline[];
};

export type Experience = {
  company: string;
  role: string;
  period: string;
  location: string;
  bullets: string[];
  disciplines: Discipline[];
  href?: string;
};

export type Project = {
  name: string;
  desc: string;
  tags: string[];
  color: string;
  disciplines: Discipline[];
  /** Public URL to a screenshot/photo, e.g. "/projects/casex.png". Drop files
   *  in `public/projects/`. Leave undefined to render a gradient placeholder. */
  image?: string;
  imageAlt?: string;
  href?: string;
  /** Embeddable 3D CAD viewer URL. Sketchfab is the easiest path:
   *   1. Upload your CAD (.ipt, .step, .stl, .obj, .fbx supported) to sketchfab.com
   *   2. On the model page → Embed → copy the URL inside `src="..."` of the iframe
   *      (looks like https://sketchfab.com/models/<hash>/embed?ui_theme=dark)
   *   3. Paste here. The card renders the iframe in place of the image. */
  cadEmbed?: string;
};

export type Education = {
  school: string;
  degree: string;
  period?: string;
  location?: string;
  highlights?: string[];
};

export type SiteData = {
  name: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  hero: Record<DisciplineFilter, { title: string; tagline: string; stack: string }>;
  skills: Skill[];
  experience: Experience[];
  projects: Project[];
  education: Education[];
};
