export class UserEntity {
  id: number;
  nickname: string | null;
  provider: string;
  providerId: string;
  profileImageId: number | null;
  created_at: Date;
  modified_at: Date;
}
