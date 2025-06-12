import { object, string } from "zod";
import AuthService from "../services/auth.service";
import { describe, expect, test } from '@jest/globals';

describe("Register new user", () => {



    test("Should return user as an object and access token  and the refresh one", async() => {
        const userName = "Jbanks99991"
        const email: string = "Jbanditoks99991@gmail.com";
        const password: string = "jorge123";
        const result = await AuthService.register(userName, email, password)
        expect(Object.keys(result)).toEqual(["user", "access_token", "refresh_token"]);


    });
    test("The email and username should be the same that the expected", async() => {
        const userName = "Jbandito99991"
        const email: string = "Jbanditok919994@gmail.com";
        const password: string = "jorge123";
        const result = await AuthService.register(userName, email, password)
        expect(Object.keys(result)).toEqual(["user", "access_token", "refresh_token"]);
        expect(result.user.username).toBe(userName);
        expect(result.user.email).toBe(email);

    });
    test("The tokens have to be not null and to be stringy", async() => {
        const userName = "Jbankf3399"
        const email: string = "Jbanditok113399@gmail.com";
        const password: string = "jorge123";
        const result = await AuthService.register(userName, email, password)
        expect(Object.keys(result)).toEqual(["user", "access_token", "refresh_token"]);
        expect(result.access_token.length).toBeGreaterThan(64);
        expect(result.refresh_token.length).toBeGreaterThan(64);
        expect(typeof result.refresh_token).toBe("string");
        expect(typeof result.access_token).toBe("string");


    })


});
