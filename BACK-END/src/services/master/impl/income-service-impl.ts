import { CommonResponse } from "../../../common/dto/common-response";
import { IncomeDao } from "../../../dao/income-dao";
import { IncomeDaoImpl } from "../../../dao/impl/income-dao-impl";
import { IncomeDto } from "../../../dto/master/income-dto";
import { CommonResSupport } from "../../../support/common-res-sup";
import { ErrorHandlerSup } from "../../../support/error-handler-sup";
import { IncomeService } from "../income-service";
import { LandDao } from "../../../dao/land-dao";
import { LandDaoImpl } from "../../../dao/impl/land-dao-impl";
import { LandEntity } from "../../../entity/master/land-entity";

/**income
 * income service layer
 *
 */
export class IncomeServiceImpl implements IncomeService {
  incomeDao: IncomeDao = new IncomeDaoImpl();
  landDao: LandDao = new LandDaoImpl();

  /**
   * save new income
   * @param incomeDto
   * @returns
   */
  async save(incomeDto: IncomeDto): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {

      //check land id
      let landModel: LandEntity = null;
      if (incomeDto.getLandId() > 0) {
        landModel = await this.landDao.findById(incomeDto.getLandId());
      } else {

        return CommonResSupport.getValidationException("Land with the specified ID does not exist!");
      }

      // save new income
      let newIncome = await this.incomeDao.save(incomeDto, landModel);
      cr.setStatus(true);
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
  /**
   * update income
   * @param incomeDto
   * @returns
   */
  async updatePrice(incomeId: number, newPrice: number): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      const updatedIncome = await this.incomeDao.updatePrice(incomeId, newPrice);

      let updatedIncomeDto = new IncomeDto();
      updatedIncomeDto.filViaRequest(updatedIncome);

      cr.setStatus(true);
      cr.setExtra(updatedIncomeDto);

    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
  /**
   * delete income
   * not delete from db.just update its status as offline
   * @param incomeDto
   * @returns
   */
  async delete(incomeDto: IncomeDto): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // delete income
      let deleteIncome = await this.incomeDao.delete(incomeDto);
      if (deleteIncome) {
        cr.setStatus(true);
      } else {
        cr.setStatus(false);
        cr.setExtra("Income Not Found !");
      }
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
  /**
   * find all incomes
   * @returns
   */
  async find(incomeDto: IncomeDto): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      // find income
      let incomes = await this.incomeDao.findAll(incomeDto);
      let incomeDtoList = new Array();
      for (const incomeModel of incomes) {
        let incomeDto = new IncomeDto();
        incomeDto.filViaRequest(incomeModel);
        incomeDtoList.push(incomeDto);
      }
      cr.setStatus(true);
      cr.setExtra(incomeDtoList);
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
  /**
   * find income by id
   * @param incomeId
   * @returns
   */
  async findById(income_id: number): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      const income = await this.incomeDao.findById(income_id);


      let incomeDto = new IncomeDto();
      incomeDto.filViaRequest(income);
      cr.setStatus(true);
      cr.setExtra(incomeDto);


    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }

  async findByLandId(land: number): Promise<CommonResponse> {
    let cr = new CommonResponse();
    try {
      let incomes = await this.incomeDao.findByLandId(land);
      let incomeDtoList = new Array();
      for (const incomeModel of incomes) {
        let incomeDto = new IncomeDto();
        incomeDto.filViaRequest(incomeModel);
        incomeDtoList.push(incomeDto);
      }
      cr.setStatus(true);
      cr.setExtra(incomeDtoList);
    } catch (error) {
      cr.setStatus(false);
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr

  }
}
