import { Injectable } from "@angular/core";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "../interfaces/token.interface";

@Injectable({
    providedIn: 'root',
  })
  export class AuthService {

    private tokenKey = 'authToken';
    
    getTokenData(): DecodedToken | null {
      const token = localStorage.getItem('authToken');
      if (!token) return null;
        try {
            const decoded: DecodedToken = jwtDecode(token);
            console.log('Decoded Token:', decoded);
            return decoded;
          } catch (error) {
            console.error('Failed to decode token:', error);
            return null;
          }
        }
        
    // Verifica si el token está expirado
    /* isTokenExpired(): boolean {
      const tokenData = this.getTokenData();
      return tokenData ? tokenData.exp < Math.floor(Date.now() / 1000) : true;
    } */

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
  
    getTruckPlate(): string | null {
      const tokenData = this.getTokenData();
      return tokenData?.user_truck_plate || null;
    }

    logOut(): void {
      localStorage.removeItem(this.tokenKey);
    }
  }