export interface IResponseImport {
  total_lines: number;
  total_imported: number;
  total_errors?: number;
  errors?: string[];
}
