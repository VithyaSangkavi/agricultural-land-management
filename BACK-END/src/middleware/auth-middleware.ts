import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppConfigurationsDto } from '../common/dto/app-configuration-dto';

const appConfigurations = new AppConfigurationsDto();
const secretKey = appConfigurations.getJwtSecret();

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Missing token' });
  }

  try {
    const decoded = jwt.verify(token, secretKey); 
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Forbidden: Invalid token' });
  }
};
