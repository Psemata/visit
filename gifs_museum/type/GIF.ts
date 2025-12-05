import Author from "./Author";
import Tag from "./Tag";

export default interface GIF {
  id: number;
  title: string;
  permalink: string;
  thumbnail_url: string;
  linkto: string;
  creator: string;
  pixel_dimensions: string;
  frames: string;
  date_created: string;
  colors: string;
  file_size_kb: string;
  additional_notes: string;
  tags: Tag[];
  author: Author;
}
