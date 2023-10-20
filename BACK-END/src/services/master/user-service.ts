import { CommonResponse } from "../../common/dto/common-response";
import { UserDto } from "../../dto/master/user-dto";

export interface UserService {
  login(userDto: UserDto): Promise<CommonResponse>;
}
