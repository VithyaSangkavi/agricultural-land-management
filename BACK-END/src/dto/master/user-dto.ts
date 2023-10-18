export class UserDto {
    private username: string;
    private password: string;

    filViaRequest(body) {
   
      this.username = body.username;
      this.password = body.password;

  }
  
    getUsername(): string {
      return this.username;
    }
  
    setUsername(username: string): void {
      this.username = username;
    }
  
    getPassword(): string {
      return this.password;
    }
  
    setPassword(password: string): void {
      this.password = password;
    }
  }
  