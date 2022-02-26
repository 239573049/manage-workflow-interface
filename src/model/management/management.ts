/**
 * 部门信息
 */
export interface Department {
  id: string | undefined;
  name: string | undefined;
  code: string | undefined;
  parentId: string | undefined;
  index: number | undefined;
  companyId: string | undefined;
}