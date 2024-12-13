import { Injectable } from "@angular/core";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "../interfaces/token.interface";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root',
  })
  export class AuthService {

    private tokenKey = environment.TOKEN_KEY;
    
    getTokenData(): DecodedToken | null {
      const token = localStorage.getItem(this.tokenKey);
      if (!token) return null;
        try {
            const decoded: DecodedToken = jwtDecode(token);
            return decoded;
          } catch (error) {
            console.error('Failed to decode token:', error);
            return null;
          }
        }

    getUserName(): string | null {
      const tokenData = this.getTokenData();
      return tokenData?.user_name || null;
    }

    getUserSurname(): string | null {
      const tokenData = this.getTokenData();
      return tokenData?.user_surname || null;
    }
  
    getUserRole(): string | null {
      const tokenData = this.getTokenData();
      return tokenData?.user_role || null;
    }
  
    getUserPlate(): string | null {
      const tokenData = this.getTokenData();
      return tokenData?.user_plate || null;
    }

    getUserImage(): File | null {
      const tokenData = this.getTokenData();
        return tokenData?.user_image || null;
    }

    saveToken(token: string): void {
      localStorage.setItem(this.tokenKey, token);
    }

    logOut(): void {
      localStorage.removeItem(this.tokenKey);
    }
  }