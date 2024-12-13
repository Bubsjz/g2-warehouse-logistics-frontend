
export interface DecodedToken {
    user_id: number;
    user_role: 'operator' | 'manager' | 'boss';
    user_name: string;
    user_surname: string;
    user_plate?: string | null;
    user_image?: File | null;
    exp: number;    // Fecha de expiración del token (en segundos)
    [key: string]: any; // Otros posibles campos del token
  }