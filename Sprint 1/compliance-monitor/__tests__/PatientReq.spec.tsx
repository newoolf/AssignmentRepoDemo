import userProfilePage from "../app/user/page";
import renderer from 'react-test-renderer';

describe("userProfilePage",()=> {
    it('shows us a profile', ()=> {
        
        const component = renderer.create(userProfilePage());
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();

    })
})
