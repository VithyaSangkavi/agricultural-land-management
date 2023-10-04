// import { CommonResponse } from "../../../common/dto/common-response";
// import { PaymentDao } from "../../../dao/payment-dao";
// import { PaymentDaoImpl } from "../../../dao/impl/payment-dao-impl";
// import { DepartmentDto } from "../../../dto/master/department-dto";
// import { CommonResSupport } from "../../../support/common-res-sup";
// import { ErrorHandlerSup } from "../../../support/error-handler-sup";
// import { DepartmentService } from "../department-service";

// /**
//  * department service layer
//  *
//  */
// export class DepartmentServiceImpl implements DepartmentService {
//   paymentDao: PaymentDao = new PaymentDaoImpl();

//   /**
//    * save new department
//    * @param departmentDto
//    * @returns
//    */
//   async save(departmentDto: DepartmentDto): Promise<CommonResponse> {
//     let cr = new CommonResponse();
//     try {
//       // validation
//       if (departmentDto.getName()) {
//         // check name already have
//         let nameDepartmentMode = await this.paymentDao.findByName(departmentDto.getName());
//         if (nameDepartmentMode) {
//           return CommonResSupport.getValidationException("Department Name Already In Use !");
//         }
//       } else {
//         return CommonResSupport.getValidationException("Department Name Cannot Be null !");
//       }

//       // save new department
//       let newDepartment = await this.paymentDao.save(departmentDto);
//       cr.setStatus(true);
//     } catch (error) {
//       cr.setStatus(false);
//       cr.setExtra(error);
//       ErrorHandlerSup.handleError(error);
//     }
//     return cr;
//   }
//   /**
//    * update department
//    * @param departmentDto
//    * @returns
//    */
//   async update(departmentDto: DepartmentDto): Promise<CommonResponse> {
//     let cr = new CommonResponse();
//     try {
//       // validation
//       if (departmentDto.getName()) {
//         // check name already have
//         let nameDepartmentMode = await this.paymentDao.findByName(departmentDto.getName());
//         if (nameDepartmentMode && nameDepartmentMode.id != departmentDto.getDepartmentId()) {
//           return CommonResSupport.getValidationException("Department Name Already In Use !");
//         }
//       } else {
//         return CommonResSupport.getValidationException("Department Name Cannot Be null !");
//       }

//       // update department
//       let updateDepartment = await this.paymentDao.update(departmentDto);
//       if (updateDepartment) {
//         cr.setStatus(true);
//       } else {
//         cr.setStatus(false);
//         cr.setExtra("Department Not Found !");
//       }
//     } catch (error) {
//       cr.setStatus(false);
//       cr.setExtra(error);
//       ErrorHandlerSup.handleError(error);
//     }
//     return cr;
//   }
//   /**
//    * delete department
//    * not delete from db.just update its status as offline
//    * @param departmentDto
//    * @returns
//    */
//   async delete(departmentDto: DepartmentDto): Promise<CommonResponse> {
//     let cr = new CommonResponse();
//     try {
//       // delete department
//       let deleteDepartment = await this.paymentDao.delete(departmentDto);
//       if (deleteDepartment) {
//         cr.setStatus(true);
//       } else {
//         cr.setStatus(false);
//         cr.setExtra("Department Not Found !");
//       }
//     } catch (error) {
//       cr.setStatus(false);
//       cr.setExtra(error);
//       ErrorHandlerSup.handleError(error);
//     }
//     return cr;
//   }
//   /**
//    * find all departments
//    * @returns
//    */
//   async find(departmentDto: DepartmentDto): Promise<CommonResponse> {
//     let cr = new CommonResponse();
//     try {
//       // find department
//       let departments = await this.paymentDao.findAll(departmentDto);
//       let departmentDtoList = new Array();
//       for (const departmentModel of departments) {
//         let departmentDto = new DepartmentDto();
//         departmentDto.filViaDbObject(departmentModel);
//         departmentDtoList.push(departmentDto);
//       }
//       if (departmentDto.getStartIndex() == 0) {
//         let count = await this.paymentDao.findCount(departmentDto);
//         cr.setCount(count);
//       }
//       cr.setStatus(true);
//       cr.setExtra(departmentDtoList);
//     } catch (error) {
//       cr.setStatus(false);
//       cr.setExtra(error);
//       ErrorHandlerSup.handleError(error);
//     }
//     return cr;
//   }
//   /**
//    * find department by id
//    * @param departmentId
//    * @returns
//    */
//   async findById(departmentId: number): Promise<CommonResponse> {
//     let cr = new CommonResponse();
//     try {
//       // find department
//       let department = await this.paymentDao.findById(departmentId);

//       let departmentDto = new DepartmentDto();
//       departmentDto.filViaDbObject(department);

//       cr.setStatus(true);
//       cr.setExtra(departmentDto);
//     } catch (error) {
//       cr.setStatus(false);
//       cr.setExtra(error);
//       ErrorHandlerSup.handleError(error);
//     }
//     return cr;
//   }
// }
