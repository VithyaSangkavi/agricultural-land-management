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

    filViaDbObject(cropModel: CropEntity) {
        this.crop_id = cropModel.crop_id;
        this.land_id = cropModel.land_id;
        this.name = cropModel.name;
        this.createdDate = cropModel.createdDate;
        this.updatedDate = cropModel.updatedDate;
        this.status = cropModel.status;
    }

    public getCropId(): number {
        return this.crop_id;
    }

    public setCropId(crop_id: number): void {
        this.crop_id = crop_id;
    }

    public getLandId(): number {
        return this.land_id;
    }

    public setLandId(land_id: number): void {
        this.land_id = land_id;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public getCreatedDate(): Date {
        return this.createdDate;
    }

    public setCreatedDate(createdDate: Date): void {
        this.createdDate = createdDate;
    }

    public getUpdatedDate(): Date {
        return this.updatedDate;
    }

    public setUpdatedDate(updatedDate: Date): void {
        this.updatedDate = updatedDate;
    }

    public getStatus(): Status {
        return this.status;
    }

    public setStatus(status: Status): void {
        this.status = status;
    }

}