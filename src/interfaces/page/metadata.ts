interface IMetadata {
  title?: string,
  date?: string,
  description?: string,

  author?: string,
  details?: string,
  publication?: boolean,
  comments?: boolean,
  categories?: string[],
  tags?: string[],
  className?: string,
  linkTitle?: string,
  sticky?: boolean,
  weight?: number,
  project?: {
    github?: string,
    tag?: string,
    version?: string,
  }
}

export default IMetadata;
