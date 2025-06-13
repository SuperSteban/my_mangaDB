import {describe, expect, test} from '@jest/globals';
import  {generateToken, refreshToken} from "../config/jwt.config"
import dotenv from 'dotenv';
import { stringify } from 'querystring';
dotenv.config();
describe("Access and Refresh token generator", ()=> {
    
    const user = {
        userID: 1
    }

    test("Should return a string which contain the Access token ", () => {
        const jwtToken = generateToken(
            user
        );
        expect(typeof jwtToken).toBe("string");
        expect(jwtToken.length).toBeGreaterThan(64);
        expect(jwtToken).toContain(".");

    });

    test("Should return a string which contain the refresh token ", () => {
        const refreshJwtToken = refreshToken(
            user
        );
        expect(typeof refreshJwtToken).toBe("string");
        expect(refreshJwtToken.length).toBeGreaterThan(64);
        expect(refreshJwtToken).toContain(".");

    });

});

