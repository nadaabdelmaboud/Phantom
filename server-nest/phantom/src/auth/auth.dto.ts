
export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  email: string,
  password: string,
  birthday: string,
  firstName: string,
  lastName: string,
  country?: string,
  gender?: string,
  bio?: string,
  iat?: string,
  exp?: string

}
