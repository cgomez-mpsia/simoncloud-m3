import { IsString, IsNotEmpty, MaxLength } from 'class-validator'

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  codigoSis!: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  password!: string
}
