import { CommonResponse } from "../../common/dto/common-response";
import { DepartmentDto } from "../../dto/master/department-dto";

export interface DepartmentService {
  save(departmentDto: DepartmentDto): Promise<CommonResponse>;
  update(departmentDto: DepartmentDto): Promise<CommonResponse>;
  delete(departmentDto: DepartmentDto): Promise<CommonResponse>;
  find(departmentDto: DepartmentDto): Promise<CommonResponse>;
  findById(departmentId: number): Promise<CommonResponse>;
}
