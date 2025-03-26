import userProfilePage from "./page";

test('Test if patient data is successfully retrieved/displayed',()=>{
    expect(userProfilePage()).toBe(""); //i guess we gotta test to see if it matches our dummy data?
})