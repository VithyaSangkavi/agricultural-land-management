import { CropEntity } from "../../entity/master/Crop";
import { PaginationDto } from "../pagination-dto";
import { Status } from "../../enum/status";

export class CropDto extends PaginationDto {
    private crop_id: number;
    private land_id: number;
    private name: string;
    private createdDate: Date;
    private updatedDate: Date;
    private status: Status;

    filViaRequest(body) {
        if (body.crop_id) {
            this.crop_id = body.crop_id;
        }
        this.land_id = body.land_id;
        this.name = body.name;
        this.createdDate = body.createdDate;
        this.updatedDate = body.updatedDate;

        if (body.startIndex && body.maxIndex) {
            this.setStartIndex(body.startIndex);
            this.setMaxResult(body.maxResult);
        }
    
    }
}