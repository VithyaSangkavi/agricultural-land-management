import { DepartmentDto } from "../dto/master/department-dto";
import { DepartmentEntity } from "../entity/master/department-entity";

export interface DepartmentDao {
  save(departmentDto: DepartmentDto): Promise<DepartmentEntity>;
  update(departmentDto: DepartmentDto): Promise<DepartmentEntity>;
  delete(departmentDto: DepartmentDto): Promise<DepartmentEntity>;
  findAll(departmentDto: DepartmentDto): Promise<DepartmentEntity[]>;
  findById(departmentId: number): Promise<DepartmentEntity>;
  findByName(name: String): Promise<DepartmentEntity>;
  findCount(departmentDto: DepartmentDto): Promise<number> ;
}
