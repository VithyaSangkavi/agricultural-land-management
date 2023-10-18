import { CommonResponse } from "../../../common/dto/common-response";
import { UserDto } from "../../../dto/master/user-dto";
import { UserService } from "../user-service";
import { AppConfigurationsDto } from '../../../common/dto/app-configuration-dto';
import jwt from 'jsonwebtoken';

export class UserServiceImpl implements UserService {



    async login(userDto: UserDto): Promise<CommonResponse> {

        const appConfigurations = new AppConfigurationsDto();
        appConfigurations.setJwtSecret('4574sfds@64537gs');

        const secretKey = appConfigurations.getJwtSecret();

        let cr = new CommonResponse();
        try {
            if (userDto.getUsername() === 'admin@gmail.com' && userDto.getPassword() === 'admin') {
                const token = jwt.sign({ userId: userDto.getUsername() }, secretKey, { expiresIn: '5d'});

                console.log("token-user Controller : ", token)

                cr.setStatus(true);
                cr.setExtra({ message: 'Login successful', token });
            } else {
                cr.setStatus(false);
                cr.setExtra({ message: 'Invalid username or password' });
            }
        } catch (error) {
            cr.setStatus(false);
            cr.setExtra(error);
        }
        return cr;
    }
}
