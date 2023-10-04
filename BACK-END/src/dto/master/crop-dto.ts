import { CropEntity } from "../../entity/master/crop-entity";
import { PaginationDto } from "../pagination-dto";
import { Status } from "../../enum/Status";

export class CropDto extends PaginationDto {
    private id: number;
    private cropName: string;
    private createdDate: Date;
    private updatedDate: Date;
    private status: Status;
    private landId: number;

    filViaRequest(body) {
        if (body.id) {
            this.id = body.id;
        }
        this.landId = body.landId;
        this.cropName = body.cropName;
        this.createdDate = body.createdDate;
        this.updatedDate = body.updatedDate;

        if (body.startIndex && body.maxIndex) {
            this.setStartIndex(body.startIndex);
            this.setMaxResult(body.maxResult);
        }

    }

    filViaDbObject(cropModel: CropEntity) {
        this.id = cropModel.id;
        this.cropName = cropModel.cropName;
        this.createdDate = cropModel.createdDate;
        this.updatedDate = cropModel.updatedDate;
        this.status = cropModel.status;
        this.landId = cropModel.land.id;
    }

    public getCropId(): number {
        return this.id;
    }

    public setcropId(id: number): void {
        this.id = id;
    }

    public getLandId(): number {
        return this.landId;
    }

    public setLandId(landId: number): void {
        this.landId = landId;
    }

    public getCropName(): string {
        return this.cropName;
    }

    public setCropName(cropName: string): void {
        this.cropName = cropName;
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