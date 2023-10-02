export class AppConfigurationsDto {
  private port: number;
  private ip: string;
  private logLevel: string;
  private host: string;
  private userName: string;
  private password: string;
  private dataBase: string;
  private dataBasePort: number;
  private awsAccessKeyId: string;
  private awsSecretAccessKey: string;
  private awsTempBucket: string;
  private awsProductBucket: string;
  private awsPlanogramBucket: string;
  private awsExpireDuration: string;
  private jwtSecret: string;
  private emailUserName: string;
  private emailPassword: string;
  private emailPort: number;
  private emailSenderAddress: string;

  // media collection bucket
  private awsMediaCollectionAccessKeyId: string;
  private awsMediaCollectionSecretAccessKey: string;
  private awsMediaCollectionProductBucket: string;
  private awsMediaCollectionFieldBucket: string;
  private awsMediaCollectionExpireDuration: string;

  public getAwsMediaCollectionAccessKeyId(): string {
    return this.awsMediaCollectionAccessKeyId;
  }

  public setAwsMediaCollectionAccessKeyId(awsMediaCollectionAccessKeyId: string): void {
    this.awsMediaCollectionAccessKeyId = awsMediaCollectionAccessKeyId;
  }

  public getAwsMediaCollectionSecretAccessKey(): string {
    return this.awsMediaCollectionSecretAccessKey;
  }

  public setAwsMediaCollectionSecretAccessKey(awsMediaCollectionSecretAccessKey: string): void {
    this.awsMediaCollectionSecretAccessKey = awsMediaCollectionSecretAccessKey;
  }

  public getAwsMediaCollectionProductBucket(): string {
    return this.awsMediaCollectionProductBucket;
  }

  public setAwsMediaCollectionProductBucket(awsMediaCollectionProductBucket: string): void {
    this.awsMediaCollectionProductBucket = awsMediaCollectionProductBucket;
  }

  public getAwsMediaCollectionFieldBucket(): string {
    return this.awsMediaCollectionFieldBucket;
  }

  public setAwsMediaCollectionFieldBucket(awsMediaCollectionFieldBucket: string): void {
    this.awsMediaCollectionFieldBucket = awsMediaCollectionFieldBucket;
  }

  public getAwsMediaCollectionExpireDuration(): string {
    return this.awsMediaCollectionExpireDuration;
  }

  public setAwsMediaCollectionExpireDuration(awsMediaCollectionExpireDuration: string): void {
    this.awsMediaCollectionExpireDuration = awsMediaCollectionExpireDuration;
  }

  public getEmailSenderAddress(): string {
    return this.emailSenderAddress;
  }

  public setEmailSenderAddress(emailSenderAddress: string): void {
    this.emailSenderAddress = emailSenderAddress;
  }

  public getEmailPort(): number {
    return this.emailPort;
  }

  public setEmailPort(emailPort: number): void {
    this.emailPort = emailPort;
  }

  public getEmailUserName(): string {
    return this.emailUserName;
  }

  public setEmailUserName(emailUserName: string): void {
    this.emailUserName = emailUserName;
  }

  public getEmailPassword(): string {
    return this.emailPassword;
  }

  public setEmailPassword(emailPassword: string): void {
    this.emailPassword = emailPassword;
  }

  public getJwtSecret(): string {
    return this.jwtSecret;
  }

  public setJwtSecret(jwtSecret: string): void {
    this.jwtSecret = jwtSecret;
  }

  public getAwsExpireDuration(): string {
    return this.awsExpireDuration;
  }

  public setAwsExpireDuration(awsExpireDuration: string): void {
    this.awsExpireDuration = awsExpireDuration;
  }

  public getAwsTempBucket(): string {
    return this.awsTempBucket;
  }

  public setAwsTempBucket(awsTempBucket: string): void {
    this.awsTempBucket = awsTempBucket;
  }

  public getAwsProductBucket(): string {
    return this.awsProductBucket;
  }

  public setAwsProductBucket(awsProductBucket: string): void {
    this.awsProductBucket = awsProductBucket;
  }

  public getAwsPlanogramBucket(): string {
    return this.awsPlanogramBucket;
  }

  public setAwsPlanogramBucket(awsPlanogramBucket: string): void {
    this.awsPlanogramBucket = awsPlanogramBucket;
  }

  public getAwsAccessKeyId(): string {
    return this.awsAccessKeyId;
  }

  public setAwsAccessKeyId(awsAccessKeyId: string): void {
    this.awsAccessKeyId = awsAccessKeyId;
  }

  public getAwsSecretAccessKey(): string {
    return this.awsSecretAccessKey;
  }

  public setAwsSecretAccessKey(awsSecretAccessKey: string): void {
    this.awsSecretAccessKey = awsSecretAccessKey;
  }

  public getDataBasePort(): number {
    return this.dataBasePort;
  }

  public setDataBasePort(dataBasePort: number): void {
    this.dataBasePort = dataBasePort;
  }

  public getHost(): string {
    return this.host;
  }

  public setHost(host: string): void {
    this.host = host;
  }

  public getUserName(): string {
    return this.userName;
  }

  public setUserName(userName: string): void {
    this.userName = userName;
  }

  public getPassword(): string {
    return this.password;
  }

  public setPassword(password: string): void {
    this.password = password;
  }

  public getDataBase(): string {
    return this.dataBase;
  }

  public setDataBase(dataBase: string): void {
    this.dataBase = dataBase;
  }

  public getPort(): number {
    return this.port;
  }

  public setPort(port: number): void {
    this.port = port;
  }

  public getIp(): string {
    return this.ip;
  }

  public setIp(ip: string): void {
    this.ip = ip;
  }
}
