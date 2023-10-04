import { CommonResponse } from "../../common/dto/common-response";
import { LandDto } from "../../dto/master/land-dto";

export interface LandDao {
    save(landDto: LandDto): Promise<CommonResponse>;
    update(landDto: LandDto): Promise<CommonResponse>;
    delete(landDto: LandDto): Promise<CommonResponse>;
    findAll(landDto: LandDto): Promise<CommonResponse[]>;
    findById(land_id: number): Promise<CommonResponse>;
}