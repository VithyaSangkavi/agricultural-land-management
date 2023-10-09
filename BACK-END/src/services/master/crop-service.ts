import { CommonResponse } from "../../common/dto/common-response";
import { CropDto } from "../../dto/master/crop-dto";

export interface CropService {
    save(cropDto: CropDto): Promise<CommonResponse>;
    update(cropDto: CropDto): Promise<CommonResponse>;
    delete(cropDto: CropDto): Promise<CommonResponse>;
    find(cropDto: CropDto): Promise<CommonResponse>;
    findById(crop_id: number): Promise<CommonResponse>;
}
