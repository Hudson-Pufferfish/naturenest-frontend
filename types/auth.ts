export interface SignInCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  username: string;
  password: string;
  password2: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  status: number;
  message: string;
  data: {
    jwt: string;
    user: {
      id: string;
      email: string;
      username: string;
      firstName: string;
      lastName: string;
    };
  };
}

export interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
}
