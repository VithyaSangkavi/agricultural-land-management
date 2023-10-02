import { CommonResponse } from "../../../common/dto/common-response";
import { TagDaoImpl } from "../../../dao/impl/tag-dao-impl";
import { TagsDao } from "../../../dao/tags-dao";
import { TagDto } from "../../../dto/master/tags-dto";
import { CommonResSupport } from "../../../support/common-res-sup";
import { ErrorHandlerSup } from "../../../support/error-handler-sup";
import { TagService } from "../tag-service";

/**
 * tag , service layer
 */
export class TagServiceImpl implements TagService {
  // declaration and initialization
  tagDao: TagsDao = new TagDaoImpl();

  /**
   * save new tag
   * @param tagDto
   * @returns
   */
  async save(tagDto: TagDto): Promise<CommonResponse> {
    let cr: CommonResponse = new CommonResponse();
    try {
      // validation
      if (tagDto.getTagName()) {
        // check duplicate
        let tagName = await this.tagDao.findByName(tagDto.getTagName());
        if (tagName) {
          return CommonResSupport.getValidationException("Tag name already in use !");
        }
      } else {
        return CommonResSupport.getValidationException("Tag Name not found !");
      }

      // save new tag
      let savedTag = await this.tagDao.save(tagDto);

      cr.setStatus(true);
    } catch (error) {
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }

  /**
   * update tag
   * not allow to duplicate tag name
   * @param tagDto
   * @returns
   */
  async update(tagDto: TagDto): Promise<CommonResponse> {
    let cr: CommonResponse = new CommonResponse();
    try {
      // validation
      if (tagDto.getTagName()) {
        // check duplicate
        let tagName = await this.tagDao.findByName(tagDto.getTagName());
        if (tagName && tagName.id != tagDto.getId()) {
          return CommonResSupport.getValidationException("Tag name already in use !");
        }
      } else {
        return CommonResSupport.getValidationException("Tag Name not found !");
      }

      // update tag
      let updateTag = await this.tagDao.update(tagDto);
      if (updateTag) {
        cr.setStatus(true);
      } else {
        cr.setExtra("Tag Not Found");
      }
    } catch (error) {
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
  /**
   * delete tag
   * not deleting from db.just update as offline
   * @param tagDto
   * @returns
   */
  async delete(tagDto: TagDto): Promise<CommonResponse> {
    let cr: CommonResponse = new CommonResponse();
    try {
      // delete tag
      let updateTag = await this.tagDao.delete(tagDto);
      if (updateTag) {
        cr.setStatus(true);
      } else {
        cr.setExtra("Tag Not Found");
      }
    } catch (error) {
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }

  /**
   * find all the tag information
   * @param tagDto
   * @returns
   */
  async find(tagDto: TagDto): Promise<CommonResponse> {
    let cr: CommonResponse = new CommonResponse();
    try {
      // find tag
      let tagsModels = await this.tagDao.findAll(tagDto);

      let tagsDtoList: Array<TagDto> = new Array();

      for (const tagModel of tagsModels) {
        let tagDto: TagDto = new TagDto();
        tagDto.filViaDbObject(tagModel);
        tagsDtoList.push(tagDto);
      }
      if (tagDto.getStartIndex() == 0) {
        let count = await this.tagDao.findCont(tagDto);
        cr.setCount(count);
      }
      cr.setStatus(true);
      cr.setExtra(tagsDtoList);
    } catch (error) {
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }

  /**
   * find tag
   * @param tagDto
   * @returns
   */
  async findById(tagId: number): Promise<CommonResponse> {
    let cr: CommonResponse = new CommonResponse();
    try {
      // find tag
      let tagsModel = await this.tagDao.findById(tagId);

      let tagDto: TagDto = new TagDto();
      tagDto.filViaDbObject(tagsModel);
      cr.setStatus(true);
      cr.setExtra(tagDto);
    } catch (error) {
      cr.setExtra(error);
      ErrorHandlerSup.handleError(error);
    }
    return cr;
  }
}
