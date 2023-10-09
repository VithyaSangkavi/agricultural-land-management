import { LandEntity } from "../../entity/master/land-entity";
import { PaginationDto } from "../pagination-dto";
import { Status } from "../../enum/Status";
import { areaUOM } from "../../enum/areaUOM";

export class LandDto extends PaginationDto {
    private id: number;
    private name: string;
    private area: number;
    private areaUOM: areaUOM;
    private city: string;
    private createdDate: Date;
    private updatedDate: Date;
    private status: Status;

    filViaRequest(body) {

        if (body.id) {
            this.id = body.id;
        }
        this.name = body.name;
        this.area = body.area;
        this.city = body.city;
        this.areaUOM = body.areaUOM;
        this.createdDate = body.createdDate;
        this.updatedDate = body.updatedDate;
        this.status = body.status;
        if (body.startIndex && body.maxResult) {
            this.setStartIndex(body.startIndex);
            this.setMaxResult(body.maxResult);
        }
    }

    filViaDbObject(LandModel: LandEntity) {
        this.id = LandModel.id;
        this.name = LandModel.name;
        this.area = LandModel.area;
        this.city = LandModel.city;
        this.areaUOM = LandModel.areaUOM;
        this.createdDate = LandModel.createdDate;
        this.updatedDate = LandModel.updatedDate;
        this.status = LandModel.status
    }

    public getLandId(): number {
        return this.id;
    }
    
    public setLandId(id: number): void {
        this.id = id;
    }
    
    public getlandName(): string {
        return this.name;
    }
    
    public setlandName(name: string): void {
        this.name = name;
    }
    
    public getArea(): number {
        return this.area;
    }
    
    public setArea(area: number): void {
        this.area = area;
    }

    public getareaUOM(): areaUOM {
        return this.areaUOM;
    }
    
    public setareaUOM(areaUOM: areaUOM): void {
        this.areaUOM = areaUOM;
    }
    
    public getCity(): string {
        return this.city;
    }
    
    public setCity(city: string): void {
        this.city = city;
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