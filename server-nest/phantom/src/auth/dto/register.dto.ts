export interface RegisterDto {
  email: string;
  password: string;
  birthday: string;
  firstName: string;
  lastName: string;
  country?: string;
  profileImage?: string;
  gender?: string;
  isGoogle?: Boolean;
  bio?: string;
  iat?: string;
  exp?: string;
}
