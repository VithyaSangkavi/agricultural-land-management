import { LandEntity } from "../../entity/master/Land";
import { PaginationDto } from "../pagination-dto";
import { Status } from "../../enum/status";
import { uStatus } from "../../enum/uStatus";
import { Double } from "typeorm";

export class LandDto extends PaginationDto {
    private land_id: number;
    private name: string;
    private area: Double;
    private city: string;
    private uom: uStatus;
    private createdDate: Date;
    private updatedDate: Date;
    private status: Status;

    filViaRequest(body) {

        if (body.land_id) {
            this.land_id = body.land_id;
        }
        this.name = body.name;
        this.area = body.area;
        this.city = body.city;
        this.uom = body.uom;
        this.createdDate = body.createdDate;
        this.updatedDate = body.updatedDate;
        this.status = body.status;
        if (body.startIndex && body.maxResult) {
            this.setStartIndex(body.startIndex);
            this.setMaxResult(body.maxResult);
        }
    }

    filViaDbObject(LandModel: LandEntity) {
        this.land_id = LandModel.land_id;
        this.name = LandModel.name;
        this.area = LandModel.area;
        this.city = LandModel.city;
        this.uom = LandModel.uom;
        this.createdDate = LandModel.createdDate;
        this.updatedDate = LandModel.updatedDate;
        this.status = LandModel.status
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
    
    public getArea(): Double {
        return this.area;
    }
    
    public setArea(area: Double): void {
        this.area = area;
    }
    
    public getCity(): string {
        return this.city;
    }
    
    public setCity(city: string): void {
        this.city = city;
    }
    
    public getUom(): uStatus {
        return this.uom;
    }
    
    public setUom(uom: uStatus): void {
        this.uom = uom;
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