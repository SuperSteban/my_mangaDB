import AuthService from "../services/auth.service";
import { beforeAll, describe, expect, test } from '@jest/globals';
import { generateRandomString } from "../utils/stringRandomizer.utils";
describe("Test Suit To Register new user And Log in the User", () => {

    let resUser: any
    const randomString = generateRandomString(4);
    const userName = `Jban-${randomString}`
    const email: string = `Jban-${randomString}@gmail.com`;
    const password: string = `${randomString}`;


    beforeAll(async () => {
        resUser = await AuthService.register(userName, email, password)
    })

    test("Should return user as an object and access token  and the refresh one", () => {
        expect(Object.keys(resUser)).toEqual(["user", "access_token", "refresh_token"]);
    });
    test("The email and username should be the same that the expected", () => {

        expect(Object.keys(resUser)).toEqual(["user", "access_token", "refresh_token"]);
        expect(resUser.user.username).toBe(userName)
        expect(resUser.user.email).toBe(email);

    });
    test("The tokens have to be not null and to be stringy", () => {
        expect(Object.keys(resUser)).toEqual(["user", "access_token", "refresh_token"]);
        expect(resUser.access_token.length).toBeGreaterThan(64);
        expect(resUser.refresh_token.length).toBeGreaterThan(64);
        expect(typeof resUser.refresh_token).toBe("string");
        expect(typeof resUser.access_token).toBe("string");


    });
    test("Should return user object, and refresh and access token",async() => {
      
        const loginUser = await AuthService.login(email, password);
       expect(typeof loginUser.accessToken).toBe("string")
       expect(typeof loginUser.refreshToken).toBe("string")
       expect(loginUser.refreshToken.length).toBeGreaterThan(64)
       expect(loginUser.accessToken.length).toBeGreaterThan(64)
       expect(typeof loginUser.user.id).toBe("number")
       expect(loginUser.user.email).toContain("@");

    });


});
