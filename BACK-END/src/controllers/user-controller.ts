/* import { Request, Response } from 'express';
import { AppConfigurationsDto } from '../common/dto/app-configuration-dto';
import jwt from 'jsonwebtoken'; 

const appConfigurations = new AppConfigurationsDto();
appConfigurations.setJwtSecret('secretkey123');

const secretKey = appConfigurations.getJwtSecret();

export const login = (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = { username: username };

  if (username === 'admin@google.com' && password === 'admin') {
    const token = jwt.sign({ userId: user.username }, secretKey); // Use the secretKey

    res.status(200).json({ message: 'Login successful', token });
  } else {
    res.status(401).json({ message: 'Invalid username or password' });
  }
};

export default login; */

/* import { Request, Response } from 'express';
import { AppConfigurationsDto } from '../common/dto/app-configuration-dto';
import jwt from 'jsonwebtoken';

const appConfigurations = new AppConfigurationsDto();
appConfigurations.setJwtSecret('secretkey123');

const secretKey = appConfigurations.getJwtSecret();

export const login = (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (username === 'admin@google.com' && password === 'admin') {
    const token = jwt.sign({ userId: username }, secretKey);

    console.log("token-user Controller : ", token)

    res.status(200).json({ message: 'Login successful', token });
  } else {
    res.status(401).json({ message: 'Invalid username or password' });
  }
}; */


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



import { Request, Response } from 'express';
import { UserDto } from '../dto/master/user-dto';
import { UserService } from '../services/master/user-service';
import { UserServiceImpl } from '../services/master/impl/user-service-impl';

const userService: UserService = new UserServiceImpl();

export const login = async (req: Request, res: Response) => {

  const userDto = new UserDto();
  userDto.filViaRequest(req.body);

  const response = await userService.login(userDto);

  if (response.getStatus()) {
    res.status(200).json(response.getExtra());
  } else {
    res.status(401).json(response.getExtra());
  }
};



