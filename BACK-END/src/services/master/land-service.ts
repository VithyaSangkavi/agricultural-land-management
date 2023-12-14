import { CommonResponse } from "../../common/dto/common-response";
import { LandDto } from "../../dto/master/land-dto";

export interface LandService {
    save(landDto: LandDto): Promise<CommonResponse>;
    update(landDto: LandDto): Promise<CommonResponse>;
    delete(landDto: LandDto): Promise<CommonResponse>;
    find(landDto: LandDto): Promise<CommonResponse>;
    findById(landId: number): Promise<CommonResponse>;
}