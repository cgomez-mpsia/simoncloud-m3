export const USER_REPOSITORY_PORT = 'USER_REPOSITORY_PORT';

export interface UserEntity {
  id: string;
  name: string;
  email: string;
  role: string;
  password: string;
}

export interface UserRepositoryPort {
  findByEmail(email: string): Promise<UserEntity | null>;
}
